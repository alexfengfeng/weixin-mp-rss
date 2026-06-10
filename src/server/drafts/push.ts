import { prisma } from "@/server/db/prisma";
import { updateJobProgress } from "@/server/jobs/persistent";
import { extractMarkdownImageUrls, markdownToWechatHtml, replaceImageUrlsInHtml } from "@/server/drafts/markdown";
import { buildDraftArticlesPayload } from "@/server/drafts/payload";
import { addWechatDraft, getOfficialAccessToken } from "@/server/wechat/official";
import { uploadArticleImage, uploadPermanentImage } from "@/server/wechat/media";
import { getDraftBatch } from "@/server/drafts/service";
import { resolveWechatStyleTemplate } from "@/server/templates/service";

export async function pushDraftBatch(draftId: string, jobId?: string, templateId = "clean") {
  const draft = await getDraftBatch(draftId);
  if (!draft) throw new Error("草稿批次不存在");
  if (draft.items.length === 0) throw new Error("草稿批次没有文章");
  const template = await resolveWechatStyleTemplate(templateId);

  await updateJobProgressIfNeeded(jobId, 10, "获取订阅号 access_token");
  const accessToken = await getOfficialAccessToken(draft.mpId);

  const articles = [];
  for (let index = 0; index < draft.items.length; index += 1) {
    const article = draft.items[index].article;
    if (!article.coverPath) throw new Error(`文章缺少封面图: ${article.title}`);

    await updateJobProgressIfNeeded(jobId, 20 + index * 10, `上传封面图: ${article.title}`);
    const thumbMediaId = await uploadPermanentImage(accessToken, article.coverPath);

    let contentHtml = markdownToWechatHtml(article.contentMarkdown, template);
    const replacements = new Map<string, string>();
    for (const imageUrl of extractMarkdownImageUrls(article.contentMarkdown)) {
      if (!imageUrl.startsWith("/uploads/") && !imageUrl.startsWith("data/uploads/")) continue;
      const wechatUrl = await uploadArticleImage(accessToken, imageUrl);
      replacements.set(imageUrl, wechatUrl);
    }
    contentHtml = replaceImageUrlsInHtml(contentHtml, replacements);

    articles.push({
      title: article.title,
      author: article.author,
      digest: article.digest,
      contentHtml,
      sourceUrl: article.sourceUrl,
      thumbMediaId
    });
  }

  await updateJobProgressIfNeeded(jobId, 85, "提交到微信草稿箱");
  const payload = buildDraftArticlesPayload(articles);
  const mediaId = await addWechatDraft(accessToken, payload);

  await prisma.$transaction([
    prisma.draftBatch.update({
      where: { id: draft.id },
      data: { status: "pushed", mediaId, error: null, pushedAt: new Date() }
    }),
    prisma.mpAccount.update({
      where: { id: draft.mpId },
      data: { lastDraftPushAt: new Date() }
    }),
    prisma.article.updateMany({
      where: { id: { in: draft.items.map((item) => item.articleId) } },
      data: { status: "pushed" }
    })
  ]);

  await updateJobProgressIfNeeded(jobId, 95, "微信草稿箱已创建", { mediaId });
  return { mediaId, articleCount: articles.length };
}

async function updateJobProgressIfNeeded(jobId: string | undefined, progress: number, message: string, meta?: unknown) {
  if (!jobId) return;
  await updateJobProgress(jobId, progress, message, meta);
}
