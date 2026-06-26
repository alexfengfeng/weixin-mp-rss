import { ok, fail, routeGuard } from "@/server/http/responses";
import { requireDiscoveryAuth, isDiscoveryEnabled } from "@/server/layout/discovery/auth";
import { getModule } from "@/server/layout/modules/registry";
import { ensureModulesRegistered } from "@/server/layout/modules";

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  return routeGuard(async () => {
    const auth = await requireDiscoveryAuth(request);
    if (auth.kind === "unauthorized") return fail(auth.message, 401);

    const enabled = await isDiscoveryEnabled();
    if (!enabled) return fail("Discovery API 未启用", 403);

    const { name } = await params;
    ensureModulesRegistered();
    const module = getModule(name);
    if (!module) return fail(`模块 "${name}" 不存在`, 404);

    return ok({
      name: module.def.id,
      category: module.def.category,
      label: module.def.label,
      description: module.def.description,
      bodyFormat: module.def.bodyFormat,
      hasTitle: module.def.hasTitle,
      fields: module.def.fields,
      columns: module.def.columns,
      variants: module.def.variants,
      defaultVariant: module.def.defaultVariant,
      examples: module.def.examples,
      since: module.def.since
    });
  });
}
