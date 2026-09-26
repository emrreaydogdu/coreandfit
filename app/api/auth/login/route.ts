import { authenticate } from "@/lib/server/repo";
import { createSession, handle } from "@/lib/server/auth";

export async function POST(request: Request) {
  return handle(async () => {
    const body = await request.json().catch(() => ({}));
    const member = authenticate(String(body.email ?? ""), String(body.password ?? ""));
    await createSession(member.id);
    return Response.json({ role: member.role });
  });
}
