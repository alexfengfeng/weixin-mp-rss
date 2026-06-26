import { z } from "zod";
import { executeWriteFlow, type WriteFlowStep } from "@/server/ai/write-flow";
import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";
import { resolveWritingStyle } from "@/server/templates/service";
import { getBrandProfilePrompt } from "@/server/brand/service";

const WriteFlowSchema = z.object({
  idea: z.string().min(5, "请输入至少 5 字的想法描述"),
  mpName: z.string().nullable().optional(),
  styleId: z.string().nullable().optional(),
  length: z.string().nullable().optional(),
  steps: z.array(z.enum(["outline", "draft", "humanize"])).optional(),
  humanizeStrength: z.enum(["light", "authentic", "aggressive"]).optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = WriteFlowSchema.parse(await request.json());
    const [style, brandPrompt] = await Promise.all([
      resolveWritingStyle(input.styleId),
      getBrandProfilePrompt()
    ]);

    const steps: WriteFlowStep[] = input.steps || ["outline", "draft"];
    const result = await executeWriteFlow({
      idea: input.idea,
      mpName: input.mpName,
      stylePrompt: style.prompt,
      styleId: input.styleId,
      length: input.length,
      steps,
      humanizeStrength: input.humanizeStrength,
      brandPrompt
    });

    return ok(result, "写作流程完成");
  });
}
