import { changePassword, getMemberSnapshot, updateProfile } from "@/lib/server/repo";
import { getSessionMember, handle, requireMember } from "@/lib/server/auth";

export async function GET() {
  return handle(async () => {
    const session = await getSessionMember();
    // Oturum yoksa 200 + null: istemci giriş sayfasına yönlendirir, konsolda hata üretmez.
    if (!session) return Response.json(null);
    return Response.json(getMemberSnapshot(session.id));
  });
}

export async function PATCH(request: Request) {
  return handle(async () => {
    const session = await requireMember();
    const body = await request.json().catch(() => ({}));
    if (body.currentPassword !== undefined || body.newPassword !== undefined) {
      changePassword(session.id, String(body.currentPassword ?? ""), String(body.newPassword ?? ""));
    } else {
      updateProfile(session.id, body.profile ?? {});
    }
    return Response.json(getMemberSnapshot(session.id));
  });
}
