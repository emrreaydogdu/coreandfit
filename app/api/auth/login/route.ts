import { authenticate } from "@/lib/server/repo";
import { createSession, handle, HttpError } from "@/lib/server/auth";
import { MINUTE, assertUnderLimit, clearLimit, clientIp, consumeLimit, readJson, recordFailure } from "@/lib/server/security";

// IP başına 15 dakikada 20 deneme; e-posta başına 5 hatalı denemede 15 dakikalık kilit.
export async function POST(request: Request) {
  return handle(async () => {
    const ip = clientIp(request);
    consumeLimit(`login-ip:${ip}`, 20, 15 * MINUTE);
    const body = await readJson(request);
    const email = String(body.email ?? "").trim().toLowerCase().slice(0, 254);
    const emailKey = `login-email:${email}`;
    assertUnderLimit(emailKey, 5);
    try {
      const member = await authenticate(email, String(body.password ?? ""));
      clearLimit(emailKey);
      await createSession(member.id, member.role);
      return Response.json({ role: member.role });
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) recordFailure(emailKey, 15 * MINUTE);
      throw error;
    }
  });
}
