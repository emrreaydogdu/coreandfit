import { adminSaveSettings, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import { readJson } from "@/lib/server/security";

export async function PUT(request: Request) {
  return handle(async () => {
    await requireAdmin();
    adminSaveSettings(await readJson(request, 65_536));
    return Response.json(getAdminSnapshot());
  });
}
