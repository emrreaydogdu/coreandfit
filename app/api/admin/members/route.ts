import { adminCreateMember, getAdminSnapshot } from "@/lib/server/repo";
import { handle, requireAdmin } from "@/lib/server/auth";
import { readJson } from "@/lib/server/security";

export async function POST(request: Request) {
  return handle(async () => {
    await requireAdmin();
    const body = await readJson(request, 4096);
    const created = await adminCreateMember({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      initialSessions: body.initialSessions ?? 0,
      injuryAlert: body.injuryAlert,
      targetGoal: body.targetGoal,
      healthConsentGiven: body.healthConsentGiven === true,
    });
    return Response.json({ created, snapshot: getAdminSnapshot() }, { status: 201 });
  });
}
