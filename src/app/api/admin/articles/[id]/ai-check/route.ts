import { z } from "zod";
import { runPublishCheck } from "@/server/ai/copilot";
import { getArticle } from "@/server/articles/service";
import { requireUser } from "@/server/auth/session";
import { fail, ok, routeGuard } from "@/server/http/responses";
import { listWechatStyleTemplates, resolveWechatStyleTemplate } from "@/server/templates/service";

const CheckSchema = z.object({
  templateId: z.string().nullable().optional()
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const input = CheckSchema.parse(await request.json().catch(() => ({})));
    const article = await getArticle(id);
    if (!article) return fail("文章不存在", 404);

    const [templates, selectedTemplate] = await Promise.all([
      listWechatStyleTemplates(true),
      resolveWechatStyleTemplate(input.templateId)
    ]);

    return ok(await runPublishCheck({
      title: article.title,
      digest: article.digest,
      coverPath: article.coverPath,
      contentMarkdown: article.contentMarkdown,
      mpId: article.mpId,
      mpName: article.mp?.name,
      mpStatus: article.mp?.status,
      templateName: selectedTemplate.name,
      templates
    }), "发布检查已完成");
  });
}
