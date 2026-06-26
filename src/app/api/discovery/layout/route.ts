import { ok, fail, routeGuard } from "@/server/http/responses";
import { requireDiscoveryAuth, isDiscoveryEnabled } from "@/server/layout/discovery/auth";
import { listModuleSummaries } from "@/server/layout/modules/registry";
import { ensureModulesRegistered } from "@/server/layout/modules";

export async function GET(request: Request) {
  return routeGuard(async () => {
    const auth = await requireDiscoveryAuth(request);
    if (auth.kind === "unauthorized") return fail(auth.message, 401);

    const enabled = await isDiscoveryEnabled();
    if (!enabled) return fail("Discovery API 未启用", 403);

    ensureModulesRegistered();
    const modules = listModuleSummaries();
    const categories = [...new Set(modules.map((m) => m.category))];

    return ok({
      moduleCount: modules.length,
      categories,
      modules
    });
  });
}
