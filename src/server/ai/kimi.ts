import { z } from "zod";
import { getWritingStylePreset } from "@/lib/presets";
import { getBrandProfilePrompt, getBrandCoverPrompt } from "@/server/brand/service";

const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions";
const DEFAULT_MODEL = "kimi-k2.6";

export type KimiArticleInput = {
  topic: string;
  points?: string | null;
  style?: string | null;
  stylePresetId?: string | null;
  stylePrompt?: string | null;
  mpName?: string | null;
  author?: string | null;
  length?: string | null;
  /** 品牌档案 prompt（自动注入） */
  brandPrompt?: string | null;
};

export type KimiMessage = {
  role: "system" | "user";
  content: string;
};

const GeneratedArticleSchema = z.object({
  title: z.string().min(1),
  digest: z.string().min(1),
  author: z.string().optional().default(""),
  contentMarkdown: z.string().min(1)
});

export type GeneratedArticleDraft = z.infer<typeof GeneratedArticleSchema>;

type KimiResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
    finish_reason?: string | null;
  }>;
  error?: {
    type?: string;
    message?: string;
  };
};

export function buildKimiArticleMessages(input: KimiArticleInput): KimiMessage[] {
  const stylePreset = getWritingStylePreset(input.stylePresetId);
  const customStyle = input.style?.trim();
  const baseStylePrompt = input.stylePrompt?.trim() || stylePreset.prompt;
  const stylePrompt = customStyle
    ? `${baseStylePrompt}\n自定义风格补充：${customStyle}`
    : baseStylePrompt;
  const lines = [
    `主题：${input.topic.trim()}`,
    `要点：${input.points?.trim() || "请基于主题自行组织 3-5 个清晰要点"}`,
    `写作风格：${stylePrompt}`,
    `篇幅：${input.length?.trim() || "1000 字左右"}`,
    `目标订阅号：${input.mpName?.trim() || "未指定"}`,
    `作者：${input.author?.trim() || "未指定"}`
  ];
  if (input.brandPrompt?.trim()) {
    lines.push(`品牌人设：${input.brandPrompt.trim()}`);
  }

  return [
    {
      role: "system",
      content: [
        "你是微信公众号文章写作助手，负责生成适合订阅号草稿箱的中文 Markdown 文章。",
        "只输出合法 JSON Object，不要输出解释文字。",
        "JSON 字段必须是 title、digest、author、contentMarkdown。",
        "contentMarkdown 只使用基础 Markdown：标题、段落、加粗、链接、图片占位文本。",
        "不要生成封面图路径，不要编造已经上传的图片 URL。",
        "如果提供了品牌人设，请让文章风格与人设保持一致。"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        "请根据以下信息生成一篇公众号文章草稿：",
        ...lines,
        "",
        "输出示例：",
        JSON.stringify({
          title: "文章标题",
          digest: "80 字以内摘要",
          author: "作者名",
          contentMarkdown: "# 文章标题\n\n正文段落。"
        })
      ].join("\n")
    }
  ];
}

export function normalizeKimiApiError(status: number, body: unknown) {
  const message = typeof body === "object" && body && "error" in body
    ? (body as KimiResponse).error?.message
    : "";
  const type = typeof body === "object" && body && "error" in body
    ? (body as KimiResponse).error?.type
    : "";

  if (status === 401) return "Kimi API Key 无效或平台不匹配";
  if (status === 429) return "Kimi 调用受限，请稍后重试或检查余额";
  if (status === 400 && type === "content_filter") return "Kimi 内容审查未通过，请调整主题或要点后重试";
  if (status === 404) return "Kimi 模型不存在或当前账号无权限";
  return message ? `Kimi 调用失败: ${message}` : `Kimi 调用失败: HTTP ${status}`;
}

export async function generateArticleDraft(
  input: KimiArticleInput,
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch } = {}
): Promise<GeneratedArticleDraft> {
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
        messages: buildKimiArticleMessages(input),
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        max_tokens: 4096,
        temperature: 0.6
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
    return GeneratedArticleSchema.parse(JSON.parse(content));
  } catch {
    throw new Error("Kimi 返回内容格式异常，请重试");
  }
}
