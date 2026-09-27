import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { getDb } from "./db";
import type { MemberRole } from "@/types/portal";

// Production'da __Host- öneki: yalnızca HTTPS, alan adı paylaşımı yok, path=/ zorunlu.
const SECURE_COOKIES = process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "0";
const SESSION_COOKIE = SECURE_COOKIES ? "__Host-cf_session" : "cf_session";

// Yönetici oturumu kısa tutulur; üye oturumu 30 gün.
const SESSION_TTL_MS: Record<MemberRole, number> = {
  admin: 12 * 60 * 60 * 1000,
  member: 30 * 24 * 60 * 60 * 1000,
};

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export interface SessionMember {
  id: string;
  role: MemberRole;
}

export async function createSession(memberId: string, role: MemberRole) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_TTL_MS[role]);
  const db = getDb();
  db.prepare("DELETE FROM auth_sessions WHERE expires_at < ?").run(new Date().toISOString());
  db.prepare("INSERT INTO auth_sessions (token_hash, member_id, expires_at) VALUES (?, ?, ?)").run(
    hashToken(token),
    memberId,
    expires.toISOString()
  );

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Strict: başka sitelerden gelen isteklerde çerez hiç gönderilmez (CSRF'e karşı ilk savunma hattı).
    sameSite: "strict",
    secure: SECURE_COOKIES,
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    getDb().prepare("DELETE FROM auth_sessions WHERE token_hash = ?").run(hashToken(token));
  }
  store.delete(SESSION_COOKIE);
}

// Parola değişikliği veya hesabın pasife alınması sonrası üyenin tüm oturumlarını kapatır.
export function revokeMemberSessions(memberId: string) {
  getDb().prepare("DELETE FROM auth_sessions WHERE member_id = ?").run(memberId);
}

export async function getSessionMember(): Promise<SessionMember | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const db = getDb();
  const row = db
    .prepare(
      `SELECT m.id, m.role, m.status, s.expires_at FROM auth_sessions s
       JOIN members m ON m.id = s.member_id
       WHERE s.token_hash = ?`
    )
    .get(hashToken(token)) as { id: string; role: MemberRole; status: string; expires_at: string } | undefined;
  if (!row) return null;
  if (new Date(row.expires_at) < new Date() || row.status === "Pasif") {
    db.prepare("DELETE FROM auth_sessions WHERE token_hash = ?").run(hashToken(token));
    return null;
  }
  return { id: row.id, role: row.role };
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireMember(): Promise<SessionMember> {
  const member = await getSessionMember();
  if (!member) throw new HttpError(401, "Oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
  return member;
}

export async function requireAdmin(): Promise<SessionMember> {
  const member = await requireMember();
  if (member.role !== "admin") throw new HttpError(403, "Bu işlem için yönetici yetkisi gerekiyor.");
  return member;
}

// Route handler'larda ortak hata dönüşü: HttpError mesajı kullanıcıya gösterilir, diğerleri loglanır.
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error(error);
    return Response.json({ error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
