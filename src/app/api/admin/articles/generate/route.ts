import { z } from "zod";
import { generateArticleDraft } from "@/server/ai/kimi";
import { requireUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { ok, routeGuard } from "@/server/http/responses";

const GenerateArticleSchema = z.object({
  topic: z.string().min(1),
  points: z.string().nullable().optional(),
  style: z.string().nullable().optional(),
  mpId: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  length: z.string().nullable().optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = GenerateArticleSchema.parse(await request.json());
    const mp = input.mpId
      ? await prisma.mpAccount.findUnique({ where: { id: input.mpId }, select: { name: true } })
      : null;

    return ok(
      await generateArticleDraft({
        topic: input.topic,
        points: input.points,
        style: input.style,
        mpName: mp?.name,
        author: input.author,
        length: input.length
      }),
      "文章已生成"
    );
  });
}
