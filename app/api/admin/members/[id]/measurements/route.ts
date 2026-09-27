import { addMeasurement, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import { readJson } from "@/lib/server/security";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    addMeasurement(id, await readJson(request, 4096));
    return Response.json(getAdminSnapshot(), { status: 201 });
  });
}
