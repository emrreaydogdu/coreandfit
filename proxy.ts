import { NextResponse, type NextRequest } from "next/server";

// API isteklerinde CSRF savunması (SameSite=Strict çereze ek katman):
// veri değiştiren isteklerde tarayıcının Origin / Sec-Fetch-Site başlıkları başka bir siteyi gösteriyorsa istek reddedilir.
// PayTR bildirimi sunucudan sunucuya gelir ve imzayla doğrulanır; bu kontrolün dışındadır.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CROSS_SITE_ALLOWED = new Set(["/api/payments/paytr/callback"]);
const MAX_BODY_BYTES = 65_536;

const deny = (status: number, error: string) =>
  NextResponse.json({ error }, { status, headers: { "cache-control": "no-store" } });

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (SAFE_METHODS.has(request.method) || CROSS_SITE_ALLOWED.has(pathname)) return NextResponse.next();

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return deny(413, "İstek çok büyük.");

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return deny(403, "İstek reddedildi.");

  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("host");
    let originHost = "";
    try {
      originHost = new URL(origin).host;
    } catch {
      return deny(403, "İstek reddedildi.");
    }
    if (!host || originHost !== host) return deny(403, "İstek reddedildi.");
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
