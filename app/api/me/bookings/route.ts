import { createMemberBooking, getMemberSnapshot } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";
import { MINUTE, consumeLimit, readJson } from "@/lib/server/security";

export async function POST(request: Request) {
  return handle(async () => {
    const session = await requireMember();
    consumeLimit(`booking:${session.id}`, 20, 10 * MINUTE);
    const body = await readJson(request, 4096);
    createMemberBooking(session.id, {
      date: body.date,
      timeSlot: body.timeSlot,
      workoutType: body.workoutType,
      memberNote: body.memberNote,
    });
    return Response.json(getMemberSnapshot(session.id), { status: 201 });
  });
}
