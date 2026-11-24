import { z } from 'zod';
import { hash } from 'bcryptjs';
import bcrypt from 'bcryptjs';
import { generateSecret, generateSync, verifySync, generateURI } from 'otplib';

// Server-only imports (dynamic to avoid client bundle issues)
let sharp: any;
let ExifReader: any;

async function getSharp() {
  if (!sharp) {
    sharp = (await import('sharp')).default;
  }
  return sharp;
}

async function getExifReader() {
  if (!ExifReader) {
    ExifReader = (await import('exifr')).default;
  }
  return ExifReader;
}

// ============================================
// ZOD SCHEMAS — AUTH
// ============================================

const SQL_INJECTION_PATTERN = /('|(\-\-)|(;)|(\bUNION\b)|(\bSELECT\b)|(\bINSERT\b)|(\bUPDATE\b)|(\bDELETE\b)|(\bDROP\b)|(\bOR\b\s+\d+\s*=\s*\d+)|(\bWAITFOR\b)|(\bEXISTS\b))/i;

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().regex(/^(\+91[\-\s]?)?[0]?(91)?[\-\s]?[6789][\-\s]?\d{3}[\-\s]?\d{3}[\-\s]?\d{3}$/, 'Invalid Indian mobile number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100)
    .refine(val => !SQL_INJECTION_PATTERN.test(val), 'Potential SQL injection detected')
    .refine(val => !/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(val), 'Control characters and null bytes not allowed'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  role: z.enum(['CITIZEN', 'FIELD_OFFICER', 'CODISTRICT_OFFICER', 'DC_COMMISSIONER', 'ADMIN']).default('CITIZEN'),
  preferredLang: z.enum(['en', 'as', 'hi', 'bn']).default('en'),
  district: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  totpCode: z.string().length(6).optional(),
});

export const mfaVerifySchema = z.object({
  code: z.string().length(6, 'TOTP code must be 6 digits'),
  userId: z.string().min(1),
});

export const mfaSetupSchema = z.object({
  userId: z.string().min(1),
});

// ============================================
// ZOD SCHEMAS — PROJECTS
// ============================================

const schemeEnum = z.enum([
  'NESIDS_ROADS', 'NESIDS_OTRI', 'NEC', 'PM_DEVINE', 'SDP',
  'MLAADS', 'SUHRID', 'UNTIED_FUNDS', 'ASSAM_DARSHAN', 'AAGY', 'NATIONAL_JJM_PMGSY_CUSTOM'
]);

const statusEnum = z.enum(['PLANNED', 'ONGOING', 'STALLED', 'COMPLETED', 'CLOSED']);
const ucStatusEnum = z.enum(['PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED', 'NOT_APPLICABLE']);

export const projectCreateSchema = z.object({
  workCode: z.string().min(3).max(32).regex(/^AS-[A-Z]{3}-\d{4}$/, 'Work code must match AS-XXX-#### format'),
  title: z.string().min(5).max(200).refine(val => !SQL_INJECTION_PATTERN.test(val), 'Potential SQL injection detected'),
  scheme: schemeEnum,
  fundingAgency: z.string().min(2).max(100),
  sanctionDate: z.string().datetime({ offset: true }),
  sanctionedCost: z.number().positive().max(10000),
  revisedCost: z.number().positive().max(10000).optional(),
  district: z.string().min(2).max(100),
  coDistrict: z.string().min(2).max(100),
  block: z.string().min(2).max(100),
  adcArea: z.enum(['BTC', 'KAAC', 'DHAC']).nullable().optional(),
  villageWard: z.string().min(2).max(100),
  latitude: z.number().min(24).max(29),
  longitude: z.number().min(89).max(97),
  implementingAgency: z.string().min(2).max(100),
  contractor: z.string().max(100).optional(),
  executingOfficer: z.string().min(2).max(100),
  technicalSanctionRef: z.string().max(100).optional(),
  plannedStartDate: z.string().datetime({ offset: true }),
  plannedEndDate: z.string().datetime({ offset: true }),
  actualStartDate: z.string().datetime({ offset: true }).nullable().optional(),
  actualEndDate: z.string().datetime({ offset: true }).nullable().optional(),
  physicalCompletionPct: z.number().min(0).max(100).default(0),
  financialSanction: z.number().positive().max(10000),
  fundReleased: z.number().min(0).max(10000).default(0),
  expenditure: z.number().min(0).max(10000).default(0),
  ucStatus: ucStatusEnum.default('PENDING'),
  pendingAmount: z.number().min(0).default(0),
  lastInspectionDate: z.string().datetime({ offset: true }).nullable().optional(),
  outcomeIndicators: z.string().nullable().optional(),
  imagePath: z.string().max(255).nullable().optional(),
  status: statusEnum.default('PLANNED'),
});

export const projectUpdateSchema = projectCreateSchema.partial().omit({ workCode: true });

export const projectQuerySchema = z.object({
  district: z.string().optional(),
  coDistrict: z.string().optional(),
  block: z.string().optional(),
  adcArea: z.enum(['BTC', 'KAAC', 'DHAC']).optional(),
  scheme: schemeEnum.optional(),
  status: statusEnum.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['sanctionDate', 'updatedAt', 'physicalCompletionPct', 'financialSanction']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// ZOD SCHEMAS — INSPECTIONS
// ============================================

export const inspectionCreateSchema = z.object({
  projectWorkId: z.string().min(1),
  gpsLat: z.number().min(24).max(29),
  gpsLng: z.number().min(89).max(97),
  photoPath: z.string().max(255).optional(),
  exifTimestamp: z.string().datetime({ offset: true }).optional(),
  qualityFlagsJson: z.string().optional(),
  notes: z.string().max(2000).optional().refine(val => !val || !SQL_INJECTION_PATTERN.test(val), 'Potential SQL injection detected'),
  offlineClientId: z.string().min(1).max(64),
});

export const inspectionQuerySchema = z.object({
  projectWorkId: z.string().optional(),
  officerId: z.string().optional(),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================
// ZOD SCHEMAS — NOTICES
// ============================================

const noticeStatusEnum = z.enum(['ACTIVE', 'AMENDED', 'SUPERSEDED', 'EXPIRED']);

export const noticeCreateSchema = z.object({
  title: z.string().min(5).max(200).refine(val => !SQL_INJECTION_PATTERN.test(val), 'Potential SQL injection detected'),
  issuingAuthority: z.string().min(2).max(100),
  publishedAt: z.string().datetime({ offset: true }),
  effectiveAt: z.string().datetime({ offset: true }).optional(),
  status: noticeStatusEnum.default('ACTIVE'),
  originalText: z.string().min(10).max(10000),
  plainSummary: z.string().min(10).max(2000),
  actionChecklistJson: z.string().optional(),
  sourceUrl: z.string().url().optional().nullable(),
  translationsJson: z.string().min(2),
  imagePath: z.string().max(255).optional(),
});

export const noticeUpdateSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  issuingAuthority: z.string().min(2).max(100).optional(),
  effectiveAt: z.string().datetime({ offset: true }).optional(),
  status: noticeStatusEnum.optional(),
  originalText: z.string().min(10).max(10000).optional(),
  plainSummary: z.string().min(10).max(2000).optional(),
  actionChecklistJson: z.string().optional(),
  sourceUrl: z.string().url().optional().nullable(),
  translationsJson: z.string().optional(),
  imagePath: z.string().max(255).optional(),
  lastReviewedAt: z.string().datetime({ offset: true }).optional(),
});

export const noticeQuerySchema = z.object({
  status: noticeStatusEnum.optional(),
  issuingAuthority: z.string().optional(),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================
// ZOD SCHEMAS — GRIEVANCES
// ============================================

const grievanceCategoryEnum = z.enum([
  'STALLED_WORK', 'QUALITY_DEFECT', 'FUND_MISUSE', 'WATER_SUPPLY_HALT',
  'CORRUPTION_ALLEGATION', 'DOCUMENT_REQUEST', 'OFFICER_CONDUCT', 'OTHER'
]);

const grievanceStatusEnum = z.enum(['SUBMITTED', 'UNDER_REVIEW', 'ACTION_REQUIRED', 'RESOLVED', 'REJECTED']);

export const grievanceCreateSchema = z.object({
  projectWorkId: z.string().optional(),
  category: grievanceCategoryEnum,
  department: z.string().min(2).max(100),
  district: z.string().min(2).max(100),
  description: z.string().min(10).max(1500).refine(val => !SQL_INJECTION_PATTERN.test(val), 'Potential SQL injection detected'),
  attachmentPath: z.string().max(255).optional(),
});

export const grievanceUpdateSchema = z.object({
  status: grievanceStatusEnum.optional(),
  escalationLevel: z.number().int().min(1).max(5).optional(),
  feedbackRating: z.number().int().min(1).max(5).optional(),
  timelineJson: z.string().optional(),
});

export const grievanceQuerySchema = z.object({
  userId: z.string().optional(),
  projectWorkId: z.string().optional(),
  category: grievanceCategoryEnum.optional(),
  status: grievanceStatusEnum.optional(),
  district: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================
// ZOD SCHEMAS — DRAFTS
// ============================================

export const draftCreateSchema = z.object({
  formType: z.string().min(1).max(64),
  step: z.number().int().positive().default(1),
  payloadJson: z.string().min(2),
});

export const draftUpdateSchema = z.object({
  step: z.number().int().positive().optional(),
  payloadJson: z.string().optional(),
});

// ============================================
// ZOD SCHEMAS — RECONCILIATION
// ============================================

export const reconciliationQuerySchema = z.object({
  type: z.enum(['mismatch', 'stalled', 'pendingUC', 'duplicates', 'all']).default('all'),
  district: z.string().optional(),
  adcArea: z.enum(['BTC', 'KAAC', 'DHAC']).optional(),
  scheme: schemeEnum.optional(),
  minVariance: z.coerce.number().min(0).max(100).optional(),
  minStalledDays: z.coerce.number().int().min(0).optional(),
  format: z.enum(['json', 'csv']).default('json'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(500).default(50),
});

// ============================================
// PASSWORD HASHING (bcryptjs)
// ============================================

export async function passwordHash(password: string): Promise<string> {
  return hash(password, 12);
}

export async function passwordVerify(password: string, hashVal: string): Promise<boolean> {
  if (hashVal.startsWith('$2')) {
    return bcrypt.compare(password, hashVal);
  }
  const { createHash } = await import('crypto');
  const sha = createHash('sha256').update(password).digest('hex');
  if (sha === hashVal) return true;
  return bcrypt.compare(password, hashVal);
}

// ============================================
// TOTP MFA (otplib)
// ============================================

export function generateTOTPSecret(): string {
  return generateSecret();
}

export function getTOTPUri(secret: string, email: string, service = 'Poorvottar Drishti'): string {
  return generateURI({ issuer: service, label: email, secret });
}

export function verifyTOTP(token: string, secret: string): boolean {
  try {
    const result = verifySync({ secret, token });
    return result.valid;
  } catch {
    return false;
  }
}

export function generateTOTPToken(secret: string): string {
  return generateSync({ secret });
}

// ============================================
// INPUT SANITIZATION
// ============================================

const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
  /on\w+\s*=/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
];

export function sanitizeInput(input: string): string {
  let cleaned = input.trim();
  for (const pattern of XSS_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }
  cleaned = cleaned.replace(/\0/g, '');
  return cleaned;
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');
}

// ============================================
// FILE VALIDATION (Magic bytes + sharp)
// ============================================

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

export async function validateImageFile(buffer: Buffer, filename: string): Promise<FileValidationResult> {
  if (buffer.length > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large: ${Math.round(buffer.length / 1024 / 1024)}MB (max 5MB)` };
  }

  const isValidType = checkMagicBytes(buffer);
  if (!isValidType.valid) {
    return { valid: false, error: `Invalid file type: ${isValidType.error}. Only JPEG, PNG, GIF, WebP allowed.` };
  }

  try {
    const sharpLib = await getSharp();
    const metadata = await sharpLib(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      return { valid: false, error: 'Invalid image: no dimensions' };
    }
    if (metadata.width > 8000 || metadata.height > 8000) {
      return { valid: false, error: 'Image dimensions too large (max 8000px)' };
    }
    return {
      valid: true,
      mimeType: `image/${metadata.format}`,
      width: metadata.width,
      height: metadata.height,
    };
  } catch (e) {
    return { valid: false, error: `Image processing failed: ${e instanceof Error ? e.message : 'Unknown error'}` };
  }
}

function checkMagicBytes(buffer: Buffer): { valid: boolean; error?: string } {
  if (buffer.length < 12) return { valid: false, error: 'File too small' };

  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return { valid: true };

  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
      buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A) {
    return { valid: true };
  }

  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38 &&
      (buffer[4] === 0x37 || buffer[4] === 0x39) && buffer[5] === 0x61) {
    return { valid: true };
  }

  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
    return { valid: true };
  }

  const text = buffer.subarray(0, Math.min(100, buffer.length)).toString('utf8', 0, 100);
  if (text.startsWith('<html') || text.startsWith('<HTML') || text.startsWith('MZ') || text.startsWith('#!')) {
    return { valid: false, error: 'Detected non-image content (HTML/executable/script)' };
  }

  return { valid: false, error: 'Unknown file signature' };
}

// ============================================
// EXIF EXTRACTION
// ============================================

export interface ExifData {
  gpsLat?: number;
  gpsLng?: number;
  timestamp?: Date;
  make?: string;
  model?: string;
  orientation?: number;
}

export async function extractExifData(buffer: Buffer): Promise<ExifData> {
  try {
    const exifReader = await getExifReader();
    const exif = await exifReader.parse(buffer, { pick: ['GPSLatitude', 'GPSLongitude', 'DateTimeOriginal', 'Make', 'Model', 'Orientation'] });

    let gpsLat: number | undefined;
    let gpsLng: number | undefined;

    if (exif.GPSLatitude && exif.GPSLongitude) {
      const latRef = (exif as any).GPSLatitudeRef || 'N';
      const lngRef = (exif as any).GPSLongitudeRef || 'E';

      gpsLat = convertDMSToDD(exif.GPSLatitude);
      if (latRef === 'S') gpsLat = -gpsLat!;

      gpsLng = convertDMSToDD(exif.GPSLongitude);
      if (lngRef === 'W') gpsLng = -gpsLng!;
    }

    let timestamp: Date | undefined;
    if (exif.DateTimeOriginal) {
      timestamp = new Date(exif.DateTimeOriginal.replace(':', '-').replace(':', '-'));
    }

    return {
      gpsLat,
      gpsLng,
      timestamp,
      make: exif.Make,
      model: exif.Model,
      orientation: exif.Orientation,
    };
  } catch {
    return {
      gpsLat: undefined,
      gpsLng: undefined,
      timestamp: undefined,
    };
  }
}

function convertDMSToDD(dms: any): number {
  if (Array.isArray(dms)) {
    const degrees = Number(dms[0]);
    const minutes = Number(dms[1]);
    const seconds = Number(dms[2]);
    return degrees + minutes / 60 + seconds / 3600;
  }
  return Number(dms);
}

// ============================================
// RATE LIMITING (Sliding Window)
// ============================================

interface RateLimitRecord {
  requests: number[];
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  blocked?: boolean;
}

export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60000,
  blockDurationMs: number = 300000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(identifier) || { requests: [] };

  if (record.blockedUntil && now < record.blockedUntil) {
    return { allowed: false, remaining: 0, resetAt: record.blockedUntil, blocked: true };
  }

  const windowStart = now - windowMs;
  record.requests = record.requests.filter(t => t > windowStart);

  if (record.requests.length >= limit) {
    record.blockedUntil = now + blockDurationMs;
    rateLimitStore.set(identifier, record);
    return { allowed: false, remaining: 0, resetAt: record.blockedUntil, blocked: true };
  }

  record.requests.push(now);
  rateLimitStore.set(identifier, record);

  return { allowed: true, remaining: limit - record.requests.length, resetAt: now + windowMs };
}

export function clearRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

// ============================================
// CSRF VERIFICATION
// ============================================

export function csrfVerify(referer: string | null, expectedOrigin: string): boolean {
  if (!referer) return false;
  try {
    const refererUrl = new URL(referer);
    const expectedUrl = new URL(expectedOrigin);
    return refererUrl.origin === expectedUrl.origin;
  } catch {
    return false;
  }
}

export function csrfVerifyHeader(origin: string | null, expectedOrigin: string): boolean {
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    const expectedUrl = new URL(expectedOrigin);
    return originUrl.origin === expectedUrl.origin;
  } catch {
    return false;
  }
}

// ============================================
// LOG REDACTION (PII/Token Masking)
// ============================================

const REDACTION_PATTERNS = [
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '***@***.***' },
  { pattern: /(\+91[\-\s]?)?[0]?(91)?[\-\s]?[6789][\-\s]?\d{3}[\-\s]?\d{3}[\-\s]?\d{3}/g, replacement: '***-***-****' },
  { pattern: /\+91\s+\d{5}\s+\d{5}/g, replacement: '***-***-****' },
  { pattern: /Bearer\s+[A-Za-z0-9._\-=]+\.[A-Za-z0-9._\-=]+\.[A-Za-z0-9._\-=]+/g, replacement: 'Bearer ***REDACTED***' },
  { pattern: /Bearer\s+[A-Za-z0-9._\-=]+/g, replacement: 'Bearer ***REDACTED***' },
  { pattern: /\b[a-fA-F0-9]{32,}\b/g, replacement: '***REDACTED***' },
  { pattern: /"password"\s*:\s*"[^"]*"/g, replacement: '"password":"***REDACTED***"' },
  { pattern: /"token"\s*:\s*"[^"]*"/g, replacement: '"token":"***REDACTED***"' },
  { pattern: /"secret"\s*:\s*"[^"]*"/g, replacement: '"secret":"***REDACTED***"' },
  { pattern: /"apiKey"\s*:\s*"[^"]*"/g, replacement: '"apiKey":"***REDACTED***"' },
  { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: '****-****-****-****' },
  { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, replacement: '****-****-****' },
  { pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g, replacement: '*******AK' },
];

export function redactLog(input: string): string {
  let output = input;
  for (const { pattern, replacement } of REDACTION_PATTERNS) {
    output = output.replace(pattern, replacement);
  }
  return output;
}

export function redactObject<T extends Record<string, any>>(obj: T, sensitiveKeys: string[] = []): T {
  const cloned = JSON.parse(JSON.stringify(obj)) as T;
  const defaultSensitive = ['password', 'token', 'secret', 'apiKey', 'accessToken', 'refreshToken', 'otp', 'totpSecret'];
  const allSensitive = [...new Set([...defaultSensitive, ...sensitiveKeys])];

  function redactRecursive(o: any): any {
    if (Array.isArray(o)) return o.map(redactRecursive);
    if (o && typeof o === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(o)) {
        if (allSensitive.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
          result[key] = '***REDACTED***';
        } else {
          result[key] = redactRecursive(value);
        }
      }
      return result;
    }
    return o;
  }

  return redactRecursive(cloned);
}

// ============================================
// SESSION / COOKIE HELPERS
// ============================================

export const SESSION_COOKIE_NAME = 'drishti_session';
export const MFA_COOKIE_NAME = 'drishti_mfa_verified';

export const sessionCookieOptions = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export const mfaCookieOptions = {
  name: MFA_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24,
};