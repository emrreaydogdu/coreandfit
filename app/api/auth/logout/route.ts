import { destroySession, handle } from "@/lib/server/auth";

export async function POST() {
  return handle(async () => {
    await destroySession();
    return Response.json({ ok: true });
  });
}
