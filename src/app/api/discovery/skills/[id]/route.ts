import { getSop } from "@/server/layout/discovery/sops";
import { requireDiscoveryAuth } from "@/server/layout/discovery/auth";
import { ok, fail, routeGuard } from "@/server/http/responses";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireDiscoveryAuth(request);
    const { id } = await params;
    const sop = getSop(id);
    if (!sop) return fail(`SOP "${id}" not found`, 404);
    return ok(sop);
  });
}
