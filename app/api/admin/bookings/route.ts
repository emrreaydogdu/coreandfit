import { adminCreateBooking, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import { readJson, text } from "@/lib/server/security";

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await readJson(request, 4096);
    const result = adminCreateBooking({
      memberId: text(body.memberId, "Üye", 64, { required: true }),
      date: text(body.date, "Tarih", 10, { required: true }),
      timeSlot: text(body.timeSlot, "Saat", 13, { required: true }),
      workoutType: text(body.workoutType, "Antrenman tipi", 10, { required: true }),
      internalNote: body.internalNote,
      deductCredit: body.deductCredit !== false,
    });
    return Response.json({ result, snapshot: getAdminSnapshot() }, { status: 201 });
  });
}
