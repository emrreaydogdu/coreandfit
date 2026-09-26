import { cancelMemberBooking, getMemberSnapshot } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const session = await requireMember();
    const { id } = await ctx.params;
    cancelMemberBooking(session.id, id);
    return Response.json(getMemberSnapshot(session.id));
  });
}
