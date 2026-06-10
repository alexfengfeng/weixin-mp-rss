import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { deleteArticle, updateArticle } from "@/server/articles/admin";
import { getArticle } from "@/server/articles/service";
import { fail, ok, routeGuard } from "@/server/http/responses";

const ArticleSchema = z.object({
  mpId: z.string().nullable().optional(),
  title: z.string().min(1),
  digest: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  coverPath: z.string().nullable().optional(),
  contentMarkdown: z.string().nullable().optional(),
  sourceUrl: z.string().nullable().optional(),
  status: z.string().optional()
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const article = await getArticle(id);
    if (!article) return fail("文章不存在", 404);
    return ok(article);
  });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const data = ArticleSchema.parse(await request.json());
    return ok(await updateArticle(id, data), "文章已更新");
  });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    await deleteArticle(id);
    return ok({ id }, "文章已删除");
  });
}
