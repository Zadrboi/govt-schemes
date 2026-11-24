/**
 * Drishti (দৃষ্টি) — Multi-Provider Sahay AI Engine
 * Reads provider configuration from .env.local:
 * 1. NVIDIA AI (NVIDIA_API_KEY, NVIDIA_BASE_URL, NVIDIA_MODEL) via OpenAI-compatible /chat/completions
 * 2. Gemini API (GEMINI_API_KEY, GEMINI_MODEL) via Google Generative Language
 * 3. Ollama (OLLAMA_BASE_URL, OLLAMA_MODEL) via local LLM runtime
 *
 * Provides conversational assistance for greetings and open-ended queries,
 * enriched with grounded Drishti database records when querying schemes/audits/notices,
 * and maintains a friendly conversational fallback when upstream calls fail.
 */

import {
  GroundedContext,
  GroundedCitation,
  generateDeterministicFallbackResponse,
} from './knowledge';
import { UserPersonalStatusSummary } from './tools';

export interface ChatMessagePayload {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AssistantResponseData {
  answer: string;
  citations: GroundedCitation[];
  contentType: 'quote' | 'translation' | 'summary' | 'guidance';
  suggestedAction?: {
    label: string;
    url: string;
  };
  hasSufficientEvidence: boolean;
  securityStatus: 'CLEAN' | 'NEUTRALIZED';
}

export interface GenerateAssistantParams {
  query?: string;
  prompt?: string;
  language?: 'en' | 'as' | 'hi' | 'bn';
  lang?: 'en' | 'as' | 'hi' | 'bn';
  context?: GroundedContext;
  personalRecords?: UserPersonalStatusSummary | null;
  messages?: ChatMessagePayload[];
  pageContext?: string;
}

export interface ActiveProviderConfig {
  type: 'nvidia' | 'gemini' | 'ollama' | 'none';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

const LANGUAGE_NAMES: Record<'en' | 'as' | 'hi' | 'bn', string> = {
  en: 'English',
  as: 'অসমীয়া (Assamese)',
  hi: 'हिन्दी (Hindi)',
  bn: 'বাংলা (Bengali)',
};

export function getActiveProviderConfig(): ActiveProviderConfig {
  const explicit = (process.env.AI_PROVIDER || '').toLowerCase().trim();

  // 1. Explicit AI_PROVIDER setting
  if (explicit === 'nvidia') {
    return {
      type: 'nvidia',
      apiKey: process.env.NVIDIA_API_KEY,
      baseUrl: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
      model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
    };
  }
  if (explicit === 'gemini') {
    return {
      type: 'gemini',
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
      model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
    };
  }
  if (explicit === 'ollama') {
    return {
      type: 'ollama',
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'llama3',
    };
  }

  // 2. Auto-detection based on configured keys
  if (process.env.NVIDIA_API_KEY) {
    return {
      type: 'nvidia',
      apiKey: process.env.NVIDIA_API_KEY,
      baseUrl: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
      model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
    };
  }
  if (process.env.GEMINI_API_KEY) {
    return {
      type: 'gemini',
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
      model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
    };
  }
  if (process.env.OLLAMA_BASE_URL) {
    return {
      type: 'ollama',
      baseUrl: process.env.OLLAMA_BASE_URL,
      model: process.env.OLLAMA_MODEL || 'llama3',
    };
  }

  return { type: 'none' };
}

function buildSystemPrompt(language: 'en' | 'as' | 'hi' | 'bn', pageContext?: string): string {
  const langName = LANGUAGE_NAMES[language] || 'English';

  return `You are Sahay AI (সহায়), the official, grounded, and friendly conversational assistant for Drishti (দৃষ্টি), the statutory decentralised planning, scheme monitoring, and social audit portal of Assam and North East India.

ROLE & BEHAVIOR:
1. NATURAL CONVERSATION: Greet users warmly and naturally when they say "hi", "hello", "namaste", "nomoskar", or ask general questions. Introduce your capabilities clearly and concisely without corporate or bureaucratic jargon.
2. CITIZEN ORIENTATION: Respond in ${langName}. If responding in Assamese, use correct regional glyphs (ৰ, ৱ).
3. STATUTORY ENRICHMENT: When the user asks about infrastructure schemes (NESIDS, PM-DevINE, Assam Darshan, NEC), projects, fund releases, physical progress, gazette orders, ASTC transport routes, or water testing labs, use the verified Drishti database context provided below to give precise, grounded facts.
4. HONESTY: If a specific official record, work code, or gazette order is not in the verified database or local records, state that clearly and advise the citizen to dial toll-free Helpline 1905 or visit their nearest Block Development Office. Never invent fake subsidy rules or fees.
5. CURRENT INTERACTION CONTEXT: The citizen is currently browsing the Drishti page: ${pageContext || '/'}. Keep your answer relevant and action-oriented.`;
}

function buildEnrichmentText(context: GroundedContext, personalRecords?: UserPersonalStatusSummary | null): string {
  const parts: string[] = [];

  if (context.projects && context.projects.length > 0) {
    parts.push(`MATCHING PROJECT WORKS IN DRISHTI LEDGER:\n${JSON.stringify(context.projects, null, 2)}`);
  }
  if (context.notices && context.notices.length > 0) {
    parts.push(`STATUTORY GAZETTE NOTICES:\n${JSON.stringify(context.notices, null, 2)}`);
  }
  if (context.faqs && context.faqs.length > 0) {
    parts.push(`CURATED STATUTORY RULES & PROVISIONS (RTPS 2012 / Section 14(2)):\n${JSON.stringify(context.faqs, null, 2)}`);
  }
  if (personalRecords) {
    parts.push(`AUTHENTICATED CITIZEN RECORDS:\n${JSON.stringify(personalRecords, null, 2)}`);
  }

  return parts.join('\n\n');
}

/**
 * Call NVIDIA OpenAI-compatible API
 */
async function callNvidiaProvider(
  config: ActiveProviderConfig,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const baseUrl = config.baseUrl || 'https://integrate.api.nvidia.com/v1';
  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'nvidia/nemotron-3-ultra-550b-a55b',
      messages,
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`NVIDIA API HTTP ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('No content in NVIDIA response');
  return text.trim();
}

/**
 * Call Gemini API with automatic model fallback
 */
async function callGeminiProvider(
  config: ActiveProviderConfig,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const apiKey = config.apiKey;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const modelsToTry = [
    config.model || 'gemini-3-flash-preview',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];

  // Convert chat messages to Gemini prompt format
  const systemMsg = messages.find((m) => m.role === 'system')?.content || '';
  const conversation = messages
    .filter((m) => m.role !== 'system')
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n');

  const fullPrompt = systemMsg ? `${systemMsg}\n\n---\nConversation History:\n${conversation}` : conversation;

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = new Error(`Gemini ${model} HTTP ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini model endpoints failed');
}

/**
 * Call Ollama Local API
 */
async function callOllamaProvider(
  config: ActiveProviderConfig,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const baseUrl = (config.baseUrl || 'http://localhost:11434').replace(/\/+$/, '');
  const url = `${baseUrl}/api/chat`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model || 'llama3',
      messages,
      stream: false,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ollama HTTP ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.message?.content;
  if (!text) throw new Error('No content in Ollama response');
  return text.trim();
}

/**
 * Core entry point for generating conversational or grounded assistant answers
 */
export async function generateAssistantResponse(
  params: GenerateAssistantParams
): Promise<AssistantResponseData> {
  const query = params.query || params.prompt || '';
  const language = params.language || params.lang || 'en';
  const defaultContext: GroundedContext = { notices: [], projects: [], faqs: [] };
  const context: GroundedContext = params.context || defaultContext;
  const { personalRecords, messages, pageContext } = params;
  const config = getActiveProviderConfig();

  // Prepare citations from matched database records
  const citations: GroundedCitation[] = [];
  if (context?.projects && context.projects.length > 0) {
    citations.push({
      id: context.projects[0].id,
      title: `${context.projects[0].workCode}: ${context.projects[0].title}`,
      url: `/assets/${context.projects[0].workCode}`,
      type: 'PROJECT',
    });
  }
  if (context?.notices && context.notices.length > 0) {
    citations.push({
      id: context.notices[0].id,
      title: context.notices[0].title,
      url: `/notices/${context.notices[0].id}`,
      type: 'NOTICE',
    });
  }
  if (context?.faqs && context.faqs.length > 0) {
    citations.push({
      id: 'rtps-act-2012',
      title: context.faqs[0].act,
      url: '/policies',
      type: 'ACT',
    });
  }

  // If no upstream provider is configured, return the deterministic fallback
  if (config.type === 'none') {
    const fallback = generateDeterministicFallbackResponse(query, context, language);
    return {
      ...fallback,
      securityStatus: 'CLEAN',
    };
  }

  // Build message history for the LLM
  const systemPrompt = buildSystemPrompt(language, pageContext);
  const enrichmentText = buildEnrichmentText(context, personalRecords);

  const formattedMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  if (enrichmentText.trim()) {
    formattedMessages.push({
      role: 'system',
      content: `VERIFIED DRISHTI DATABASE RECORDS (Use these to enrich answers for schemes, audits, and notices):\n${enrichmentText}`,
    });
  }

  // Append conversation history if provided, otherwise append the current user query
  if (messages && messages.length > 0) {
    // Keep last 8 turns to avoid context overflow
    const recent = messages.slice(-8);
    for (const msg of recent) {
      formattedMessages.push({
        role: msg.role === 'system' ? 'system' : msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      });
    }
  } else {
    formattedMessages.push({ role: 'user', content: query });
  }

  try {
    let aiText = '';

    if (config.type === 'nvidia') {
      aiText = await callNvidiaProvider(config, formattedMessages);
    } else if (config.type === 'gemini') {
      aiText = await callGeminiProvider(config, formattedMessages);
    } else if (config.type === 'ollama') {
      aiText = await callOllamaProvider(config, formattedMessages);
    }

    // Clean markdown code blocks if the model wrapped the answer
    aiText = aiText.replace(/^```(json|text)?\n/i, '').replace(/\n```$/i, '').trim();

    return {
      answer: aiText,
      citations,
      contentType: citations.length > 0 ? 'summary' : 'guidance',
      suggestedAction: citations.length > 0 ? {
        label: `View ${citations[0].title.slice(0, 32)}...`,
        url: citations[0].url,
      } : undefined,
      hasSufficientEvidence: true,
      securityStatus: 'CLEAN',
    };
  } catch (err: any) {
    console.warn(`[Sahay AI] Upstream provider ${config.type} call failed, using graceful fallback:`, err?.message || err);

    // Fall back gracefully to friendly conversational or grounded fallback
    const fallback = generateDeterministicFallbackResponse(query, context, language);
    return {
      ...fallback,
      securityStatus: 'CLEAN',
    };
  }
}
