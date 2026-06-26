/**
 * 信息图生成（infographic）
 *
 * 支持预设模板（comparison/timeline/stats/flow），生成信息图 prompt 或调用图片 API。
 * 与 cover-plan 类似，优先返回 plan，交由宿主 Agent 执行。
 */

import { z } from "zod";
import { normalizeKimiApiError, type KimiMessage } from "@/server/ai/kimi";
import { getBrandCoverPrompt } from "@/server/brand/service";

const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions";
const DEFAULT_MODEL = "kimi-k2.6";

export type InfographicPreset = "comparison" | "timeline" | "stats" | "flow" | "generic";

export type InfographicInput = {
  /** 信息图类型预设 */
  preset?: InfographicPreset;
  /** 标题 */
  title?: string | null;
  /** 数据/内容描述 */
  content: string;
  /** 风格提示 */
  styleHint?: string | null;
  /** 品牌风格（自动注入） */
  brandStyle?: string | null;
};

const InfographicPlanSchema = z.object({
  prompt: z.string().min(10),
  negativePrompt: z.string().default(""),
  size: z.enum(["1024x1024", "1024x1536", "1536x1024"]),
  style: z.string().default(""),
  layout: z.string().default(""),
  colorPalette: z.array(z.string()).default([]),
  dataPoints: z.array(z.string()).default([]),
  rationale: z.string().default("")
});

export type InfographicPlan = z.infer<typeof InfographicPlanSchema>;

type KimiResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { type?: string; message?: string };
};

const PRESET_DESCRIPTIONS: Record<InfographicPreset, string> = {
  comparison: "对比型信息图：左右或上下分栏对比两组数据/方案，强调差异",
  timeline: "时间线型信息图：按时间顺序展示事件节点，横向或纵向时间轴",
  stats: "数据统计型信息图：大数字 + 图表 + 简短说明，突出关键指标",
  flow: "流程型信息图：步骤/流程图，箭头连接各环节，强调顺序和逻辑",
  generic: "通用信息图：综合型，根据内容自动选择最佳布局"
};

export function buildInfographicMessages(input: InfographicInput): KimiMessage[] {
  const preset = input.preset || "generic";
  const lines = [
    `信息图类型：${preset}（${PRESET_DESCRIPTIONS[preset]}）`,
    input.title?.trim() ? `标题：${input.title.trim()}` : "",
    input.styleHint?.trim() ? `风格提示：${input.styleHint.trim()}` : "",
    input.brandStyle?.trim() ? `品牌风格：${input.brandStyle.trim()}` : "",
    `内容/数据：${input.content.trim()}`
  ].filter(Boolean);

  return [
    {
      role: "system",
      content: [
        "你是专业的信息图设计师，负责为公众号文章生成信息图的创作计划。",
        "只输出合法 JSON Object，不要输出解释文字。",
        "JSON 字段必须是 prompt、negativePrompt、size、style、layout、colorPalette、dataPoints、rationale。",
        "",
        "字段说明：",
        "- prompt: 给图片生成模型的英文 prompt，详细描述信息图画面（50-200 词）",
        "  必须包含：信息图类型、布局结构、数据可视化方式、配色、文字标注位置",
        "- negativePrompt: 不希望出现的元素（如 photorealistic, 3d render, blurry）",
        "- size: 图片尺寸。信息图推荐 1024x1536（竖版，适合手机阅读）",
        "- style: 视觉风格（如 flat design, isometric, minimal, corporate）",
        "- layout: 布局结构说明（如 left-right comparison, vertical timeline, grid stats）",
        "- colorPalette: 配色方案（hex 色值数组，3-5 个）",
        "- dataPoints: 关键数据点（文字描述数组，3-8 个）",
        "- rationale: 设计理由",
        "",
        "信息图要求：",
        "- 文字清晰可读，适合手机屏幕",
        "- 数据可视化直观（柱状图/饼图/时间轴/流程箭头）",
        "- 配色协调，有主次区分",
        "- 留白适当，不拥挤",
        "prompt 必须是英文，其他字段用中文。"
      ].join("\n")
    },
    {
      role: "user",
      content: ["请为以下内容生成信息图创作计划：", ...lines].join("\n")
    }
  ];
}

export async function generateInfographicPlan(
  input: InfographicInput,
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch } = {}
): Promise<InfographicPlan> {
  const apiKey = options.apiKey ?? process.env.MOONSHOT_API_KEY ?? "";
  if (!apiKey.trim()) throw new Error("未配置 MOONSHOT_API_KEY");
  if (!input.content.trim()) throw new Error("请提供信息图内容/数据");

  const brandStyle = input.brandStyle ?? (await getBrandCoverPrompt());

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
        messages: buildInfographicMessages({ ...input, brandStyle }),
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
    return InfographicPlanSchema.parse(JSON.parse(content));
  } catch {
    throw new Error("Kimi 返回内容格式异常，请重试");
  }
}
