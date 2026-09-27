import { issueMemberPass } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";

// Dijital giriş kartı: sunucunun imzaladığı, 90 saniye geçerli QR içeriği.
export async function GET() {
  return handle(async () => {
    const session = await requireMember();
    return Response.json(issueMemberPass(session.id), { headers: { "cache-control": "no-store" } });
  });
}
