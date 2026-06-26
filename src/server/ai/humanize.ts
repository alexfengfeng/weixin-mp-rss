/**
 * AI 去痕写作（humanize）
 *
 * 重写 AI 生成的文章，去除"AI 味"，使其更接近真人写作风格。
 * 支持三种强度：light（轻度）/ authentic（自然）/ aggressive（激进）。
 * 保持 :::module 语法不被破坏。
 */

import { z } from "zod";
import { normalizeKimiApiError, type KimiMessage } from "@/server/ai/kimi";

const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions";
const DEFAULT_MODEL = "kimi-k2.6";

export type HumanizeStrength = "light" | "authentic" | "aggressive";

export type HumanizeInput = {
  contentMarkdown: string;
  strength?: HumanizeStrength;
  /** 品牌档案 prompt（可选） */
  brandPrompt?: string | null;
  /** 写作风格 prompt（可选） */
  stylePrompt?: string | null;
  /** 自定义补充指令 */
  instruction?: string | null;
};

const HumanizeResultSchema = z.object({
  contentMarkdown: z.string().min(1),
  changes: z.array(
    z.object({
      type: z.enum(["word_choice", "sentence_structure", "tone", "rhythm", "vocabulary", "other"]),
      before: z.string(),
      after: z.string(),
      reason: z.string()
    })
  ).default([]),
  summary: z.string().default("")
});

export type HumanizeResult = z.infer<typeof HumanizeResultSchema>;

type KimiResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { type?: string; message?: string };
};

const STRENGTH_LABELS: Record<HumanizeStrength, string> = {
  light: "轻度去痕",
  authentic: "自然真实",
  aggressive: "深度重写"
};

const STRENGTH_INSTRUCTIONS: Record<HumanizeStrength, string> = {
  light: [
    "轻度调整：只修改最明显的 AI 痕迹，保留原文 80% 以上内容。",
    '主要处理：机械排比、过度对仗、"综上所述"等套话、生硬过渡词。',
    "保持原文段落结构和叙述顺序基本不变。"
  ].join("\n"),
  authentic: [
    "自然重写：让文章读起来像真人写的，保留原文核心观点和 60% 内容。",
    "处理所有 AI 痕迹：",
    "- 拆解长句为短句，制造呼吸感",
    "- 用口语化表达替换书面套话",
    '- 删除无信息量的过渡句（如"值得一提的是"、"不难发现"）',
    "- 打破机械排比和对仗，制造参差感",
    "- 加入适当的转折、犹豫、个人化表达",
    '- 句长错落，避免每句都是 15-20 字的"标准长度"'
  ].join("\n"),
  aggressive: [
    "深度重写：仅保留原文的核心观点和事实，用全新的表达方式重写。",
    "要求：",
    "- 完全重构段落和叙述顺序",
    "- 用第一人称视角，加入个人观点和情感",
    '- 模拟真人写作的"不完美感"：偶尔跑题、自我纠正、反问',
    '- 避免"总分总"等 AI 偏好结构',
    "- 词汇更接地气，可适当使用网络用语（但不滥用）"
  ].join("\n")
};

export function buildHumanizeMessages(input: HumanizeInput): KimiMessage[] {
  const strength = input.strength || "authentic";
  const lines = [
    `去痕强度：${STRENGTH_LABELS[strength]}`,
    input.brandPrompt?.trim() ? `品牌人设：${input.brandPrompt.trim()}` : "",
    input.stylePrompt?.trim() ? `写作风格：${input.stylePrompt.trim()}` : "",
    input.instruction?.trim() ? `补充要求：${input.instruction.trim()}` : ""
  ].filter(Boolean);

  return [
    {
      role: "system",
      content: [
        "你是专业的中文文章去 AI 痕迹编辑，擅长把 AI 生成的文章改写得像真人写的。",
        "只输出合法 JSON Object，不要输出解释文字。",
        "JSON 字段必须是 contentMarkdown、changes、summary。",
        "",
        "【重要】文章中可能包含 :::module 语法块（如 :::hero、:::callout、:::steps 等），",
        "这些是排版模块标记，**必须原样保留**，不要修改 ::: 包裹的内容结构。",
        "你可以修改 :::module 块内部的文字内容，但不要删除 ::: 标记或改变模块名。",
        "",
        "changes 数组记录你的主要修改：",
        "- type: word_choice（用词）/ sentence_structure（句式）/ tone（语气）/ rhythm（节奏）/ vocabulary（词汇）/ other",
        "- before: 修改前的原文片段",
        "- after: 修改后的片段",
        "- reason: 修改原因",
        "",
        "summary: 用一句话总结这次去痕的整体策略。",
        "",
        `【本次去痕强度】\n${STRENGTH_INSTRUCTIONS[strength]}`
      ].join("\n")
    },
    {
      role: "user",
      content: [
        "请对以下文章进行去 AI 痕迹处理：",
        ...lines,
        "",
        "需要处理的 Markdown：",
        input.contentMarkdown
      ].join("\n")
    }
  ];
}

export async function humanizeArticle(
  input: HumanizeInput,
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch } = {}
): Promise<HumanizeResult> {
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
        messages: buildHumanizeMessages(input),
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        max_tokens: 8192,
        temperature: 0.75
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
    return HumanizeResultSchema.parse(JSON.parse(content));
  } catch {
    throw new Error("Kimi 返回内容格式异常，请重试");
  }
}
