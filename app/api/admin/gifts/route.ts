import { adminCreateGift, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    adminCreateGift({
      memberId: body.memberId ? String(body.memberId) : null,
      title: String(body.title ?? ""),
      description: String(body.description ?? ""),
    });
    return Response.json(getAdminSnapshot(), { status: 201 });
  });
}
