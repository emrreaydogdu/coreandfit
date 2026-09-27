import { getMemberPaymentStatus } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";

// Üye yalnızca kendi ödemesinin durumunu görebilir.
export async function GET(_request: Request, ctx: { params: Promise<{ oid: string }> }) {
  return handle(async () => {
    const session = await requireMember();
    const { oid } = await ctx.params;
    return Response.json(getMemberPaymentStatus(session.id, oid), { headers: { "cache-control": "no-store" } });
  });
}
