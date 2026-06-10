import { z } from "zod";
import { generateTopicIdeas } from "@/server/ai/copilot";
import { requireUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { ok, routeGuard } from "@/server/http/responses";
import { listWechatStyleTemplates, resolveWritingStyle } from "@/server/templates/service";

const TopicSchema = z.object({
  mpId: z.string().nullable().optional(),
  keyword: z.string().min(1),
  audience: z.string().nullable().optional(),
  styleId: z.string().nullable().optional(),
  count: z.number().int().min(1).max(8).optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = TopicSchema.parse(await request.json());
    const [mp, style, templates] = await Promise.all([
      input.mpId ? prisma.mpAccount.findUnique({ where: { id: input.mpId }, select: { name: true } }) : null,
      resolveWritingStyle(input.styleId),
      listWechatStyleTemplates(true)
    ]);

    return ok(await generateTopicIdeas({
      keyword: input.keyword,
      audience: input.audience,
      mpName: mp?.name,
      styleName: style.name,
      stylePrompt: style.prompt,
      templates,
      count: input.count || 5
    }), "选题已生成");
  });
}
