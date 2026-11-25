import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, GET } from '@/app/api/assistant/chat/route';
import { sanitizeGeminiContents } from '@/lib/ai/sanitize-contents';
import { NextRequest } from 'next/server';

describe('Sahay AI Chat Route - Turn Sanitization & Model Fallback', () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
  });

  describe('sanitizeGeminiContents', () => {
    it('drops leading model greetings and starts with user', () => {
      const input: Array<{ role: 'user' | 'model'; text: string }> = [
        { role: 'model', text: 'Hello! I am Sahay AI.' },
        { role: 'user', text: 'What is Assam?' },
      ];
      const result = sanitizeGeminiContents(input);
      expect(result.length).toBe(1);
      expect(result[0].role).toBe('user');
      expect(result[0].parts[0].text).toBe('What is Assam?');
    });

    it('merges consecutive user turns into a single user turn', () => {
      const input: Array<{ role: 'user' | 'model'; text: string }> = [
        { role: 'user', text: 'First query' },
        { role: 'user', text: 'Second query' },
      ];
      const result = sanitizeGeminiContents(input);
      expect(result.length).toBe(1);
      expect(result[0].role).toBe('user');
      expect(result[0].parts[0].text).toContain('First query');
      expect(result[0].parts[0].text).toContain('Second query');
    });

    it('preserves clean alternating user -> model -> user history', () => {
      const input: Array<{ role: 'user' | 'model'; text: string }> = [
        { role: 'user', text: 'Hello' },
        { role: 'model', text: 'Hi! How can I help?' },
        { role: 'user', text: 'Tell me about Drishti' },
      ];
      const result = sanitizeGeminiContents(input);
      expect(result.length).toBe(3);
      expect(result[0].role).toBe('user');
      expect(result[1].role).toBe('model');
      expect(result[2].role).toBe('user');
    });

    it('returns empty array if no user message is present', () => {
      const input: Array<{ role: 'user' | 'model'; text: string }> = [
        { role: 'model', text: 'Greeting 1' },
        { role: 'model', text: 'Greeting 2' },
      ];
      const result = sanitizeGeminiContents(input);
      expect(result.length).toBe(0);
    });
  });

  describe('POST & GET route handlers', () => {
    it('GET /api/assistant/chat returns ok status with verified model list', async () => {
      const res = await GET();
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('ok');
      expect(data.models).toContain('gemini-3.5-flash-lite');
      expect(data.languages).toEqual(['en', 'as', 'hi', 'bn']);
    });

    it('rejects invalid/empty payload with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('returns graceful fallback when GEMINI_API_KEY is missing without crashing', async () => {
      delete process.env.GEMINI_API_KEY;
      const req = new NextRequest('http://localhost:3000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'What is Drishti?' }),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.fallback).toBe(true);
      expect(data.errorCode).toBe('GEMINI_MISSING_KEY');
      expect(data.reply).toContain('GEMINI_API_KEY is not configured');
    });

    it('calls Gemini endpoint and strips extra quotes from GEMINI_API_KEY', async () => {
      process.env.GEMINI_API_KEY = '"test-quoted-key"';

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Solar panels convert sunlight into electricity.' }],
              },
            },
          ],
        }),
      });
      global.fetch = mockFetch;

      const req = new NextRequest('http://localhost:3000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Explain solar panels in 1 sentence',
          language: 'en',
          history: [
            { role: 'model', text: 'Hello! I am Sahay AI.' }, // Must be sanitized away
          ],
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.fallback).toBe(false);
      expect(data.reply).toContain('Solar panels');
      expect(data.model).toBe('gemini-3.5-flash-lite');

      // Verify the URL received the unquoted key
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain('key=test-quoted-key');
      expect(calledUrl).not.toContain('"test-quoted-key"');
    });

    it('automatically falls back to next model when first model returns 503/404', async () => {
      process.env.GEMINI_API_KEY = 'test-mock-key';

      let callCount = 0;
      const mockFetch = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          return {
            ok: false,
            status: 503,
            text: async () => 'Model overloaded',
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: {
                  parts: [{ text: 'Lachit Borphukan was a legendary commander of the Ahom kingdom.' }],
                },
              },
            ],
          }),
        };
      });
      global.fetch = mockFetch;

      const req = new NextRequest('http://localhost:3000/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Who was Lachit Borphukan?',
          language: 'en',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.fallback).toBe(false);
      expect(data.reply).toContain('Lachit Borphukan');
      expect(data.model).toBe('gemini-3.5-flash-lite');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
