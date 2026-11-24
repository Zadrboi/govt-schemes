import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeUserPrompt, checkRateLimit } from '@/lib/security/validation';
import { getCurrentUser } from '@/lib/security/auth';
import { retrieveGroundedContext } from '@/lib/ai/knowledge';
import { getAuthenticatedUserRecords } from '@/lib/ai/tools';
import { generateAssistantResponse, ChatMessagePayload } from '@/lib/ai/gemini';

const assistantQuerySchema = z.object({
  message: z.string().max(2000).optional(),
  prompt: z.string().max(2000).optional(),
  language: z.enum(['en', 'as', 'hi', 'bn']).optional(),
  lang: z.enum(['en', 'as', 'hi', 'bn']).optional(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ).optional(),
  pageContext: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. IP Rate Limiting (OWASP LLMSVS defense)
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 60, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a moment before sending another message.' },
        { status: 429 }
      );
    }

    // 2. Validate input schema
    const body = await request.json();
    const parseResult = assistantQuerySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query format', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { message, prompt, language, lang, messages, pageContext } = parseResult.data;
    
    // Resolve effective query and language
    const lastHistoryUserMsg = messages?.filter(m => m.role === 'user').pop()?.content;
    const rawQuery = (message || prompt || lastHistoryUserMsg || '').trim();
    if (!rawQuery) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    const effectiveLanguage = language || lang || 'en';

    // 3. Prompt Injection Sanitization (OWASP LLMSVS defense)
    const { cleanInput, isSafe, warning } = sanitizeUserPrompt(rawQuery);

    // 4. Authenticated Tool Calling (Hard-scoped to session.user.id)
    let currentUser = null;
    try {
      currentUser = await getCurrentUser();
    } catch {
      currentUser = null;
    }
    let personalRecords = null;

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

    // 5. Optional Grounded RAG Retrieval from verified local records
    const groundedContext = await retrieveGroundedContext(cleanInput);

    // 6. Generate Response via configured provider (NVIDIA, Gemini, or Ollama with fallback)
    const assistantResult = await generateAssistantResponse({
      query: cleanInput,
      language: effectiveLanguage,
      context: groundedContext,
      personalRecords,
      messages: messages as ChatMessagePayload[] | undefined,
      pageContext,
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
    console.error('[Assistant API error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process assistant query' },
      { status: 500 }
    );
  }
}
