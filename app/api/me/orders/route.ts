import { getMemberSnapshot, purchasePackage } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";
import { MINUTE, consumeLimit, readJson } from "@/lib/server/security";

// Nakit / havale siparişi. Tutar istemciden alınmaz; paket ve referans durumuna göre sunucuda hesaplanır.
export async function POST(request: Request) {
  return handle(async () => {
    const session = await requireMember();
    consumeLimit(`order:${session.id}`, 5, 10 * MINUTE);
    const body = await readJson(request, 2048);
    const order = purchasePackage(session.id, body.packageId, body.paymentMethod);
    return Response.json({ order, snapshot: getMemberSnapshot(session.id) }, { status: 201 });
  });
}
