import { addMeasurement, getMemberSnapshot } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";

export async function POST(request: Request) {
  return handle(async () => {
    const session = await requireMember();
    const body = await request.json().catch(() => ({}));
    addMeasurement(session.id, body);
    return Response.json(getMemberSnapshot(session.id), { status: 201 });
  });
}
