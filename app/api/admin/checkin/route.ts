import { adminCheckIn, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import { readJson } from "@/lib/server/security";

// Turnike girişi: imzalı QR içeriği (passToken) veya listeden seçilen üye (memberId).
export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await readJson(request, 1024);
    const result = adminCheckIn({ passToken: body.passToken, memberId: body.memberId });
    return Response.json({ result, snapshot: getAdminSnapshot() });
  });
}
