import { ok, fail, routeGuard } from "@/server/http/responses";
import { requireDiscoveryAuth, isDiscoveryEnabled } from "@/server/layout/discovery/auth";
import { inspectArticle } from "@/server/layout/discovery/inspect";

export async function GET(request: Request) {
  return routeGuard(async () => {
    const auth = await requireDiscoveryAuth(request);
    if (auth.kind === "unauthorized") return fail(auth.message, 401);

    const enabled = await isDiscoveryEnabled();
    if (!enabled) return fail("Discovery API 未启用", 403);

    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");
    if (!articleId) return fail("缺少 articleId 参数", 400);

    const result = await inspectArticle(articleId);
    if (!result) return fail("文章不存在", 404);

    return ok(result);
  });
}
