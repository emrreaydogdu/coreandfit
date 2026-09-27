import { HttpError } from "./auth";

// ---------------------------------------------------------------------------
// İstemci IP'si
// ---------------------------------------------------------------------------

// Uygulama yalnızca 127.0.0.1'i dinler; istekler nginx üzerinden gelir ve nginx X-Real-IP başlığını
// istemcinin gerçek adresiyle ezer. Bu yüzden istemcinin gönderdiği X-Forwarded-For'a güvenilmez.
export function clientIp(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real && /^[0-9a-fA-F:.]{3,45}$/.test(real)) return real;
  return "127.0.0.1";
}

// ---------------------------------------------------------------------------
// Deneme sınırlama (tek süreçte bellek içi sayaç)
// ---------------------------------------------------------------------------

interface Bucket {
  count: number;
  reset: number;
}

const globalForLimits = globalThis as unknown as { __cfLimits?: Map<string, Bucket> };
const buckets = (globalForLimits.__cfLimits ??= new Map<string, Bucket>());

const sweep = (now: number) => {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) if (bucket.reset <= now) buckets.delete(key);
};

const tooMany = (reset: number, now: number) =>
  new HttpError(429, `Çok fazla deneme yapıldı. Lütfen ${Math.max(1, Math.ceil((reset - now) / 60000))} dakika sonra tekrar deneyin.`);

// Sayacı bir artırır; sınır aşılırsa 429 fırlatır.
export function consumeLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return;
  }
  if (bucket.count >= limit) throw tooMany(bucket.reset, now);
  bucket.count += 1;
}

// Sayacı artırmadan sınırın aşılıp aşılmadığını kontrol eder (ör. hesap kilidi).
export function assertUnderLimit(key: string, limit: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (bucket && bucket.reset > now && bucket.count >= limit) throw tooMany(bucket.reset, now);
}

export function recordFailure(key: string, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset <= now) buckets.set(key, { count: 1, reset: now + windowMs });
  else bucket.count += 1;
}

export function clearLimit(key: string) {
  buckets.delete(key);
}

export const MINUTE = 60_000;

// ---------------------------------------------------------------------------
// İstek gövdesi
// ---------------------------------------------------------------------------

// Yalnızca application/json kabul edilir, boyut sınırlanır, gövde düz bir nesne olmalıdır.
export async function readJson(request: Request, maxBytes = 16_384): Promise<Record<string, unknown>> {
  const type = (request.headers.get("content-type") ?? "").toLowerCase();
  if (!type.startsWith("application/json")) throw new HttpError(415, "Geçersiz istek biçimi.");
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > maxBytes) throw new HttpError(413, "İstek çok büyük.");
  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) throw new HttpError(413, "İstek çok büyük.");
  if (!text.trim()) return {};
  try {
    const value: unknown = JSON.parse(text);
    if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  } catch {
    // aşağıda 400 döner
  }
  throw new HttpError(400, "Geçersiz istek.");
}

// ---------------------------------------------------------------------------
// Alan doğrulama
// ---------------------------------------------------------------------------

// Metin alanı: kırpılır, kontrol karakterleri reddedilir, uzunluk sınırlanır.
export function text(value: unknown, label: string, max: number, options: { required?: boolean; min?: number } = {}): string {
  if (value !== undefined && value !== null && typeof value !== "string" && typeof value !== "number") {
    throw new HttpError(400, `${label} geçersiz.`);
  }
  const out = value === undefined || value === null ? "" : String(value).trim();
  // Satır sonu ve sekme dışındaki kontrol karakterleri kabul edilmez.
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(out)) throw new HttpError(400, `${label} geçersiz karakter içeriyor.`);
  if (out.length > max) throw new HttpError(400, `${label} en fazla ${max} karakter olabilir.`);
  if (options.required && out.length < (options.min ?? 1)) {
    throw new HttpError(400, options.min && options.min > 1 ? `${label} en az ${options.min} karakter olmalı.` : `${label} gerekli.`);
  }
  return out;
}

export function optionalText(value: unknown, label: string, max: number): string | undefined {
  const out = text(value, label, max);
  return out ? out : undefined;
}

export function integer(value: unknown, label: string, min: number, max: number): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(num) || num < min || num > max) throw new HttpError(400, `${label} geçersiz.`);
  return num;
}

export const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

export const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,63}$/;
export const PHONE_RE = /^[0-9+()\s-]{0,20}$/;
