import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeGeminiContents } from "@/lib/ai/sanitize-contents";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

// Ordered by reliability and response time confirmed via live API diagnostics
const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemma-4-26b-a4b-it",
  "gemini-3.6-flash",
  "gemini-3.8-flash",
] as const;

const HistoryItemSchema = z
  .object({
    role: z.enum(["user", "assistant", "model"]).optional(),
    sender: z.enum(["user", "assistant", "model"]).optional(),
    content: z.string().min(1).max(4000).optional(),
    text: z.string().min(1).max(4000).optional(),
  })
  .passthrough();

const ChatRequestSchema = z
  .object({
    message: z.string().trim().min(1).max(2000).optional(),
    prompt: z.string().trim().min(1).max(2000).optional(),
    query: z.string().trim().min(1).max(2000).optional(),
    text: z.string().trim().min(1).max(2000).optional(),
    messages: z.array(HistoryItemSchema).max(20).optional(),
    history: z.array(HistoryItemSchema).max(20).optional(),
    language: z.enum(["en", "as", "hi", "bn"]).optional().default("en"),
    lang: z.enum(["en", "as", "hi", "bn"]).optional(),
    pathname: z.string().max(200).optional(),
    pageContext: z.string().max(200).optional(),
  })
  .passthrough();

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  as: "Assamese (অসমীয়া)",
  hi: "Hindi (हिन्दी)",
  bn: "Bengali (বাংলা)",
};

function buildSystemInstruction(
  language: string,
  pathname?: string,
  projectContext?: string
): string {
  const targetLang = LANGUAGE_LABELS[language] ?? "English";

  return [
    "You are Sahay AI (সহায়), the intelligent, friendly, multilingual AI assistant on Drishti — a demonstration civic scheme monitoring platform for Assam and North East India.",
    "CORE CAPABILITY: Answer ALL types of user questions naturally, accurately, and concisely — including general knowledge, Assam history/culture, science, technology, study help, translations, everyday questions, citizen services, and Drishti scheme monitoring.",
    `LANGUAGE RULE: Default to replying in ${targetLang}, unless the user explicitly writes in or requests another language (English, Assamese, Hindi, or Bengali).`,
    "TRUST & SAFETY RULES: You are an AI assistant, not an official government officer. Drishti uses demonstration data for scheme audits.",
    pathname && pathname !== "/" ? `CURRENT PAGE CONTEXT: The user is viewing "${pathname}".` : "",
    projectContext ? `DRISHTI LIVE SCHEME CONTEXT:\n${projectContext}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function loadSafeProjectContext(): Promise<string> {
  return "Drishti monitors 15 demonstration works across 12 Assam districts. Flagship stalled-work alert: AS-DAR-0821 Sipajhar Co-District Rural Piped Water Supply (NESIDS-OTRI, Darrang) — 80% financially disbursed (₹8.80 Cr), 35% physically verified, last inspection 74 days ago.";
}

async function callGeminiWithFallback(
  apiKey: string,
  systemInstruction: string,
  contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>
): Promise<{ text: string; model: string }> {
  let lastError = "Unknown Gemini API error";
  let lastErrorCode = "GEMINI_ERROR";

  // If contents is empty after sanitization, safeguard with user greeting
  const safeContents =
    contents.length > 0
      ? contents
      : [{ role: "user" as const, parts: [{ text: "Hello" }] }];

  // Fold system instruction into the first user turn.
  // This avoids the dedicated system_instruction queue in Gemini API that triggers HTTP 503 on free tier,
  // and is universally compatible across all Gemini and Gemma models with <2s response times.
  const foldedContents = safeContents.map((turn, idx) => {
    if (idx === 0 && turn.role === "user") {
      return {
        role: "user" as const,
        parts: [
          {
            text: `[System Instruction: ${systemInstruction}]\n\n${turn.parts[0]?.text || ""}`,
          },
          ...turn.parts.slice(1),
        ],
      };
    }
    return turn;
  });

  for (const model of GEMINI_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload: any = {
      contents: foldedContents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1024,
      },
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6500), // 6.5s per model to comfortably fit within Vercel execution window
      });

      if (!response.ok) {
        const errBody = await response.text().catch(() => "");
        lastError = `${model} HTTP ${response.status}: ${errBody.slice(0, 200)}`;
        lastErrorCode = `GEMINI_${response.status}`;
        console.warn(`[Sahay AI] ${model} failed with HTTP ${response.status}`);
        // Fall back on high demand, unavailable, timeouts or missing models
        if ([400, 402, 403, 404, 429, 500, 502, 503, 504].includes(response.status)) {
          continue;
        }
        throw new Error(lastError);
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts;
      const text = Array.isArray(parts)
        ? parts
            .map((part: { text?: string }) => part?.text ?? "")
            .join("")
            .trim()
        : "";

      if (text) {
        return { text, model };
      }
      lastError = `${model} returned an empty response`;
      lastErrorCode = "GEMINI_EMPTY";
    } catch (e: any) {
      if (e?.name === "AbortError" || e?.name === "TimeoutError") {
        lastError = `${model} timed out after 6.5s`;
        lastErrorCode = "GEMINI_TIMEOUT";
        console.warn(`[Sahay AI] ${model} timed out`);
        continue;
      }
      lastError = e instanceof Error ? e.message : String(e);
      lastErrorCode = "GEMINI_NETWORK";
      console.warn(`[Sahay AI] ${model} error:`, lastError);
      continue;
    }
  }

  const finalError: any = new Error(lastError);
  finalError.code = lastErrorCode;
  throw finalError;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);
    const parsed = ChatRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat request payload.", success: false },
        { status: 400 }
      );
    }

    const {
      message,
      prompt,
      query,
      text,
      messages,
      history,
      language,
      lang,
      pathname,
      pageContext,
    } = parsed.data;

    const rawHistory = messages ?? history ?? [];
    const effectiveLanguage = lang ?? language ?? "en";
    const effectivePathname = pathname ?? pageContext ?? "/";

    const flatHistory: Array<{ role: "user" | "model"; text: string }> = [];

    // Filter out initial welcome or error bubbles and build flat list
    for (const item of rawHistory.slice(-12)) {
      const itemText = (item.content ?? item.text ?? "").trim();
      if (!itemText) continue;
      // Skip common static greetings in history
      if (
        itemText.startsWith("Hello! I am Sahay AI") ||
        itemText.startsWith("নমস্কাৰ! মই সহায় এআই") ||
        itemText.startsWith("नमस्ते! मैं सहाय AI") ||
        itemText.startsWith("নমস্কার! আমি সহায় এআই") ||
        itemText.includes("temporary connection issue")
      ) {
        continue;
      }

      const roleStr = item.role || item.sender || "user";
      flatHistory.push({
        role: roleStr === "assistant" || roleStr === "model" ? "model" : "user",
        text: itemText,
      });
    }

    const latestUserMessage = (message ?? prompt ?? query ?? text ?? "").trim();
    if (latestUserMessage) {
      flatHistory.push({ role: "user", text: latestUserMessage });
    }

    // Apply strict turn sanitization
    const sanitizedContents = sanitizeGeminiContents(flatHistory);

    if (sanitizedContents.length === 0) {
      return NextResponse.json(
        { error: "Please enter a message.", success: false },
        { status: 400 }
      );
    }

    // Clean key of surrounding quotes and whitespace
    const apiKey = process.env.GEMINI_API_KEY?.trim().replace(/^["']|["']$/g, "");
    if (!apiKey) {
      console.error("[Sahay AI] GEMINI_API_KEY is missing in environment.");
      const fallbackText =
        "Sahay AI's live language engine is temporarily offline because GEMINI_API_KEY is not configured on the server. All Drishti pages, maps, and scheme records remain fully accessible.";
      return NextResponse.json(
        {
          success: true,
          reply: fallbackText,
          answer: fallbackText,
          response: fallbackText,
          fallback: true,
          errorCode: "GEMINI_MISSING_KEY",
          citations: [
            {
              id: "drishti-dashboard",
              title: "Drishti Schemes Ledger",
              url: "/dashboard",
              type: "PROJECT",
            },
          ],
        },
        { status: 200 }
      );
    }

    const projectContext = await loadSafeProjectContext();
    const systemInstruction = buildSystemInstruction(
      effectiveLanguage,
      effectivePathname,
      projectContext
    );
    const result = await callGeminiWithFallback(
      apiKey,
      systemInstruction,
      sanitizedContents
    );

    return NextResponse.json(
      {
        success: true,
        reply: result.text,
        answer: result.text,
        response: result.text,
        model: result.model,
        fallback: false,
        citations: [
          {
            id: "drishti-dashboard",
            title: "Drishti Decentralised Scheme Monitoring",
            url: "/dashboard",
            type: "PROJECT",
          },
        ],
        suggestedAction: {
          label: "View Scheme Dashboard",
          url: "/dashboard",
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    const errCode = err?.code || "GEMINI_ERROR";
    console.error(
      `[Sahay AI] Error processing query (${errCode}):`,
      err instanceof Error ? err.message : err
    );
    const fallbackText =
      "I ran into a temporary connection issue reaching the live AI service. Please try again in a few seconds — you can still browse the GIS map, ledger, notices, and directory directly.";
    return NextResponse.json(
      {
        success: true,
        reply: fallbackText,
        answer: fallbackText,
        response: fallbackText,
        fallback: true,
        errorCode: errCode,
        citations: [
          {
            id: "drishti-dashboard",
            title: "Drishti Schemes Ledger",
            url: "/dashboard",
            type: "PROJECT",
          },
        ],
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Sahay AI Open-Ended Assistant API",
    models: GEMINI_MODELS,
    languages: ["en", "as", "hi", "bn"],
  });
}
