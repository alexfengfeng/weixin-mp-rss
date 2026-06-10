import { requireUser } from "@/server/auth/session";
import { publishArticleToDraft } from "@/server/drafts/service";
import { fail, ok, routeGuard } from "@/server/http/responses";

const BUSINESS_ERRORS = new Set(["文章不存在", "文章未绑定订阅号", "订阅号已停用", "文章缺少封面图", "文章正文为空"]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const body = await request.json().catch(() => ({})) as { templateId?: string | null };
    try {
      return ok(await publishArticleToDraft(id, body.templateId || "clean"), "草稿推送任务已创建");
    } catch (error) {
      const message = error instanceof Error ? error.message : "草稿推送任务创建失败";
      if (BUSINESS_ERRORS.has(message)) return fail(message, 400);
      throw error;
    }
  });
}
