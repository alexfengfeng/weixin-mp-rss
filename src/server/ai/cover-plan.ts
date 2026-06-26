/**
 * 封面图生成计划（cover plan）
 *
 * 不实际调用图片 API，只返回生成计划 JSON（prompt + 风格 + 尺寸 + 参数）。
 * 交由宿主 Agent（如 WorkBuddy ImageGen 工具）执行实际图片生成。
 */

import { z } from "zod";
import { normalizeKimiApiError, type KimiMessage } from "@/server/ai/kimi";
import { getBrandCoverPrompt, getBrandProfilePrompt } from "@/server/brand/service";

const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions";
const DEFAULT_MODEL = "kimi-k2.6";

export type CoverPlanInput = {
  title?: string | null;
  digest?: string | null;
  contentMarkdown?: string | null;
  /** 自定义风格提示 */
  styleHint?: string | null;
  /** 品牌封面风格（自动注入） */
  brandCoverStyle?: string | null;
};

export type CoverImageSize = "1024x1024" | "1024x1536" | "1536x1024";

const CoverPlanSchema = z.object({
  prompt: z.string().min(10),
  negativePrompt: z.string().default(""),
  size: z.enum(["1024x1024", "1024x1536", "1536x1024"]),
  style: z.string().default(""),
  composition: z.string().default(""),
  colorPalette: z.array(z.string()).default([]),
  mood: z.string().default(""),
  rationale: z.string().default("")
});

export type CoverPlan = z.infer<typeof CoverPlanSchema>;

type KimiResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { type?: string; message?: string };
};

export function buildCoverPlanMessages(input: CoverPlanInput): KimiMessage[] {
  const lines = [
    `标题：${input.title || "未指定"}`,
    `摘要：${input.digest || "未指定"}`,
    input.styleHint?.trim() ? `风格提示：${input.styleHint.trim()}` : "",
    input.brandCoverStyle?.trim() ? `品牌封面风格：${input.brandCoverStyle.trim()}` : ""
  ].filter(Boolean);

  return [
    {
      role: "system",
      content: [
        "你是专业的公众号封面图设计师，负责为文章生成封面图的创作计划。",
        "只输出合法 JSON Object，不要输出解释文字。",
        "JSON 字段必须是 prompt、negativePrompt、size、style、composition、colorPalette、mood、rationale。",
        "",
        "字段说明：",
        "- prompt: 给图片生成模型的英文 prompt，详细描述画面内容（50-150 词）",
        "- negativePrompt: 不希望出现的元素（如 text, watermark, low quality）",
        "- size: 图片尺寸。公众号封面推荐 1536x1024（横版 2.35:1）",
        "- style: 视觉风格（如 minimalist flat design, watercolor, cyberpunk, oil painting）",
        "- composition: 构图说明（如 centered, rule of thirds, split screen）",
        "- colorPalette: 配色方案（hex 色值数组，3-5 个）",
        "- mood: 情绪氛围（如 professional, warm, energetic, calm）",
        "- rationale: 一句话说明设计理由",
        "",
        "prompt 必须是英文（图片模型对英文 prompt 效果更好），",
        "其他字段用中文。"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        "请为以下公众号文章生成封面图创作计划：",
        ...lines,
        input.contentMarkdown?.trim() ? `\n文章正文（截取前 500 字）：\n${input.contentMarkdown.substring(0, 500)}` : ""
      ].join("\n")
    }
  ];
}

/**
 * 智能选择图片尺寸
 */
export function chooseCoverSize(content: string): CoverImageSize {
  const lower = content.toLowerCase();
  if (lower.includes("步骤") || lower.includes("清单") || lower.includes("教程") || lower.includes("流程")) {
    return "1536x1024";
  }
  if (lower.includes("人物") || lower.includes("故事") || lower.includes("访谈") || lower.includes("创始人")) {
    return "1024x1536";
  }
  return "1536x1024"; // 公众号封面默认横版
}

export async function generateCoverPlan(
  input: CoverPlanInput,
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch } = {}
): Promise<CoverPlan> {
  const apiKey = options.apiKey ?? process.env.MOONSHOT_API_KEY ?? "";
  if (!apiKey.trim()) throw new Error("未配置 MOONSHOT_API_KEY");

  const brandCoverStyle = input.brandCoverStyle ?? (await getBrandCoverPrompt());

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
        messages: buildCoverPlanMessages({ ...input, brandCoverStyle }),
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        max_tokens: 2048,
        temperature: 0.5
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
    return CoverPlanSchema.parse(JSON.parse(content));
  } catch {
    throw new Error("Kimi 返回内容格式异常，请重试");
  }
}
