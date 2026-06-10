import { prisma } from "@/server/db/prisma";
import { enqueueJob } from "@/server/jobs/persistent";

export async function listDraftBatches(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.draftBatch.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        mp: true,
        items: { orderBy: { order: "asc" }, include: { article: true } }
      },
      take: limit,
      skip
    }),
    prisma.draftBatch.count()
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getDraftBatch(id: string) {
  return prisma.draftBatch.findUnique({
    where: { id },
    include: {
      mp: true,
      items: { orderBy: { order: "asc" }, include: { article: true } }
    }
  });
}

export async function createDraftBatch(input: { title: string; mpId: string; articleIds: string[] }) {
  const articleIds = input.articleIds.filter(Boolean);
  if (articleIds.length === 0) throw new Error("草稿至少需要一篇文章");
  if (articleIds.length > 8) throw new Error("微信多图文草稿最多支持 8 篇文章");

  return prisma.draftBatch.create({
    data: {
      title: input.title.trim(),
      mpId: input.mpId,
      items: {
        create: articleIds.map((articleId, index) => ({ articleId, order: index }))
      }
    },
    include: { items: true }
  });
}

export async function enqueuePushDraft(draftId: string) {
  return enqueueJob("push_wechat_draft", { draftId }, 1);
}
