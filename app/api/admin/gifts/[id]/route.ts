import { adminUpdateGift, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import type { GiftStatus } from "@/types/portal";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await request.json().catch(() => ({}));
    adminUpdateGift(id, body.status as GiftStatus);
    return Response.json(getAdminSnapshot());
  });
}
