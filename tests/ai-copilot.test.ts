import { describe, expect, test, vi } from "vitest";
import {
  buildArticleToolMessages,
  buildPublishCheckMessages,
  buildTopicIdeaMessages,
  generateTopicIdeas,
  getLocalPublishIssues,
  recommendTemplate
} from "@/server/ai/copilot";

const templates = [
  { id: "clean_newsletter", name: "简洁通讯", description: null },
  { id: "dense_playbook", name: "紧凑手册", description: "教程清单" },
  { id: "bold_review", name: "评测强调", description: "对比评测" }
];

describe("AI Copilot helpers", () => {
  test("topic prompt includes keyword, audience, style and template candidates", () => {
    const messages = buildTopicIdeaMessages({
      keyword: "AI 写作工作流",
      audience: "一人团队",
      mpName: "Alex 一人团队",
      styleName: "一人团队手记",
      stylePrompt: "真诚复盘",
      templates,
      count: 5
    });

    expect(messages[1].content).toContain("AI 写作工作流");
    expect(messages[1].content).toContain("一人团队");
    expect(messages[1].content).toContain("Alex 一人团队");
    expect(messages[1].content).toContain("真诚复盘");
    expect(messages[1].content).toContain("dense_playbook");
  });

  test("article tool prompt keeps AI output as suggestions", () => {
    const messages = buildArticleToolMessages({
      action: "title",
      title: "旧标题",
      digest: "摘要",
      contentMarkdown: "# 正文",
      styleName: "产品洞察型",
      stylePrompt: "产品分析",
      instruction: "更有点击欲"
    });

    expect(messages[0].content).toContain("只给建议");
    expect(messages[1].content).toContain("title");
    expect(messages[1].content).toContain("旧标题");
    expect(messages[1].content).toContain("更有点击欲");
  });

  test("publish check prompt includes article and selected template", () => {
    const messages = buildPublishCheckMessages({
      title: "发布前检查",
      digest: "摘要",
      coverPath: "/uploads/a.jpg",
      contentMarkdown: "# 正文",
      mpName: "Alex 一人团队",
      templateName: "紧凑手册",
      templates
    });

    expect(messages[1].content).toContain("发布前检查");
    expect(messages[1].content).toContain("紧凑手册");
    expect(messages[1].content).toContain("Alex 一人团队");
  });

  test("local publish check detects blocking basics before pushing", () => {
    expect(getLocalPublishIssues({
      title: "",
      digest: "",
      coverPath: "",
      contentMarkdown: "",
      mpId: null,
      mpStatus: 1
    }).map((issue) => issue.message)).toEqual([
      "文章缺少标题",
      "文章未绑定订阅号",
      "文章缺少封面图",
      "文章正文为空",
      "文章摘要为空"
    ]);
  });

  test("template recommendation falls back to first active template", () => {
    expect(recommendTemplate("步骤\n1. 安装\n2. 配置", templates)?.id).toBe("dense_playbook");
    expect(recommendTemplate("普通内容", templates)?.id).toBe("clean_newsletter");
  });

  test("generates topic ideas with JSON mode", async () => {
    const fetchImpl = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(body.response_format).toEqual({ type: "json_object" });
      expect(body.messages[1].content).toContain("AI 发布台");

      return Response.json({
        choices: [{
          message: {
            content: JSON.stringify({
              topics: [{
                title: "AI 发布台如何减少返工",
                coreOpinion: "把检查前置",
                outline: ["问题", "方案", "落地"],
                styleId: "product_insight",
                templateId: "clean_newsletter",
                reason: "适合产品分析"
              }]
            })
          }
        }]
      });
    }) as unknown as typeof fetch;

    await expect(generateTopicIdeas({
      keyword: "AI 发布台",
      templates,
      count: 3
    }, { apiKey: "test-key", fetchImpl })).resolves.toEqual([{
      title: "AI 发布台如何减少返工",
      coreOpinion: "把检查前置",
      outline: ["问题", "方案", "落地"],
      styleId: "product_insight",
      templateId: "clean_newsletter",
      reason: "适合产品分析"
    }]);
  });
});
