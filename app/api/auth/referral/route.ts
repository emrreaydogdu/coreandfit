import { checkReferralCode } from "@/lib/server/repo";
import { handle, HttpError } from "@/lib/server/auth";

// Kayıt formunda kodu anında doğrulamak için. Kod sahibinin kişisel bilgisini döndürmez.
// Geçersiz kod bir form doğrulama sonucudur; 200 ve { valid: false, error } döner.
export async function POST(request: Request) {
  return handle(async () => {
    const body = await request.json().catch(() => ({}));
    try {
      return Response.json(checkReferralCode(String(body.code ?? ""), body.email ? String(body.email) : undefined));
    } catch (err) {
      if (err instanceof HttpError) return Response.json({ valid: false, error: err.message });
      throw err;
    }
  });
}
