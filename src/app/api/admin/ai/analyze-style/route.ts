import { z } from "zod";
import { analyzeWritingStyle } from "@/server/ai/style-analyzer";
import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";

const AnalyzeStyleSchema = z.object({
  samples: z.string().min(50, "请提供至少 50 字的参考文章"),
  authorName: z.string().nullable().optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = AnalyzeStyleSchema.parse(await request.json());
    const result = await analyzeWritingStyle({
      samples: input.samples,
      authorName: input.authorName
    });
    return ok(result, "风格分析完成");
  });
}
