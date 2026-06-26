import { z } from "zod";
import { generateCoverPlan } from "@/server/ai/cover-plan";
import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";

const CoverPlanSchema = z.object({
  title: z.string().nullable().optional(),
  digest: z.string().nullable().optional(),
  contentMarkdown: z.string().nullable().optional(),
  styleHint: z.string().nullable().optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = CoverPlanSchema.parse(await request.json());
    const plan = await generateCoverPlan({
      title: input.title,
      digest: input.digest,
      contentMarkdown: input.contentMarkdown,
      styleHint: input.styleHint
    });
    return ok(plan, "封面图计划已生成");
  });
}
