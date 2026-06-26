import { z } from "zod";
import { generateInfographicPlan, type InfographicPreset } from "@/server/ai/infographic";
import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";

const InfographicSchema = z.object({
  preset: z.enum(["comparison", "timeline", "stats", "flow", "generic"]).optional(),
  title: z.string().nullable().optional(),
  content: z.string().min(10, "请提供至少 10 字的内容描述"),
  styleHint: z.string().nullable().optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = InfographicSchema.parse(await request.json());
    const plan = await generateInfographicPlan({
      preset: input.preset as InfographicPreset | undefined,
      title: input.title,
      content: input.content,
      styleHint: input.styleHint
    });
    return ok(plan, "信息图计划已生成");
  });
}
