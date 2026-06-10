import { describe, expect, test } from "vitest";
import { normalizeArticleInput } from "@/server/articles/admin";
import { normalizeTagInput } from "@/server/tags/admin";
import { canDeleteJob, canCancelJob } from "@/server/jobs/admin";

describe("admin article crud helpers", () => {
  test("normalizes editable article fields and renders markdown html", () => {
    const input = normalizeArticleInput({
      title: "  标题  ",
      digest: "",
      coverPath: "",
      sourceUrl: " https://example.com/a ",
      contentMarkdown: "**正文**",
      status: "draft"
    });

    expect(input).toEqual({
      mpId: null,
      title: "标题",
      digest: null,
      author: null,
      coverPath: null,
      contentMarkdown: "**正文**",
      contentHtml: "<p><strong>正文</strong></p>",
      sourceUrl: "https://example.com/a",
      status: "draft"
    });
  });
});

describe("admin tag crud helpers", () => {
  test("deduplicates selected mp ids and keeps nullable fields consistent", () => {
    expect(normalizeTagInput({
      name: "  科技  ",
      intro: "",
      cover: "",
      status: 1,
      mpIds: ["mp1", "mp1", "mp2", ""]
    })).toEqual({
      name: "科技",
      intro: null,
      cover: null,
      status: 1,
      mpIds: ["mp1", "mp2"]
    });
  });
});

describe("admin job crud helpers", () => {
  test("only ended jobs can be deleted and active jobs can be canceled", () => {
    expect(canDeleteJob("completed")).toBe(true);
    expect(canDeleteJob("failed")).toBe(true);
    expect(canDeleteJob("canceled")).toBe(true);
    expect(canDeleteJob("pending")).toBe(false);
    expect(canDeleteJob("running")).toBe(false);

    expect(canCancelJob("pending")).toBe(true);
    expect(canCancelJob("running")).toBe(true);
    expect(canCancelJob("completed")).toBe(false);
  });
});
