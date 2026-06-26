import { ok, fail, routeGuard } from "@/server/http/responses";
import { requireDiscoveryAuth, isDiscoveryEnabled } from "@/server/layout/discovery/auth";
import { getCapabilities } from "@/server/layout/discovery/capabilities";

export async function GET(request: Request) {
  return routeGuard(async () => {
    const auth = await requireDiscoveryAuth(request);
    if (auth.kind === "unauthorized") {
      return fail(auth.message, 401);
    }
    const enabled = await isDiscoveryEnabled();
    const capabilities = getCapabilities();
    return ok({ ...capabilities, discoveryEnabled: enabled });
  });
}
