import { createMemberBooking, getMemberSnapshot } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";

export async function POST(request: Request) {
  return handle(async () => {
    const session = await requireMember();
    const body = await request.json().catch(() => ({}));
    createMemberBooking(session.id, {
      date: String(body.date ?? ""),
      timeSlot: String(body.timeSlot ?? ""),
      workoutType: String(body.workoutType ?? ""),
      memberNote: body.memberNote ? String(body.memberNote) : undefined,
    });
    return Response.json(getMemberSnapshot(session.id), { status: 201 });
  });
}
