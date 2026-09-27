import { addMeasurement, getMemberSnapshot } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";
import { MINUTE, consumeLimit, readJson } from "@/lib/server/security";

export async function POST(request: Request) {
  return handle(async () => {
    const session = await requireMember();
    consumeLimit(`measurement:${session.id}`, 20, 10 * MINUTE);
    addMeasurement(session.id, await readJson(request, 4096));
    return Response.json(getMemberSnapshot(session.id), { status: 201 });
  });
}
