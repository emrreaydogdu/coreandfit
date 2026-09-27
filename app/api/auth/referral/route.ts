import { checkReferralCode } from "@/lib/server/repo";
import { handle, HttpError } from "@/lib/server/auth";
import { MINUTE, clientIp, consumeLimit, readJson } from "@/lib/server/security";

// Kayıt formunda kodu anında doğrulamak için. Kod sahibinin kişisel bilgisini döndürmez.
// Geçersiz kod bir form doğrulama sonucudur; 200 ve { valid: false, error } döner.
// IP başına 10 dakikada 20 kontrol: kod listesinin taranmasını engeller.
export async function POST(request: Request) {
  return handle(async () => {
    consumeLimit(`referral-ip:${clientIp(request)}`, 20, 10 * MINUTE);
    const body = await readJson(request, 2048);
    try {
      return Response.json(checkReferralCode(String(body.code ?? ""), body.email ? String(body.email).slice(0, 254) : undefined));
    } catch (err) {
      if (err instanceof HttpError && err.status < 500) return Response.json({ valid: false, error: err.message });
      throw err;
    }
  });
}
