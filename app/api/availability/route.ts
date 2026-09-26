import { getAvailability } from "@/lib/server/repo";
import { handle, requireMember } from "@/lib/server/auth";

// Dolu saatleri üye bilgisi olmadan döndürür.
export async function GET() {
  return handle(async () => {
    await requireMember();
    return Response.json(getAvailability());
  });
}
