import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, GET } from '@/app/api/assistant/chat/route';
import { NextRequest } from 'next/server';

describe('Sahay AI Chat Route - Open-Ended Gemini Integration', () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
  });

  it('GET /api/assistant/chat returns ok status with model list and supported languages', async () => {
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
    expect(data.reply).toContain('GEMINI_API_KEY is not configured');
  });

  it('calls Gemini endpoint and returns open-ended answer with model identifier', async () => {
    process.env.GEMINI_API_KEY = 'test-mock-key';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Solar panels convert sunlight into direct current electricity using photovoltaic cells.' }],
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
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.fallback).toBe(false);
    expect(data.reply).toContain('Solar panels');
    expect(data.model).toBe('gemini-3.5-flash-lite');
    expect(mockFetch).toHaveBeenCalled();
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
    expect(data.model).toBe('gemini-3.8-flash');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
