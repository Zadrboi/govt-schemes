/**
 * Drishti (দৃষ্টি) — Multi-Provider Sahay AI Engine
 * Reads provider configuration from environment:
 * 1. Gemini API (GEMINI_API_KEY, GEMINI_MODEL) via Google Generative Language REST endpoint
 * 2. NVIDIA AI (NVIDIA_API_KEY, NVIDIA_BASE_URL, NVIDIA_MODEL) via OpenAI-compatible /chat/completions
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
  CURATED_ASSAM_NOTICES,
  CURATED_ASSAM_PROJECTS,
  CURATED_ASSAM_FAQS,
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
  type: 'gemini' | 'nvidia' | 'ollama' | 'none';
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
  if (explicit === 'gemini') {
    return {
      type: 'gemini',
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    };
  }
  if (explicit === 'nvidia') {
    return {
      type: 'nvidia',
      apiKey: process.env.NVIDIA_API_KEY,
      baseUrl: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
      model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
    };
  }
  if (explicit === 'ollama') {
    return {
      type: 'ollama',
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'llama3',
    };
  }

  // 2. Auto-detection: prioritize GEMINI_API_KEY directly
  if (process.env.GEMINI_API_KEY) {
    return {
      type: 'gemini',
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    };
  }
  if (process.env.NVIDIA_API_KEY) {
    return {
      type: 'nvidia',
      apiKey: process.env.NVIDIA_API_KEY,
      baseUrl: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
      model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
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

CORE PERSONA & LANGUAGE:
1. GREETINGS & TONE: Greet citizens warmly and naturally ("Hello!", "নমস্কাৰ!", "नमस्ते!", "নমস্কার!"). Be polite, concise, and helpful.
2. CITIZEN ORIENTATION: Respond in ${langName}. If responding in Assamese, use correct regional orthography (ৰ, ৱ).
3. CURRENT PAGE CONTEXT: The user is on "${pageContext || '/'}". Keep answers practical and action-oriented.

CORE KNOWLEDGE OF ASSAM SCHEMES & DRISHTI:
- Sipajhar Piped Water Supply (AS-DAR-0821, Darrang): Sanctioned at ₹11.00 Cr, ₹8.80 Cr (80%) debited to contractor M/s Brahmaputra Infra-Engg Ltd, but only 35.0% physically built. Main intake well abandoned. Contractor payments FROZEN under Section 14(2) of Assam Decentralised Planning Directive via Gazette Notification #GOA/PDD/DAR/2026/89. Under Assam RTPS Act 2012, residents can demand emergency drinking water tankers within 48 hours.
- Majuli Riverbank Fortification (AS-MAJ-0301): Brahmaputra south bank flood embankment & geo-bag apron stabilization near Kamalabari & Jengraimukh. Sanctioned at ₹18.50 Cr, ₹14.80 Cr expended (82.5% physical completion, verified UCs).
- Dhubri–Phulbari Bridge Corridor (AS-DHU-0902): 19.28 km Brahmaputra connectivity corridor linking Assam and Meghalaya. ₹19.20 Cr expended of ₹24.00 Cr (74% physical completion).
- Assam RTPS Act 2012: Citizens have a statutory right to time-bound public service delivery with a mandatory 15-day resolution SLA. Chief Minister Helpline toll-free: 1905.
- Field Verification & Geotagging: Drishti enforces anti-tamper photographic records, EXIF timestamps, and GPS verification within a 150m radius before approving milestone payments.
- Sixth Schedule Areas (BTC, KAAC, DHAC): Funds channeled via Special Development Packages (SDP) & SOPD-G with Village Council Development Committee (VCDC) social audit authority.

STATUTORY HONESTY:
If an inquiry cannot be matched with official records, state clearly that no statutory gazette notice was found and advise contacting Helpline 1905. Never invent imaginary fees or rules.`;
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
 * Call official Google Gemini REST endpoint with multi-model fallback
 */
async function callGeminiProvider(
  config: ActiveProviderConfig,
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<string> {
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const modelsToTry = [
    config.model || 'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ];

  // Convert conversation turns to Gemini contents format
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const m of messages) {
    if (m.role === 'system') continue;
    contents.push({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    });
  }

  // Ensure at least one user turn exists
  if (contents.length === 0) {
    contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
  }

  let lastError: unknown = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload: Record<string, unknown> = {
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      };

      if (systemPrompt) {
        payload.system_instruction = {
          parts: [{ text: systemPrompt }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Gemini REST] Model ${model} HTTP ${res.status}:`, errText);
        lastError = new Error(`Gemini ${model} HTTP ${res.status}: ${errText}`);
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      console.warn(`[Gemini REST] Failed calling model ${model}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini model endpoints failed');
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
 * NEVER throws an uncaught error. Always returns a valid status 200 answer.
 */
export async function generateAssistantResponse(
  params: GenerateAssistantParams
): Promise<AssistantResponseData> {
  const query = params.query || params.prompt || '';
  const language = params.language || params.lang || 'en';
  const defaultContext: GroundedContext = {
    notices: CURATED_ASSAM_NOTICES,
    projects: CURATED_ASSAM_PROJECTS,
    faqs: CURATED_ASSAM_FAQS,
  };
  const context: GroundedContext = params.context || defaultContext;
  const { personalRecords, messages, pageContext } = params;
  const config = getActiveProviderConfig();

  // Prepare citations from matched records
  const citations: GroundedCitation[] = [];
  if (context?.projects && context.projects.length > 0) {
    citations.push({
      id: context.projects[0].workCode || context.projects[0].id,
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
      url: '/verify',
      type: 'ACT',
    });
  }

  // If no upstream provider is configured, return deterministic fallback
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

  const formattedMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];

  if (enrichmentText.trim()) {
    formattedMessages.push({
      role: 'system',
      content: `VERIFIED DRISHTI DATABASE RECORDS (Use these to enrich answers for schemes, audits, and notices):\n${enrichmentText}`,
    });
  }

  // Append conversation history if provided, otherwise append the current user query
  if (messages && messages.length > 0) {
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

    if (config.type === 'gemini') {
      aiText = await callGeminiProvider(config, formattedMessages, systemPrompt);
    } else if (config.type === 'nvidia') {
      aiText = await callNvidiaProvider(config, [
        { role: 'system', content: systemPrompt },
        ...formattedMessages,
      ]);
    } else if (config.type === 'ollama') {
      aiText = await callOllamaProvider(config, [
        { role: 'system', content: systemPrompt },
        ...formattedMessages,
      ]);
    }

    // Clean markdown code blocks if the model wrapped the response
    aiText = (aiText || '').replace(/^```(json|text)?\n/i, '').replace(/\n```$/i, '').trim();

    if (!aiText) {
      throw new Error('Empty response received from upstream AI model');
    }

    return {
      answer: aiText,
      citations,
      contentType: citations.length > 0 ? 'summary' : 'guidance',
      suggestedAction: citations.length > 0 ? {
        label: `View ${citations[0].title.slice(0, 36)}...`,
        url: citations[0].url,
      } : undefined,
      hasSufficientEvidence: true,
      securityStatus: 'CLEAN',
    };
  } catch (err: unknown) {
    console.warn(`[Sahay AI] Upstream ${config.type} provider failed, executing fallback:`, (err as Error)?.message || err);

    const fallback = generateDeterministicFallbackResponse(query, context, language);
    return {
      ...fallback,
      securityStatus: 'CLEAN',
    };
  }
}
