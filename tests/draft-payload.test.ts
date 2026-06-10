import { describe, expect, test } from "vitest";
import { buildDraftArticlesPayload } from "@/server/drafts/payload";

describe("wechat draft payload", () => {
  test("builds single article draft payload", () => {
    const payload = buildDraftArticlesPayload([
      {
        title: "标题",
        author: "Alex",
        digest: "摘要",
        contentHtml: "<p>正文</p>",
        sourceUrl: "https://example.com",
        thumbMediaId: "thumb-1"
      }
    ]);

    expect(payload).toEqual({
      articles: [
        {
          title: "标题",
          author: "Alex",
          digest: "摘要",
          content: "<p>正文</p>",
          content_source_url: "https://example.com",
          thumb_media_id: "thumb-1",
          need_open_comment: 0,
          only_fans_can_comment: 0
        }
      ]
    });
  });

  test("keeps multi article draft order", () => {
    const payload = buildDraftArticlesPayload([
      { title: "第一篇", digest: "", contentHtml: "<p>1</p>", thumbMediaId: "a" },
      { title: "第二篇", digest: "", contentHtml: "<p>2</p>", thumbMediaId: "b" }
    ]);

    expect(payload.articles.map((article) => article.title)).toEqual(["第一篇", "第二篇"]);
  });
});
