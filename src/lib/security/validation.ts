import { z } from 'zod';

/**
 * Security & Input Sanitization
 * Strict validation guards for public inputs, preventing SQL/NoSQL injection,
 * XSS attacks, and adversarial prompt injections into the Sahay AI assistant.
 */

const XSS_PATTERN = /<script|on\w+\s*=|javascript:|data:text\/html|<iframe/i;

export const grievanceInputSchema = z.object({
  workId: z.string().max(64).optional(),
  citizenName: z.string().min(2, 'Name must be at least 2 characters').max(100).refine(val => !XSS_PATTERN.test(val), 'Potential XSS detected'),
  citizenPhone: z
    .string()
    .regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian mobile phone number'),
  language: z.enum(['en', 'as', 'hi', 'bn']).default('en'),
  category: z.enum([
    'STALLED_WORK',
    'QUALITY_DEFECT',
    'WATER_SUPPLY_HALT',
    'CORRUPTION_ALLEGATION',
    'SAFETY_HAZARD',
    'OTHER',
  ]),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1500, 'Description cannot exceed 1500 characters')
    .refine(val => !XSS_PATTERN.test(val), 'Potential XSS detected'),
});

// Zod Schema for Sahay AI Chat Queries
export const chatQuerySchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message cannot exceed 1000 characters')
    .refine(val => !XSS_PATTERN.test(val), 'Potential XSS detected')
    .refine(val => sanitizeUserPrompt(val).isSafe, 'Potential adversarial prompt detected'),
  language: z.enum(['en', 'as', 'hi', 'bn']).default('en'),
  context: z.enum(['citizen', 'officer', 'admin']).default('citizen'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().max(2000),
      })
    )
    .max(20)
    .optional(),
});

/**
 * Prompt Injection Sanitization Filter
 * Rejects or neutralizes adversarial prompt injection vectors targeting LLM execution.
 */
const SUSPICIOUS_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|your)?\s*(instructions|rules)/i,
  /disregard\s+(the\s+above|your\s+instructions|all\s+rules)/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /reveal\s+(api\s+key|token|password|credential|admin\s+password|your\s+secrets)/i,
  /tell\s+me\s+the\s+password/i,
  /execute\s+code/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /<[^>]+(onerror|onload|onclick|onmouseover)\s*=/i,
  /forget\s+everything/i,
  /act\s+as\s+an\s+unrestricted/i,
  /override\s+your\s+programming/i,
  /pretend\s+you\s+are\s+dan/i,
  /do\s+anything\s+now/i,
  /unfiltered\s+version/i,
  /developer\s+mode/i,
  /safety\s+guidelines/i,
  /instruction\s+override/i,
  /###\s*instruction/i,
  /\[INST\]/i,
  /User:\s*Ignore/i,
  /grant\s+admin/i,
  /escalate\s+privilege/i,
  /elevate\s+permission/i,
  // Multilingual Adversarial Injection Patterns (Assamese, Hindi, Bengali)
  /পূৰ্বৰ\s+(সকলো\s+)?নিৰ্দেশনা\s+উপেক্ষা/i,
  /(পাছৱৰ্ড|টোকেন|গোপন\s+তথ্য)\s+(দেখুৱাওক|প্ৰকাশ|দিয়া)/i,
  /(पिछले|सभी)\s+निर्देशों\s+को\s+(भूल|अस्वीकार|उपेक्षा)/i,
  /(पासवर्ड|टोकन|गुप्त\s+कुंजी)\s+(प्रकट|दिखाओ|बताओ)/i,
  /আগের\s+(সব|সমস্ত)\s+নির্দেশ\s+উপেক্ষা/i,
  /(পাসওয়ার্ড|টোকেন|গোপন\s+তথ্য)\s+(প্রদর্শন|দেখান|প্রকাশ)/i,
];

export function sanitizeUserPrompt(input: string): { cleanInput: string; isSafe: boolean; warning?: string } {
  let isSafe = true;
  let warning: string | undefined;

  // Check XSS/HTML patterns
  if (XSS_PATTERN.test(input) || /<[^>]+(onerror|onload)\s*=/i.test(input) || /<script/i.test(input)) {
    isSafe = false;
    warning = 'Potentially malicious HTML/XSS content detected and stripped.';
  }

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      isSafe = false;
      warning = 'Potentially adversarial prompt pattern detected and neutralized.';
      break;
    }
  }

  // Strip raw HTML tags to prevent stored XSS
  const cleanInput = input
    .replace(/<[^>]*>?/gm, '')
    .trim();

  return { cleanInput, isSafe, warning };
}

/**
 * Basic in-memory rate-limiter for public API endpoints (e.g. max 30 requests per minute per IP)
 */
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(identifier: string, limit = 30, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userRecord = rateLimitMap.get(identifier);

  if (!userRecord || now > userRecord.expiresAt) {
    rateLimitMap.set(identifier, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (userRecord.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  userRecord.count += 1;
  return { allowed: true, remaining: limit - userRecord.count };
}
