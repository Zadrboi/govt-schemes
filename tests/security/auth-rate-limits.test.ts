import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';
import {
  checkRateLimit,
  clearRateLimit,
  csrfVerify,
  csrfVerifyHeader,
  passwordHash,
  passwordVerify,
  generateTOTPSecret,
  verifyTOTP,
  generateTOTPToken,
  getTOTPUri,
  sessionCookieOptions,
  mfaCookieOptions,
  redactLog,
  redactObject,
} from '@/lib/validation';
import { SignJWT, jwtVerify } from 'jose';

describe('Security: Auth Rate Limits & Session Security', () => {
  describe('Rate Limiting', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      clearRateLimit('test-user-1');
      clearRateLimit('test-user-2');
      clearRateLimit('test-user-3');
      clearRateLimit('auth-user');
      clearRateLimit('user-1');
      clearRateLimit('user-2');
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('allows requests within rate limit', async () => {
      const result = await checkRateLimit('test-user-1', 30, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
      expect(result.blocked).toBeUndefined();
    });

    it('blocks requests exceeding rate limit', async () => {
      // Make 30 requests
      for (let i = 0; i < 30; i++) {
        const result = await checkRateLimit('test-user-2', 30, 60000);
        expect(result.allowed).toBe(true);
      }

      // 31st request should be blocked
      const result = await checkRateLimit('test-user-2', 30, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.blocked).toBe(true);
      expect(result.resetAt).toBeGreaterThan(Date.now());
    });

    it('resets rate limit after window expires', async () => {
      // Exhaust the limit
      for (let i = 0; i < 30; i++) {
        await checkRateLimit('test-user-3', 30, 60000);
      }
      
      // Advance time past the window
      vi.advanceTimersByTime(61000);
      
      // Should be allowed again
      const result = await checkRateLimit('test-user-3', 30, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
    });

    it('tracks rate limits per identifier independently', async () => {
      // Exhaust user1's limit
      for (let i = 0; i < 30; i++) {
        await checkRateLimit('user-1', 30, 60000);
      }
      
      // user2 should still have full limit
      const result = await checkRateLimit('user-2', 30, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(29);
    });

    it('enforces stricter limits for auth endpoints', async () => {
      // Auth endpoints: 5 attempts per 15 minutes
      for (let i = 0; i < 5; i++) {
        const result = await checkRateLimit('auth-user', 5, 15 * 60 * 1000);
        expect(result.allowed).toBe(true);
      }
      
      const result = await checkRateLimit('auth-user', 5, 15 * 60 * 1000);
      expect(result.allowed).toBe(false);
    });
  });

  describe('CSRF Protection', () => {
    it('verifies matching origin', () => {
      const result = csrfVerify('https://example.com/page', 'https://example.com');
      expect(result).toBe(true);
    });

    it('verifies matching origin with header function', () => {
      const result = csrfVerifyHeader('https://example.com', 'https://example.com');
      expect(result).toBe(true);
    });

    it('rejects mismatched origin', () => {
      const result = csrfVerify('https://evil.com/page', 'https://example.com');
      expect(result).toBe(false);
    });

    it('rejects empty referer', () => {
      const result = csrfVerify(null, 'https://example.com');
      expect(result).toBe(false);
    });

    it('rejects invalid referer URL', () => {
      const result = csrfVerify('not-a-url', 'https://example.com');
      expect(result).toBe(false);
    });
  });

  describe('Password Security', () => {
    it('hashes password with bcrypt cost 12', async () => {
      const password = 'demo1234';
      const hash = await passwordHash(password);
      
      expect(hash).toBeDefined();
      expect(hash.startsWith('$2b$12$')).toBe(true);
    });

    it('verifies correct password', async () => {
      const password = 'demo1234';
      const hash = await passwordHash(password);
      const valid = await passwordVerify(password, hash);
      expect(valid).toBe(true);
    });

    it('rejects incorrect password', async () => {
      const password = 'demo1234';
      const hash = await passwordHash(password);
      const valid = await passwordVerify('wrongpassword', hash);
      expect(valid).toBe(false);
    });

    it('rejects empty password', async () => {
      const valid = await passwordVerify('', '$2b$12$invalidhash');
      expect(valid).toBe(false);
    });

    it('prevents timing attacks with constant-time comparison', async () => {
      const password = 'demo1234';
      const hash = await passwordHash(password);
      
      const start1 = Date.now();
      await passwordVerify(password, hash);
      const time1 = Date.now() - start1;
      
      const start2 = Date.now();
      await passwordVerify('wrong', hash);
      const time2 = Date.now() - start2;
      
      expect(Math.abs(time1 - time2)).toBeLessThan(100);
    });
  });

  describe('TOTP/MFA Security', () => {
    it('generates valid TOTP secret', () => {
      const secret = generateTOTPSecret();
      expect(secret).toBeDefined();
      expect(secret.length).toBe(32); // Base32 encoded 20 bytes
    });

    it('verifies valid TOTP code', () => {
      const secret = generateTOTPSecret();
      const code = generateTOTPToken(secret); // Current time-based code
      const valid = verifyTOTP(code, secret);
      expect(valid).toBe(true);
    });

    it('rejects invalid TOTP code', () => {
      const secret = generateTOTPSecret();
      const valid = verifyTOTP('000000', secret);
      expect(valid).toBe(false);
    });

    it('generates valid otpauth URI', () => {
      const secret = generateTOTPSecret();
      const uri = getTOTPUri(secret, 'user@test.com', 'Poorvottar Drishti');
      expect(uri).toContain('otpauth://totp/');
      expect(uri).toContain(secret);
      expect(uri).toContain('issuer=Poorvottar%20Drishti');
    });
  });

  describe('JWT Session Security', () => {
    let secretKey: CryptoKey;
    let wrongSecretKey: CryptoKey;
    
    beforeAll(async () => {
      secretKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode('test-secret-min-32-characters-long-for-testing-purposes-only'),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
      );
      wrongSecretKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode('wrong-secret-min-32-characters-long-for-testing-purposes-only'),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
      );
    });
    
    it('creates signed JWT with correct payload', async () => {
      const payload = {
        userId: 'user-1',
        email: 'test@test.com',
        role: 'CITIZEN',
        district: 'Darrang',
        preferredLang: 'en',
        mfaVerified: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secretKey);
      
      expect(token).toBeDefined();
      expect(token.split('.').length).toBe(3);
    });

    it('verifies valid JWT and extracts payload', async () => {
      const payload = {
        userId: 'user-1',
        email: 'test@test.com',
        role: 'CITIZEN',
        district: 'Darrang',
        preferredLang: 'en',
        mfaVerified: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secretKey);
      
      const { payload: verified } = await jwtVerify(token, secretKey);
      expect(verified.userId).toBe('user-1');
      expect(verified.role).toBe('CITIZEN');
    });

    it('rejects expired JWT', async () => {
      const payload = {
        userId: 'user-1',
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      };
      
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secretKey);
      
      await expect(jwtVerify(token, secretKey)).rejects.toThrow();
    });

    it('rejects JWT with invalid signature', async () => {
      const payload = { userId: 'user-1' };
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secretKey);
      
      await expect(jwtVerify(token, wrongSecretKey)).rejects.toThrow();
    });

    it('rejects JWT with tampered payload', async () => {
      const payload = { userId: 'user-1', role: 'CITIZEN' };
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secretKey);
      
      // Tamper with the payload (middle part)
      const parts = token.split('.');
      const tamperedPayload = Buffer.from(parts[1], 'base64').toString();
      const modified = tamperedPayload.replace('CITIZEN', 'ADMIN');
      parts[1] = Buffer.from(modified).toString('base64').replace(/=/g, '');
      const tamperedToken = parts.join('.');
      
      await expect(jwtVerify(tamperedToken, secretKey)).rejects.toThrow();
    });
  });

  describe('Session Cookie Security', () => {
    it('sets secure cookie options structure', () => {
      expect(sessionCookieOptions.httpOnly).toBe(true);
      expect(sessionCookieOptions.sameSite).toBe('lax');
      expect(sessionCookieOptions.path).toBe('/');
      expect(sessionCookieOptions.maxAge).toBe(60 * 60 * 24 * 7); // 7 days
      // secure is true only in production
      expect(typeof sessionCookieOptions.secure).toBe('boolean');
    });

    it('sets secure MFA cookie options structure', () => {
      expect(mfaCookieOptions.httpOnly).toBe(true);
      expect(mfaCookieOptions.sameSite).toBe('lax');
      expect(mfaCookieOptions.path).toBe('/');
      expect(mfaCookieOptions.maxAge).toBe(60 * 60 * 24); // 1 day
      expect(typeof mfaCookieOptions.secure).toBe('boolean');
    });
  });

  describe('Log Redaction', () => {
    it('redacts email addresses', () => {
      const input = 'User email: test@example.com logged in';
      const output = redactLog(input);
      expect(output).toContain('***@***.***');
      expect(output).not.toContain('test@example.com');
    });

    it('redacts phone numbers', () => {
      const input = 'Phone: +919435011111';
      const output = redactLog(input);
      expect(output).toContain('***-***-****');
    });

    it('redacts bearer tokens', () => {
      const input = 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const output = redactLog(input);
      expect(output).toContain('Bearer ***REDACTED***');
    });

    it('redacts passwords in JSON', () => {
      const input = '{"password": "secret123", "username": "test"}';
      const output = redactLog(input);
      expect(output).toContain('"password":"***REDACTED***"');
    });

    it('redacts objects recursively', () => {
      const input = {
        user: {
          password: 'secret',
          token: 'abc123',
          name: 'Test User',
          nested: {
            apiKey: 'key123',
            public: 'visible',
          },
        },
        publicField: 'visible',
      };
      
      const output = redactObject(input);
      expect(output.user.password).toBe('***REDACTED***');
      expect(output.user.token).toBe('***REDACTED***');
      expect(output.user.name).toBe('Test User');
      expect(output.user.nested.apiKey).toBe('***REDACTED***');
      expect(output.user.nested.public).toBe('visible');
      expect(output.publicField).toBe('visible');
    });
  });

  describe('Brute Force Protection', () => {
    it('locks account after 5 failed login attempts', async () => {
      for (let i = 0; i < 5; i++) {
        const result = await checkRateLimit(`login:brute-user`, 5, 15 * 60 * 1000);
        expect(result.allowed).toBe(true);
      }
      
      const result = await checkRateLimit(`login:brute-user`, 5, 15 * 60 * 1000);
      expect(result.allowed).toBe(false);
      expect(result.blocked).toBe(true);
    });

    it('locks account after 3 failed MFA attempts', async () => {
      for (let i = 0; i < 3; i++) {
        const result = await checkRateLimit(`mfa:brute-user`, 3, 15 * 60 * 1000);
        expect(result.allowed).toBe(true);
      }
      
      const result = await checkRateLimit(`mfa:brute-user`, 3, 15 * 60 * 1000);
      expect(result.allowed).toBe(false);
    });

    it('locks account after 10 failed password reset attempts per hour', async () => {
      for (let i = 0; i < 10; i++) {
        const result = await checkRateLimit(`reset:brute-user`, 10, 60 * 60 * 1000);
        expect(result.allowed).toBe(true);
      }
      
      const result = await checkRateLimit(`reset:brute-user`, 10, 60 * 60 * 1000);
      expect(result.allowed).toBe(false);
    });
  });
});