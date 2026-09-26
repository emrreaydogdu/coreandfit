import { adminSaveSettings, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";

export async function PUT(request: Request) {
  return handle(async () => {
    await requireAdmin();
    adminSaveSettings(await request.json().catch(() => ({})));
    return Response.json(getAdminSnapshot());
  });
}
