/**
 * 写作风格分析器（Writer Style Assistant）
 *
 * 输入参考文章 → 提取风格特征 → 生成风格 prompt。
 * 支持"风格指纹"提取，可保存为自定义 WritingStyle。
 */

import { z } from "zod";
import { normalizeKimiApiError, type KimiMessage } from "@/server/ai/kimi";

const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions";
const DEFAULT_MODEL = "kimi-k2.6";

export type StyleAnalysisInput = {
  /** 参考文章（1-3 篇，用 --- 分隔） */
  samples: string;
  /** 参考作者名（可选） */
  authorName?: string | null;
};

const StyleFeatureSchema = z.object({
  /** 句式特征 */
  sentenceStyle: z.string(),
  /** 语气特征 */
  tone: z.string(),
  /** 结构特征 */
  structure: z.string(),
  /** 词汇特征 */
  vocabulary: z.string(),
  /** 节奏特征 */
  rhythm: z.string(),
  /** 标志性表达 */
  signatureExpressions: z.array(z.string()).default([]),
  /** 适合的题材 */
  suitableTopics: z.array(z.string()).default([])
});

const StyleAnalysisResultSchema = z.object({
  features: StyleFeatureSchema,
  /** 生成的风格 prompt（可直接用作 WritingStyle.prompt） */
  stylePrompt: z.string(),
  /** 风格名称建议 */
  suggestedName: z.string(),
  /** 风格描述 */
  description: z.string()
});

export type StyleFeatures = z.infer<typeof StyleFeatureSchema>;
export type StyleAnalysisResult = z.infer<typeof StyleAnalysisResultSchema>;

type KimiResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { type?: string; message?: string };
};

export function buildStyleAnalysisMessages(input: StyleAnalysisInput): KimiMessage[] {
  return [
    {
      role: "system",
      content: [
        "你是专业的中文写作风格分析师，擅长从文章样本中提取作者的写作风格指纹。",
        "只输出合法 JSON Object，不要输出解释文字。",
        "JSON 字段必须是 features、stylePrompt、suggestedName、description。",
        "",
        "features 是风格特征对象：",
        "- sentenceStyle: 句式特征（长句/短句/混用/疑问句频率/感叹句等）",
        "- tone: 语气特征（正式/口语/犀利/温和/幽默/严肃等）",
        "- structure: 结构特征（总分总/散文化/清单体/对话体等）",
        "- vocabulary: 词汇特征（书面/口语/专业术语/网络用语/古文引用等）",
        "- rhythm: 节奏特征（快/慢/起伏/平稳/断句方式等）",
        "- signatureExpressions: 标志性表达（作者常用的句式/口头禅/独特用法，3-8 个）",
        "- suitableTopics: 适合的题材（3-5 个）",
        "",
        "stylePrompt: 基于分析结果生成的写作风格 prompt，",
        '要求用第二人称指令式描述（如"你写作时..."），可直接用于指导 AI 模仿该风格。',
        "prompt 长度 200-400 字，要具体可执行，避免空泛。",
        "",
        'suggestedName: 风格名称建议（如"犀利评论风"、"温和叙事风"）',
        "description: 一句话风格描述"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        input.authorName?.trim() ? `参考作者：${input.authorName.trim()}` : "",
        "请分析以下文章样本的写作风格：",
        "",
        input.samples
      ].filter(Boolean).join("\n")
    }
  ];
}

export async function analyzeWritingStyle(
  input: StyleAnalysisInput,
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch } = {}
): Promise<StyleAnalysisResult> {
  const apiKey = options.apiKey ?? process.env.MOONSHOT_API_KEY ?? "";
  if (!apiKey.trim()) throw new Error("未配置 MOONSHOT_API_KEY");
  if (!input.samples.trim()) throw new Error("请提供至少一篇参考文章");

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
        messages: buildStyleAnalysisMessages(input),
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        max_tokens: 4096,
        temperature: 0.4
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
    return StyleAnalysisResultSchema.parse(JSON.parse(content));
  } catch {
    throw new Error("Kimi 返回内容格式异常，请重试");
  }
}

/**
 * 内置名家风格预设
 */
export const BUILTIN_WRITER_STYLES: Array<{
  id: string;
  name: string;
  description: string;
  prompt: string;
}> = [
  {
    id: "sharp_commentary",
    name: "犀利评论风",
    description: "短句为主、观点犀利、直击要害，适合热点评论和行业分析。",
    prompt: [
      "你写作时采用犀利评论风格：",
      "- 句式以短句为主，单句不超过 25 字，偶尔用一个长句制造节奏变化",
      "- 观点鲜明，开头直接亮明立场，不绕弯子",
      "- 大量使用反问句和排比句增强气势",
      "- 语气尖锐但不失理性，可适当讽刺但避免人身攻击",
      "- 词汇接地气，可使用网络用语但不过度",
      "- 段落短小，每段 2-4 句，适合移动端阅读",
      '- 结尾有力，用一句金句收束，不要"综上所述"'
    ].join("\n")
  },
  {
    id: "warm_narrative",
    name: "温和叙事风",
    description: "第一人称、口语化、有温度，适合个人成长和生活方式类内容。",
    prompt: [
      "你写作时采用温和叙事风格：",
      '- 大量使用第一人称"我"，营造对话感',
      "- 口语化表达，像和朋友聊天，避免书面套话",
      "- 句长错落，有长有短，模拟自然说话节奏",
      "- 语气温暖真诚，可适当展露脆弱和犹豫",
      "- 善用细节和场景描写，让读者有画面感",
      "- 段落可稍长，用换行制造呼吸感",
      "- 结尾开放，不下定论，留思考空间给读者"
    ].join("\n")
  },
  {
    id: "tech_deep_dive",
    name: "技术深潜风",
    description: "结构严谨、术语精准、代码示例，适合技术教程和产品拆解。",
    prompt: [
      "你写作时采用技术深潜风格：",
      "- 结构清晰，用编号小标题组织内容（一、二、三 或 1. 2. 3.）",
      "- 术语精准，首次出现时附一句话解释",
      "- 适当使用代码块和表格增强可读性",
      "- 语气客观专业，避免夸张和绝对化表述",
      "- 逻辑严密，每个结论都有论据支撑",
      "- 段落紧凑，每段聚焦一个要点",
      '- 结尾总结要点，可附"进一步阅读"建议'
    ].join("\n")
  },
  {
    id: "storytelling",
    name: "故事化叙事风",
    description: "场景开场、悬念推进、人物对话，适合案例和复盘类内容。",
    prompt: [
      "你写作时采用故事化叙事风格：",
      "- 开头用一个具体场景或对话切入，不要直接说理",
      '- 用时间线推进叙事，制造"然后呢"的悬念',
      "- 穿插人物对话，让故事有画面感",
      "- 在故事中自然插入观点，不要跳出叙事说教",
      "- 句式多变，描写用长句，对话用短句",
      "- 节奏有起伏，紧张处加快，舒缓处放慢",
      "- 结尾回到开头场景，形成闭环或留白"
    ].join("\n")
  },
  {
    id: "data_driven",
    name: "数据驱动风",
    description: "数据先行、图表辅助、结论明确，适合行业报告和数据分析类内容。",
    prompt: [
      "你写作时采用数据驱动风格：",
      "- 每个观点先用数据说话，再解读数据背后的含义",
      "- 大量使用数字、百分比、对比来增强说服力",
      "- 适当使用表格和列表呈现结构化数据",
      "- 语气克制客观，让数据自己说话",
      "- 结论明确，每个小节末尾用一句话总结发现",
      "- 注意数据的时效性和来源可信度",
      "- 结尾给出基于数据的行动建议，不要空泛"
    ].join("\n")
  }
];
