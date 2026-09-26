import { adminCreateMember, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const created = adminCreateMember({
      fullName: String(body.fullName ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      initialSessions: Number(body.initialSessions ?? 0),
      injuryAlert: body.injuryAlert ? String(body.injuryAlert) : undefined,
      targetGoal: body.targetGoal ? String(body.targetGoal) : undefined,
    });
    return Response.json({ created, snapshot: getAdminSnapshot() }, { status: 201 });
  });
}
