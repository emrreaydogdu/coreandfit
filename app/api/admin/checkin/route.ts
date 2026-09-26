import { adminCheckIn, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";

// Turnike / QR girişi: üye id'si veya üye numarası ile.
export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const result = adminCheckIn(String(body.member ?? ""));
    return Response.json({ result, snapshot: getAdminSnapshot() });
  });
}
