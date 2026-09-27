import { registerMember } from "@/lib/server/repo";
import { createSession, handle } from "@/lib/server/auth";
import { MINUTE, clientIp, consumeLimit, readJson } from "@/lib/server/security";

// IP başına saatte 5 kayıt.
export async function POST(request: Request) {
  return handle(async () => {
    consumeLimit(`register-ip:${clientIp(request)}`, 5, 60 * MINUTE);
    const body = await readJson(request);
    const result = await registerMember({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      password: String(body.password ?? ""),
      referralCode: body.referralCode,
      kvkkNotice: body.kvkkNotice === true,
      healthConsent: body.healthConsent === true,
    });
    await createSession(result.id, "member");
    return Response.json({ referralApplied: result.referralApplied }, { status: 201 });
  });
}
