import { z } from "zod";
import { runArticleTool } from "@/server/ai/copilot";
import { requireUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { ok, routeGuard } from "@/server/http/responses";
import { resolveWritingStyle } from "@/server/templates/service";

const ArticleToolSchema = z.object({
  action: z.enum(["outline", "title", "digest", "rewrite", "expand", "shorten", "coverPrompt"]),
  title: z.string().nullable().optional(),
  digest: z.string().nullable().optional(),
  contentMarkdown: z.string().nullable().optional(),
  selectedText: z.string().nullable().optional(),
  instruction: z.string().nullable().optional(),
  mpId: z.string().nullable().optional(),
  styleId: z.string().nullable().optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = ArticleToolSchema.parse(await request.json());
    const [mp, style] = await Promise.all([
      input.mpId ? prisma.mpAccount.findUnique({ where: { id: input.mpId }, select: { name: true } }) : null,
      resolveWritingStyle(input.styleId)
    ]);

    return ok(await runArticleTool({
      action: input.action,
      title: input.title,
      digest: input.digest,
      contentMarkdown: input.contentMarkdown,
      selectedText: input.selectedText,
      instruction: input.instruction,
      mpName: mp?.name,
      styleName: style.name,
      stylePrompt: style.prompt
    }), "AI 建议已生成");
  });
}
