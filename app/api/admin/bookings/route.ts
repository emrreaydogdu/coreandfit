import { adminCreateBooking, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const result = adminCreateBooking({
      memberId: String(body.memberId ?? ""),
      date: String(body.date ?? ""),
      timeSlot: String(body.timeSlot ?? ""),
      workoutType: String(body.workoutType ?? ""),
      internalNote: body.internalNote ? String(body.internalNote) : undefined,
      deductCredit: body.deductCredit !== false,
    });
    return Response.json({ result, snapshot: getAdminSnapshot() }, { status: 201 });
  });
}
