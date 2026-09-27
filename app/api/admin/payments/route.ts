import { adminPaymentOverview, adminSetOnlinePayment } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import { readJson } from "@/lib/server/security";

// Online ödeme durumu ve bildirim kayıtları. Mağaza anahtarları hiçbir zaman yanıta eklenmez.
export async function GET() {
  return handle(async () => {
    await requireAdmin();
    return Response.json(adminPaymentOverview(), { headers: { "cache-control": "no-store" } });
  });
}

// Online ödemeyi açar / kapatır (anahtarlar sunucuda tanımlı değilse açılamaz).
export async function PUT(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await readJson(request, 256);
    adminSetOnlinePayment(body.enabled);
    return Response.json(adminPaymentOverview());
  });
}
