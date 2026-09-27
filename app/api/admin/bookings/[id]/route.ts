import { adminUpdateBooking, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import { readJson } from "@/lib/server/security";

// Onayla / İptal Et / Tamamla / Ertele: durum değişikliği veritabanına yazılır, güncel tablo döner.
export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    await requireAdmin();
    const { id } = await ctx.params;
    adminUpdateBooking(id, await readJson(request, 4096));
    return Response.json(getAdminSnapshot());
  });
}
