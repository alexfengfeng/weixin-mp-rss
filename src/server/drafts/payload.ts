export type DraftArticleInput = {
  title: string;
  author?: string | null;
  digest?: string | null;
  contentHtml: string;
  sourceUrl?: string | null;
  thumbMediaId: string;
};

export type WechatDraftArticle = {
  title: string;
  author: string;
  digest: string;
  content: string;
  content_source_url: string;
  thumb_media_id: string;
  need_open_comment: 0;
  only_fans_can_comment: 0;
};

export function buildDraftArticlesPayload(articles: DraftArticleInput[]) {
  if (articles.length === 0) throw new Error("草稿至少需要一篇文章");
  if (articles.length > 8) throw new Error("微信多图文草稿最多支持 8 篇文章");

  return {
    articles: articles.map((article) => ({
      title: article.title,
      author: article.author || "",
      digest: article.digest || "",
      content: article.contentHtml,
      content_source_url: article.sourceUrl || "",
      thumb_media_id: article.thumbMediaId,
      need_open_comment: 0,
      only_fans_can_comment: 0
    } satisfies WechatDraftArticle))
  };
}
