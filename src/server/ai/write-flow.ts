/**
 * 统一写作流程（write flow）
 *
 * 从想法到成文的完整流程：
 * 1. idea → outline（生成提纲）
 * 2. outline → draft（生成初稿）
 * 3. draft → humanize（可选去痕）
 *
 * 自动注入 Brand Profile + Writer Style。
 */

import { z } from "zod";
import { generateArticleDraft, type KimiMessage } from "@/server/ai/kimi";
import { normalizeKimiApiError } from "@/server/ai/kimi";
import { humanizeArticle, type HumanizeStrength } from "@/server/ai/humanize";
import { getBrandProfilePrompt } from "@/server/brand/service";

const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions";
const DEFAULT_MODEL = "kimi-k2.6";

export type WriteFlowStep = "outline" | "draft" | "humanize";

export type WriteFlowInput = {
  /** 用户的想法 / 主题描述 */
  idea: string;
  /** 目标订阅号名称 */
  mpName?: string | null;
  /** 写作风格 prompt */
  stylePrompt?: string | null;
  /** 写作风格 ID */
  styleId?: string | null;
  /** 篇幅要求 */
  length?: string | null;
  /** 要执行到哪一步 */
  steps?: WriteFlowStep[];
  /** 去痕强度（仅在 steps 包含 humanize 时生效） */
  humanizeStrength?: HumanizeStrength;
  /** 品牌档案 prompt（自动注入） */
  brandPrompt?: string | null;
};

const OutlineSchema = z.object({
  title: z.string().min(1),
  digest: z.string(),
  outline: z.array(z.string().min(1)).min(2),
  keyPoints: z.array(z.string()).default([])
});

export type OutlineResult = z.infer<typeof OutlineSchema>;

const WriteFlowResultSchema = z.object({
  step: z.enum(["outline", "draft", "humanize"]),
  outline: OutlineSchema.optional(),
  draft: z.object({
    title: z.string(),
    digest: z.string(),
    author: z.string().default(""),
    contentMarkdown: z.string()
  }).optional(),
  humanized: z.object({
    contentMarkdown: z.string(),
    changes: z.array(z.object({
      type: z.string(),
      before: z.string(),
      after: z.string(),
      reason: z.string()
    })).default([]),
    summary: z.string().default("")
  }).optional(),
  finalMarkdown: z.string()
});

export type WriteFlowResult = z.infer<typeof WriteFlowResultSchema>;

type KimiResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { type?: string; message?: string };
};

export function buildOutlineMessages(input: WriteFlowInput): KimiMessage[] {
  const lines = [
    `想法/主题：${input.idea.trim()}`,
    `目标订阅号：${input.mpName?.trim() || "未指定"}`,
    `写作风格：${input.stylePrompt || "未指定"}`,
    `篇幅：${input.length?.trim() || "1000 字左右"}`
  ];
  if (input.brandPrompt?.trim()) lines.push(`品牌人设：${input.brandPrompt.trim()}`);

  return [
    {
      role: "system",
      content: [
        "你是微信公众号选题策划助手，根据用户的想法生成文章提纲。",
        "只输出合法 JSON Object。",
        "JSON 字段必须是 title、digest、outline、keyPoints。",
        "- title: 文章标题（10-25 字）",
        "- digest: 80 字以内摘要",
        "- outline: 3-6 个章节标题（每个 5-15 字）",
        "- keyPoints: 每个章节的核心要点（1-2 句话）",
        "如果提供了品牌人设，提纲风格需与之匹配。"
      ].join("\n")
    },
    {
      role: "user",
      content: ["请根据以下信息生成文章提纲：", ...lines].join("\n")
    }
  ];
}

async function callKimiJson<T>(
  schema: z.ZodType<T>,
  messages: KimiMessage[],
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch; temperature?: number } = {}
): Promise<T> {
  const apiKey = options.apiKey ?? process.env.MOONSHOT_API_KEY ?? "";
  if (!apiKey.trim()) throw new Error("未配置 MOONSHOT_API_KEY");

  let response: Response;
  try {
    response = await (options.fetchImpl || fetch)(KIMI_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: options.model || DEFAULT_MODEL,
        messages,
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        max_tokens: 8192,
        temperature: options.temperature ?? 0.6
      })
    });
  } catch {
    throw new Error("Kimi 网络请求失败，请检查服务器网络或稍后重试");
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(normalizeKimiApiError(response.status, body));
  const content = (body as KimiResponse | null)?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Kimi 返回内容格式异常，请重试");

  try {
    return schema.parse(JSON.parse(content));
  } catch {
    throw new Error("Kimi 返回内容格式异常，请重试");
  }
}

/**
 * 执行完整写作流程
 */
export async function executeWriteFlow(
  input: WriteFlowInput,
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch } = {}
): Promise<WriteFlowResult> {
  const steps = input.steps || ["outline", "draft"];
  const brandPrompt = input.brandPrompt ?? (await getBrandProfilePrompt());

  // Step 1: 生成提纲
  let outline: OutlineResult | undefined;
  if (steps.includes("outline")) {
    outline = await callKimiJson(OutlineSchema, buildOutlineMessages(input), {
      ...options,
      temperature: 0.5
    });
  }

  // Step 2: 生成初稿
  let draft: { title: string; digest: string; author: string; contentMarkdown: string } | undefined;
  if (steps.includes("draft")) {
    const draftInput = {
      topic: input.idea,
      points: outline ? outline.outline.map((o, i) => `${i + 1}. ${o}`).join("\n") : null,
      style: null,
      stylePrompt: input.stylePrompt,
      mpName: input.mpName,
      length: input.length,
      brandPrompt
    };
    draft = await generateArticleDraft(draftInput, options);
  }

  // Step 3: 去痕（可选）
  let humanized: { contentMarkdown: string; changes: Array<{ type: string; before: string; after: string; reason: string }>; summary: string } | undefined;
  let finalMarkdown = draft?.contentMarkdown || "";
  if (steps.includes("humanize") && draft) {
    const result = await humanizeArticle(
      {
        contentMarkdown: draft.contentMarkdown,
        strength: input.humanizeStrength || "authentic",
        brandPrompt,
        stylePrompt: input.stylePrompt
      },
      options
    );
    humanized = result;
    finalMarkdown = result.contentMarkdown;
  }

  return {
    step: humanized ? "humanize" : draft ? "draft" : "outline",
    outline,
    draft,
    humanized,
    finalMarkdown
  };
}
