import { addMeasurement, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    addMeasurement(id, await request.json().catch(() => ({})));
    return Response.json(getAdminSnapshot(), { status: 201 });
  });
}
