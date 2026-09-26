import { getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    return Response.json(getAdminSnapshot());
  });
}
