import { adminQuickSale, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import { readJson, text } from "@/lib/server/security";

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await readJson(request, 2048);
    const order = adminQuickSale({
      memberId: text(body.memberId, "Üye", 64, { required: true }),
      packageId: text(body.packageId, "Paket", 40, { required: true }),
      paymentMethod: body.paymentMethod,
      extraDiscountPercent: body.extraDiscountPercent ?? 0,
    });
    return Response.json({ order, snapshot: getAdminSnapshot() }, { status: 201 });
  });
}
