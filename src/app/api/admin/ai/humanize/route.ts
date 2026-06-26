import { z } from "zod";
import { humanizeArticle, type HumanizeStrength } from "@/server/ai/humanize";
import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";
import { resolveWritingStyle } from "@/server/templates/service";
import { getBrandProfilePrompt } from "@/server/brand/service";

const HumanizeSchema = z.object({
  contentMarkdown: z.string().min(1),
  strength: z.enum(["light", "authentic", "aggressive"]).default("authentic"),
  styleId: z.string().nullable().optional(),
  instruction: z.string().nullable().optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = HumanizeSchema.parse(await request.json());
    const [style, brandPrompt] = await Promise.all([
      resolveWritingStyle(input.styleId),
      getBrandProfilePrompt()
    ]);

    const result = await humanizeArticle({
      contentMarkdown: input.contentMarkdown,
      strength: input.strength as HumanizeStrength,
      brandPrompt,
      stylePrompt: style.prompt,
      instruction: input.instruction
    });

    return ok(result, "去 AI 痕迹完成");
  });
}
