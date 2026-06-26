import { getImageProviders } from "@/server/images/providers";
import { requireDiscoveryAuth } from "@/server/layout/discovery/auth";
import { ok, routeGuard } from "@/server/http/responses";

export async function GET(request: Request) {
  return routeGuard(async () => {
    await requireDiscoveryAuth(request);
    return ok(getImageProviders());
  });
}
