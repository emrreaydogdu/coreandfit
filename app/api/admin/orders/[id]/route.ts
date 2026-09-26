import { adminApproveOrder, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";

export async function PATCH(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    adminApproveOrder(id);
    return Response.json(getAdminSnapshot());
  });
}
