import { registerMember } from "@/lib/server/repo";
import { createSession, handle } from "@/lib/server/auth";

export async function POST(request: Request) {
  return handle(async () => {
    const body = await request.json().catch(() => ({}));
    const result = registerMember({
      fullName: String(body.fullName ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      password: String(body.password ?? ""),
      referralCode: body.referralCode ? String(body.referralCode) : undefined,
    });
    await createSession(result.id);
    return Response.json({ referralApplied: result.referralApplied }, { status: 201 });
  });
}
