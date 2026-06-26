import { ok, fail, routeGuard } from "@/server/http/responses";
import { requireDiscoveryAuth, isDiscoveryEnabled } from "@/server/layout/discovery/auth";
import { listWechatStyleTemplates } from "@/server/templates/service";
import { BUILTIN_THEMES } from "@/server/layout/themes";

export async function GET(request: Request) {
  return routeGuard(async () => {
    const auth = await requireDiscoveryAuth(request);
    if (auth.kind === "unauthorized") return fail(auth.message, 401);

    const enabled = await isDiscoveryEnabled();
    if (!enabled) return fail("Discovery API 未启用", 403);

    const templates = await listWechatStyleTemplates(true);
    const themes = templates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      version: t.version,
      background: t.background,
      isBuiltin: t.isBuiltin
    }));

    return ok({
      count: themes.length,
      builtinCount: BUILTIN_THEMES.length,
      themes
    });
  });
}
