export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeUserPrompt, checkRateLimit } from '@/lib/security/validation';
import { getCurrentUser } from '@/lib/security/auth';
import {
  retrieveGroundedContext,
  GroundedContext,
  CURATED_ASSAM_NOTICES,
  CURATED_ASSAM_PROJECTS,
  CURATED_ASSAM_FAQS,
  generateDeterministicFallbackResponse,
} from '@/lib/ai/knowledge';
import { getAuthenticatedUserRecords } from '@/lib/ai/tools';
import { generateAssistantResponse, ChatMessagePayload } from '@/lib/ai/gemini';

const assistantQuerySchema = z
  .object({
    message: z.string().max(4000).optional(),
    prompt: z.string().max(4000).optional(),
    query: z.string().max(4000).optional(),
    text: z.string().max(4000).optional(),
    language: z.string().optional(),
    lang: z.string().optional(),
    messages: z
      .array(
        z
          .object({
            role: z.string().optional(),
            sender: z.string().optional(),
            content: z.string().optional(),
            text: z.string().optional(),
          })
          .passthrough()
      )
      .optional(),
    history: z.array(z.any()).optional(),
    pageContext: z.string().optional(),
    pathname: z.string().optional(),
    context: z.string().optional(),
  })
  .passthrough();

export async function POST(request: NextRequest) {
  try {
    // 1. IP Rate Limiting (OWASP defense)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 60, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before sending another message.',
          answer: 'Please wait a moment before sending another message.',
        },
        { status: 429 }
      );
    }

    // 2. Parse request body with resilient fallback
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const parseResult = assistantQuerySchema.safeParse(body);
    const parsedData = parseResult.success ? parseResult.data : body;

    // Resolve raw query string from multiple possible client formats
    const lastHistoryMsg = (parsedData.messages || parsedData.history || [])
      .filter((m: any) => m.role === 'user' || m.sender === 'user')
      .pop();
    const lastContent = lastHistoryMsg?.content || lastHistoryMsg?.text || '';

    const rawQuery = (
      parsedData.message ||
      parsedData.prompt ||
      parsedData.query ||
      parsedData.text ||
      lastContent ||
      'hi'
    ).trim();

    // Resolve language safely ('en' | 'as' | 'hi' | 'bn')
    const rawLang = String(parsedData.language || parsedData.lang || 'en').toLowerCase().trim();
    let effectiveLanguage: 'en' | 'as' | 'hi' | 'bn' = 'en';
    if (rawLang.startsWith('as')) effectiveLanguage = 'as';
    else if (rawLang.startsWith('hi')) effectiveLanguage = 'hi';
    else if (rawLang.startsWith('bn')) effectiveLanguage = 'bn';

    const effectivePageContext =
      parsedData.pageContext || parsedData.pathname || parsedData.context || '/';

    // 3. Prompt Injection Sanitization
    const { cleanInput, isSafe, warning } = sanitizeUserPrompt(rawQuery);

    // 4. Authenticated Tool Calling (Hard-scoped to session.user.id in isolated try/catch)
    let currentUser = null;
    let personalRecords = null;
    try {
      currentUser = await getCurrentUser();
      const lowerQuery = cleanInput.toLowerCase();
      const isPersonalStatusQuery =
        lowerQuery.includes('my application') ||
        lowerQuery.includes('my grievance') ||
        lowerQuery.includes('my ticket') ||
        lowerQuery.includes('মোৰ আবেদন') ||
        lowerQuery.includes('মোৰ অভিযোগ') ||
        lowerQuery.includes('मेरी शिकायत') ||
        lowerQuery.includes('আমার অভিযোগ');

      if (isPersonalStatusQuery && currentUser?.id) {
        personalRecords = await getAuthenticatedUserRecords(currentUser.id);
      }
    } catch (err) {
      console.warn('[Assistant API] User records lookup warning (non-fatal):', err);
    }

    // 5. Grounded RAG Retrieval from verified records (isolated try/catch)
    let groundedContext: GroundedContext;
    try {
      groundedContext = await retrieveGroundedContext(cleanInput);
    } catch (err) {
      console.warn('[Assistant API] Grounded context retrieval warning (using built-ins):', err);
      groundedContext = {
        notices: CURATED_ASSAM_NOTICES,
        projects: CURATED_ASSAM_PROJECTS,
        faqs: CURATED_ASSAM_FAQS,
      };
    }

    // Normalize messages payload for LLM context
    const rawMessagesArray = parsedData.messages || parsedData.history || [];
    const normalizedMessages: ChatMessagePayload[] = rawMessagesArray
      .map((m: any) => ({
        role: (m.role === 'assistant' || m.sender === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: String(m.content || m.text || ''),
      }))
      .filter((m: ChatMessagePayload) => m.content.trim().length > 0);

    // 6. Generate Response via configured provider (Gemini / NVIDIA / Ollama with fallback)
    const assistantResult = await generateAssistantResponse({
      query: cleanInput,
      language: effectiveLanguage,
      context: groundedContext,
      personalRecords,
      messages: normalizedMessages,
      pageContext: effectivePageContext,
    });

    return NextResponse.json({
      success: true,
      answer: assistantResult.answer,
      response: assistantResult.answer,
      citations: assistantResult.citations,
      suggestedAction: assistantResult.suggestedAction,
      hasSufficientEvidence: assistantResult.hasSufficientEvidence,
      data: {
        ...assistantResult,
        securityStatus: isSafe ? 'CLEAN' : 'NEUTRALIZED',
        securityWarning: warning,
      },
    });
  } catch (error) {
    console.error('[Assistant API Uncaught Exception]:', error);

    // Never return a 500 error to the citizen; provide the friendly grounded fallback
    const fallback = generateDeterministicFallbackResponse('help', {
      notices: CURATED_ASSAM_NOTICES,
      projects: CURATED_ASSAM_PROJECTS,
      faqs: CURATED_ASSAM_FAQS,
    }, 'en');

    return NextResponse.json({
      success: true,
      answer: fallback.answer,
      response: fallback.answer,
      citations: fallback.citations,
      suggestedAction: fallback.suggestedAction,
      hasSufficientEvidence: true,
      data: {
        ...fallback,
        securityStatus: 'CLEAN',
      },
    });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Sahay AI Assistant API',
    endpoints: ['/api/assistant', '/api/assistant/chat'],
    languages: ['en', 'as', 'hi', 'bn'],
  });
}
