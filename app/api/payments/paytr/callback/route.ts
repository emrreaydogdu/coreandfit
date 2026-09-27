import { handlePaytrCallback } from "@/lib/server/repo";
import { clientIp } from "@/lib/server/security";

// PayTR Bildirim URL'si. Oturum gerektirmez; güvenlik imza doğrulamasıyla sağlanır (repo.handlePaytrCallback).
// Yanıt yalnızca düz metin "OK" olmalıdır.
export async function POST(request: Request) {
  const type = (request.headers.get("content-type") ?? "").toLowerCase();
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > 8192 || !(type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data"))) {
    return new Response("PAYTR notification failed: bad request", { status: 400, headers: { "content-type": "text/plain" } });
  }
  try {
    const form = await request.formData();
    const result = handlePaytrCallback(form, clientIp(request));
    return new Response(result.body, { status: result.status, headers: { "content-type": "text/plain; charset=utf-8" } });
  } catch (error) {
    console.error("[paytr] callback", error);
    // OK dönülmediği için PayTR bildirimi tekrar gönderir.
    return new Response("PAYTR notification failed: server error", { status: 500, headers: { "content-type": "text/plain" } });
  }
}
