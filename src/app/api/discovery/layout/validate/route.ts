import { z } from "zod";
import { ok, fail, routeGuard } from "@/server/http/responses";
import { requireDiscoveryAuth, isDiscoveryEnabled } from "@/server/layout/discovery/auth";
import { parseDocument } from "@/server/layout/parser/document";
import { builtinModuleResolver } from "@/server/layout/modules";
import { hasModule, getModuleDef } from "@/server/layout/modules/registry";
import { ensureModulesRegistered } from "@/server/layout/modules";

const ValidateSchema = z.object({
  markdown: z.string().min(1)
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    const auth = await requireDiscoveryAuth(request);
    if (auth.kind === "unauthorized") return fail(auth.message, 401);

    const enabled = await isDiscoveryEnabled();
    if (!enabled) return fail("Discovery API 未启用", 403);

    const body = ValidateSchema.parse(await request.json());
    ensureModulesRegistered();

    const blocks = parseDocument(body.markdown, { resolver: builtinModuleResolver });
    const moduleBlocks = blocks.filter((b) => b.type === "module");

    const results = moduleBlocks.map((b) => {
      if (b.type !== "module") return null;
      const m = b.module;
      return {
        name: m.name,
        variant: m.variant,
        registered: hasModule(m.name),
        parseError: m.parseError,
        unknown: m.unknown
      };
    }).filter(Boolean);

    const errors = results.filter((r) => r && (r.unknown || r.parseError));
    const valid = errors.length === 0;

    return ok({
      valid,
      moduleCount: results.length,
      modules: results,
      errors: errors.length > 0 ? errors : undefined
    });
  });
}
