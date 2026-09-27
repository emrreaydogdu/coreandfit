import { startOnlinePayment } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";
import { MINUTE, clientIp, consumeLimit, readJson } from "@/lib/server/security";

// PayTR ödeme sayfasını başlatır. Sipariş "awaiting_payment" olarak açılır; ders hakkı yalnızca PayTR'ın
// imzalı başarılı bildirimi geldiğinde tanımlanır.
export async function POST(request: Request) {
  return handle(async () => {
    const session = await requireMember();
    consumeLimit(`paytr-start:${session.id}`, 6, 10 * MINUTE);
    const body = await readJson(request, 1024);
    const result = await startOnlinePayment(session.id, body.packageId, clientIp(request));
    return Response.json(result, { status: 201 });
  });
}
