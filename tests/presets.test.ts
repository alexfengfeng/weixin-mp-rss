import { describe, expect, test } from "vitest";
import {
  getWechatStyleTemplate,
  getWritingStylePreset,
  WECHAT_STYLE_TEMPLATES,
  WRITING_STYLE_PRESETS
} from "@/lib/presets";

describe("built-in presets", () => {
  test("resolves richer writing style presets and compatibility aliases", () => {
    expect(WRITING_STYLE_PRESETS.map((preset) => preset.id)).toEqual([
      "product_insight",
      "founder_note",
      "tutorial_playbook",
      "review_compare",
      "growth_opinion",
      "soft_story"
    ]);
    expect(getWritingStylePreset("product_insight").prompt.length).toBeGreaterThan(180);
    expect(getWritingStylePreset("founder_note").prompt).toContain("一人团队");
    expect(getWritingStylePreset("review").id).toBe("review_compare");
    expect(getWritingStylePreset("professional").id).toBe("product_insight");
    expect(getWritingStylePreset("missing").id).toBe("product_insight");
  });

  test("resolves distinct wechat style templates and compatibility aliases", () => {
    expect(WECHAT_STYLE_TEMPLATES.map((template) => template.id)).toEqual([
      "clean_newsletter",
      "product_report",
      "warm_column",
      "dense_playbook",
      "bold_review"
    ]);
    expect(new Set(WECHAT_STYLE_TEMPLATES.map((template) => template.styles.h1)).size).toBe(5);
    expect(getWechatStyleTemplate("magazine").id).toBe("warm_column");
    expect(getWechatStyleTemplate("compact").id).toBe("dense_playbook");
    expect(getWechatStyleTemplate("clean").id).toBe("clean_newsletter");
    expect(getWechatStyleTemplate("missing").id).toBe("clean_newsletter");
  });
});
