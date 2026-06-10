import { describe, expect, it } from "vitest";
import {
  getArticleEditorPreferences,
  getDefaultWechatTemplateId,
  withGeneratedArticlePreferences
} from "../src/app/dashboard/articles/article-form-state";

describe("article form transient preferences", () => {
  const writingStyles = [
    { id: "product_insight", name: "产品洞察型", description: null },
    { id: "founder_note", name: "一人团队手记", description: null }
  ];
  const wechatTemplates = [
    { id: "clean_newsletter", name: "简洁通讯", description: null },
    { id: "bold_review", name: "评测强调", description: null }
  ];

  it("uses the latest database template as the generated article default", () => {
    expect(getDefaultWechatTemplateId(wechatTemplates)).toBe("clean_newsletter");
  });

  it("carries one-click generation style and template choices into the editor", () => {
    const generated = withGeneratedArticlePreferences(
      { title: "AI 订阅号发布台" },
      {
        stylePresetId: "founder_note",
        style: "少用排比",
        templateId: "bold_review"
      },
      {
        writingStyles,
        wechatTemplates
      }
    );

    expect(getArticleEditorPreferences(generated, writingStyles, wechatTemplates)).toEqual({
      stylePresetId: "founder_note",
      style: "少用排比",
      templateId: "bold_review"
    });
  });
});
