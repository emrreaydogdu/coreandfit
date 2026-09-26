import { adminUpdateBooking, getAdminSnapshot, type AdminBookingAction } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";

// Onayla / İptal Et / Tamamla / Ertele: durum değişikliği veritabanına yazılır, güncel tablo döner.
export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = (await request.json().catch(() => ({}))) as AdminBookingAction;
    adminUpdateBooking(id, body);
    return Response.json(getAdminSnapshot());
  });
}
