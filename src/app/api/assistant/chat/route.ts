/**
 * Poorvottar Drishti — Legacy Chat Assistant Route
 * Aliased directly to the canonical Grounded Sahay AI Assistant route
 * to guarantee unified rate limiting, OWASP LLMSVS defenses, and grounding.
 */

export const dynamic = 'force-dynamic';

export { POST } from '../route';
