import { describe, expect, test } from "vitest";
import { validateArticleReadyForPublish } from "@/server/drafts/service";

const baseArticle = {
  title: "文章标题",
  mpId: "mp-1",
  coverPath: "/uploads/cover.jpg",
  contentMarkdown: "正文",
  mp: { status: 1 }
};

describe("single article draft publishing", () => {
  test("rejects missing article", () => {
    expect(() => validateArticleReadyForPublish(null)).toThrow("文章不存在");
  });

  test("rejects article without mp account", () => {
    expect(() => validateArticleReadyForPublish({ ...baseArticle, mpId: null, mp: null })).toThrow("文章未绑定订阅号");
  });

  test("rejects disabled mp account", () => {
    expect(() => validateArticleReadyForPublish({ ...baseArticle, mp: { status: 0 } })).toThrow("订阅号已停用");
  });

  test("rejects article without cover", () => {
    expect(() => validateArticleReadyForPublish({ ...baseArticle, coverPath: "" })).toThrow("文章缺少封面图");
  });

  test("rejects article without body", () => {
    expect(() => validateArticleReadyForPublish({ ...baseArticle, contentMarkdown: "   " })).toThrow("文章正文为空");
  });

  test("returns normalized publishable article", () => {
    expect(validateArticleReadyForPublish(baseArticle)).toEqual({
      title: "文章标题",
      mpId: "mp-1"
    });
  });
});
