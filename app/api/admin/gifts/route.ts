import { adminCreateGift, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import { readJson } from "@/lib/server/security";

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await readJson(request, 4096);
    adminCreateGift({
      memberId: typeof body.memberId === "string" && body.memberId ? body.memberId.slice(0, 64) : null,
      title: body.title,
      description: body.description,
    });
    return Response.json(getAdminSnapshot(), { status: 201 });
  });
}
