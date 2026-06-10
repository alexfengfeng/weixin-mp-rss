import { describe, expect, test, vi } from "vitest";
import {
  buildKimiArticleMessages,
  generateArticleDraft,
  normalizeKimiApiError
} from "@/server/ai/kimi";

describe("kimi article generation", () => {
  test("builds prompt with topic, points, style, length and mp context", () => {
    const messages = buildKimiArticleMessages({
      topic: "独立开发者如何做订阅号",
      points: "减少工具链\n保持稳定发布",
      style: "克制、真诚",
      length: "1200 字左右",
      mpName: "Alex 一人团队",
      author: "Alex"
    });

    expect(messages[0].role).toBe("system");
    expect(messages[0].content).toContain("微信公众号文章写作助手");
    expect(messages[1].content).toContain("独立开发者如何做订阅号");
    expect(messages[1].content).toContain("减少工具链");
    expect(messages[1].content).toContain("克制、真诚");
    expect(messages[1].content).toContain("1200 字左右");
    expect(messages[1].content).toContain("Alex 一人团队");
    expect(messages[1].content).toContain("Alex");
  });

  test("generates structured draft using Kimi JSON mode", async () => {
    const fetchImpl = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(body.model).toBe("kimi-k2.6");
      expect(body.response_format).toEqual({ type: "json_object" });
      expect(body.temperature).toBe(0.6);
      expect(body.thinking).toEqual({ type: "disabled" });
      expect(body.max_tokens).toBe(4096);
      expect(body.messages[1].content).toContain("增长复盘");
      expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer test-key");

      return Response.json({
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: "增长复盘：从节奏开始",
                digest: "把复杂增长拆回可执行节奏。",
                author: "Alex",
                contentMarkdown: "# 增长复盘\n\n正文 **重点**"
              })
            },
            finish_reason: "stop"
          }
        ],
        usage: { total_tokens: 300 }
      });
    }) as unknown as typeof fetch;

    await expect(generateArticleDraft({ topic: "增长复盘" }, { apiKey: "test-key", fetchImpl })).resolves.toEqual({
      title: "增长复盘：从节奏开始",
      digest: "把复杂增长拆回可执行节奏。",
      author: "Alex",
      contentMarkdown: "# 增长复盘\n\n正文 **重点**"
    });
  });

  test("requires MOONSHOT_API_KEY", async () => {
    await expect(generateArticleDraft({ topic: "增长复盘" }, { apiKey: "" })).rejects.toThrow("未配置 MOONSHOT_API_KEY");
  });

  test("normalizes Kimi authentication and rate limit errors", () => {
    expect(normalizeKimiApiError(401, { error: { type: "invalid_authentication_error", message: "Invalid Authentication" } })).toBe(
      "Kimi API Key 无效或平台不匹配"
    );
    expect(normalizeKimiApiError(429, { error: { type: "rate_limit_reached_error", message: "rate limit" } })).toBe(
      "Kimi 调用受限，请稍后重试或检查余额"
    );
  });

  test("rejects invalid Kimi JSON content", async () => {
    const fetchImpl = vi.fn(async () => Response.json({
      choices: [{ message: { content: "{\"title\":\"缺正文\"}" }, finish_reason: "stop" }]
    })) as unknown as typeof fetch;

    await expect(generateArticleDraft({ topic: "增长复盘" }, { apiKey: "test-key", fetchImpl })).rejects.toThrow(
      "Kimi 返回内容格式异常，请重试"
    );
  });

  test("converts network failures to clear message", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;

    await expect(generateArticleDraft({ topic: "增长复盘" }, { apiKey: "test-key", fetchImpl })).rejects.toThrow(
      "Kimi 网络请求失败，请检查服务器网络或稍后重试"
    );
  });
});
