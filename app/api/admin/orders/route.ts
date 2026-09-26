import { adminQuickSale, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import type { PaymentMethod } from "@/types/portal";

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const order = adminQuickSale({
      memberId: String(body.memberId ?? ""),
      packageId: String(body.packageId ?? ""),
      paymentMethod: body.paymentMethod as PaymentMethod,
      extraDiscountPercent: Number(body.extraDiscountPercent ?? 0),
    });
    return Response.json({ order, snapshot: getAdminSnapshot() }, { status: 201 });
  });
}
