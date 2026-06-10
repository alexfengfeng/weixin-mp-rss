import { prisma } from "@/server/db/prisma";
import { markdownToWechatHtml } from "@/server/drafts/markdown";

export type ArticleInput = {
  mpId?: string | null;
  title: string;
  digest?: string | null;
  author?: string | null;
  coverPath?: string | null;
  contentMarkdown?: string | null;
  sourceUrl?: string | null;
  status?: string;
};

export function normalizeArticleInput(input: ArticleInput) {
  const contentMarkdown = input.contentMarkdown?.trim() || "";
  return {
    mpId: input.mpId || null,
    title: input.title.trim(),
    digest: input.digest?.trim() || null,
    author: input.author?.trim() || null,
    coverPath: input.coverPath?.trim() || null,
    contentMarkdown,
    contentHtml: markdownToWechatHtml(contentMarkdown),
    sourceUrl: input.sourceUrl?.trim() || null,
    status: input.status || "draft"
  };
}

export async function createArticle(input: ArticleInput) {
  return prisma.article.create({ data: normalizeArticleInput(input) });
}

export async function updateArticle(id: string, input: ArticleInput) {
  return prisma.article.update({
    where: { id },
    data: normalizeArticleInput(input)
  });
}

export async function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } });
}
