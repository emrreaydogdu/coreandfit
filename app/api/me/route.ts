import { acknowledgeKvkkNotice, changePassword, getMemberSnapshot, setHealthConsent, updateProfile } from "@/lib/server/repo";
import { createSession, getSessionMember, handle, requireMember } from "@/lib/server/auth";
import { MINUTE, consumeLimit, readJson } from "@/lib/server/security";

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
    const body = await readJson(request);
    if (body.currentPassword !== undefined || body.newPassword !== undefined) {
      consumeLimit(`password-change:${session.id}`, 5, 15 * MINUTE);
      const { role } = await changePassword(session.id, String(body.currentPassword ?? ""), String(body.newPassword ?? ""));
      // Diğer cihazlardaki oturumlar kapandı; bu cihaz için yeni oturum açılır.
      await createSession(session.id, role);
    } else if (body.healthConsent !== undefined) {
      setHealthConsent(session.id, body.healthConsent);
    } else if (body.kvkkNotice === true) {
      acknowledgeKvkkNotice(session.id);
    } else {
      updateProfile(session.id, body.profile ?? {});
    }
    return Response.json(getMemberSnapshot(session.id));
  });
}
