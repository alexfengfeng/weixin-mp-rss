import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findArticle: vi.fn(),
  createDraft: vi.fn(),
  enqueueJob: vi.fn()
}));

vi.mock("@/server/db/prisma", () => ({
  prisma: {
    article: { findUnique: mocks.findArticle },
    draftBatch: { create: mocks.createDraft }
  }
}));

vi.mock("@/server/jobs/persistent", () => ({
  enqueueJob: mocks.enqueueJob
}));

import { publishArticleToDraft } from "@/server/drafts/service";

describe("publishArticleToDraft", () => {
  beforeEach(() => {
    mocks.findArticle.mockReset();
    mocks.createDraft.mockReset();
    mocks.enqueueJob.mockReset();
  });

  test("creates a single-article draft batch and push job", async () => {
    mocks.findArticle.mockResolvedValue({
      id: "article-1",
      title: "文章标题",
      mpId: "mp-1",
      coverPath: "/uploads/cover.jpg",
      contentMarkdown: "正文",
      mp: { status: 1 }
    });
    mocks.createDraft.mockResolvedValue({ id: "draft-1", title: "文章标题", items: [{ articleId: "article-1", order: 0 }] });
    mocks.enqueueJob.mockResolvedValue({ id: "job-1", type: "push_wechat_draft", payload: "{\"draftId\":\"draft-1\"}" });

    await expect(publishArticleToDraft("article-1", "magazine")).resolves.toEqual({
      draft: { id: "draft-1", title: "文章标题", items: [{ articleId: "article-1", order: 0 }] },
      job: { id: "job-1", type: "push_wechat_draft", payload: "{\"draftId\":\"draft-1\"}" }
    });
    expect(mocks.createDraft).toHaveBeenCalledWith({
      data: {
        title: "文章标题",
        mpId: "mp-1",
        items: { create: [{ articleId: "article-1", order: 0 }] }
      },
      include: { items: true }
    });
    expect(mocks.enqueueJob).toHaveBeenCalledWith("push_wechat_draft", { draftId: "draft-1", templateId: "magazine" }, 1);
  });

  test("does not create draft or job when article is invalid", async () => {
    mocks.findArticle.mockResolvedValue(null);

    await expect(publishArticleToDraft("missing")).rejects.toThrow("文章不存在");
    expect(mocks.createDraft).not.toHaveBeenCalled();
    expect(mocks.enqueueJob).not.toHaveBeenCalled();
  });
});
