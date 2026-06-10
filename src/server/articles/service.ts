import { prisma } from "@/server/db/prisma";

export async function listArticles(input: { mpId?: string; keyword?: string; limit?: number; offset?: number; status?: string } = {}) {
  const where = {
    title: input.keyword ? { contains: input.keyword } : undefined,
    mpId: input.mpId || undefined,
    status: input.status && input.status !== "all" ? input.status : undefined
  };

  return prisma.article.findMany({
    where,
    include: { mp: true },
    orderBy: { updatedAt: "desc" },
    take: input.limit || 50,
    skip: input.offset || 0
  });
}

export async function getArticle(id: string) {
  return prisma.article.findUnique({ where: { id }, include: { mp: true, draftItems: { include: { draftBatch: true } } } });
}
