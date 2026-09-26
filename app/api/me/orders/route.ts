import { getMemberSnapshot, purchasePackage } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";
import type { PaymentMethod } from "@/types/portal";

export async function POST(request: Request) {
  return handle(async () => {
    const session = await requireMember();
    const body = await request.json().catch(() => ({}));
    // Tutar istemciden alınmaz; paket ve referans durumuna göre sunucuda hesaplanır.
    const order = purchasePackage(session.id, String(body.packageId ?? ""), body.paymentMethod as PaymentMethod);
    return Response.json({ order, snapshot: getMemberSnapshot(session.id) }, { status: 201 });
  });
}
