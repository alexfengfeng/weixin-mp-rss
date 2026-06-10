import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { createArticle } from "@/server/articles/admin";
import { listArticles } from "@/server/articles/service";
import { ok, routeGuard } from "@/server/http/responses";

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

export async function GET(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const url = new URL(request.url);
    return listArticles({
      mpId: url.searchParams.get("mpId") || undefined,
      keyword: url.searchParams.get("kw") || undefined,
      status: url.searchParams.get("status") || undefined
    });
  });
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = ArticleSchema.parse(await request.json());
    return ok(await createArticle(input), "文章已创建");
  });
}
