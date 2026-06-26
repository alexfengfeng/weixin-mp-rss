import { z } from "zod";
import { normalizeKimiApiError, type KimiMessage } from "@/server/ai/kimi";

const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions";
const DEFAULT_MODEL = "kimi-k2.6";

type TemplateCandidate = {
  id: string;
  name: string;
  description: string | null;
};

export type TopicIdeaInput = {
  keyword: string;
  audience?: string | null;
  mpName?: string | null;
  styleName?: string | null;
  stylePrompt?: string | null;
  templates: TemplateCandidate[];
  count?: number;
};

export type ArticleToolAction = "outline" | "title" | "digest" | "rewrite" | "expand" | "shorten" | "coverPrompt";

export type ArticleToolInput = {
  action: ArticleToolAction;
  title?: string | null;
  digest?: string | null;
  contentMarkdown?: string | null;
  selectedText?: string | null;
  instruction?: string | null;
  mpName?: string | null;
  styleName?: string | null;
  stylePrompt?: string | null;
};

export type PublishCheckInput = {
  title?: string | null;
  digest?: string | null;
  coverPath?: string | null;
  contentMarkdown?: string | null;
  mpId?: string | null;
  mpName?: string | null;
  mpStatus?: number | null;
  templateName?: string | null;
  templates: TemplateCandidate[];
};

const TopicIdeaSchema = z.object({
  title: z.string().min(1),
  coreOpinion: z.string().min(1),
  outline: z.array(z.string().min(1)).min(1),
  styleId: z.string().optional().default(""),
  templateId: z.string().optional().default(""),
  reason: z.string().optional().default("")
});

export const TopicIdeasSchema = z.object({
  topics: z.array(TopicIdeaSchema).min(1)
});

const ArticleToolResultSchema = z.object({
  action: z.string().min(1),
  title: z.string().optional().default(""),
  digest: z.string().optional().default(""),
  contentMarkdown: z.string().optional().default(""),
  coverPrompt: z.string().optional().default(""),
  rationale: z.string().optional().default("")
});

const PublishIssueSchema = z.object({
  severity: z.enum(["info", "warning", "block"]),
  message: z.string().min(1),
  suggestion: z.string().optional().default("")
});

const PublishCheckSchema = z.object({
  level: z.enum(["pass", "warn", "block"]),
  summary: z.string().min(1),
  issues: z.array(PublishIssueSchema).default([]),
  recommendedTemplateId: z.string().optional().default(""),
  templateReason: z.string().optional().default("")
});

export type TopicIdea = z.infer<typeof TopicIdeaSchema>;
export type ArticleToolResult = z.infer<typeof ArticleToolResultSchema>;
export type PublishCheckResult = z.infer<typeof PublishCheckSchema>;
export type PublishIssue = z.infer<typeof PublishIssueSchema>;

type KimiResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { type?: string; message?: string };
};

export function buildTopicIdeaMessages(input: TopicIdeaInput): KimiMessage[] {
  const templateText = input.templates.map((template) => (
    `${template.id}：${template.name}${template.description ? `，${template.description}` : ""}`
  )).join("\n");

  return [
    {
      role: "system",
      content: [
        "你是微信公众号选题策划助手，只输出合法 JSON Object。",
        "请给出适合订阅号发布的选题卡片，不要写完整文章。",
        "JSON 字段必须是 topics，每项包含 title、coreOpinion、outline、styleId、templateId、reason。"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        `关键词：${input.keyword.trim()}`,
        `目标读者：${input.audience?.trim() || "未指定"}`,
        `订阅号：${input.mpName?.trim() || "未指定"}`,
        `写作风格：${input.styleName || "未指定"}`,
        `风格 Prompt：${input.stylePrompt || "未指定"}`,
        `生成数量：${input.count || 5}`,
        "可选排版模板：",
        templateText || "无",
        "",
        "要求：每个 outline 给 3-5 个短句；templateId 必须优先从可选模板 ID 中选择。"
      ].join("\n")
    }
  ];
}

export function buildArticleToolMessages(input: ArticleToolInput): KimiMessage[] {
  return [
    {
      role: "system",
      content: [
        "你是微信公众号文章编辑 Copilot，只给建议，不自动替用户保存或发布。",
        "只输出合法 JSON Object。",
        "JSON 字段包含 action、title、digest、contentMarkdown、coverPrompt、rationale；不相关字段可为空字符串。"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        `动作：${input.action}`,
        `标题：${input.title || ""}`,
        `摘要：${input.digest || ""}`,
        `选中文本：${input.selectedText || "无"}`,
        `补充要求：${input.instruction || "无"}`,
        `订阅号：${input.mpName || "未指定"}`,
        `写作风格：${input.styleName || "未指定"}`,
        `风格 Prompt：${input.stylePrompt || "未指定"}`,
        "当前 Markdown：",
        input.contentMarkdown || ""
      ].join("\n")
    }
  ];
}

export function buildPublishCheckMessages(input: PublishCheckInput): KimiMessage[] {
  const templateText = input.templates.map((template) => (
    `${template.id}：${template.name}${template.description ? `，${template.description}` : ""}`
  )).join("\n");

  return [
    {
      role: "system",
      content: [
        "你是微信公众号发布前质检助手，只输出合法 JSON Object。",
        "检查标题、摘要、结构、错别字、表达风险、草稿箱发布准备度，并推荐一个排版模板。",
        "JSON 字段必须是 level、summary、issues、recommendedTemplateId、templateReason。"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        `标题：${input.title || ""}`,
        `摘要：${input.digest || ""}`,
        `封面：${input.coverPath || "无"}`,
        `订阅号：${input.mpName || "未指定"}`,
        `当前选择模板：${input.templateName || "未指定"}`,
        "可选排版模板：",
        templateText || "无",
        "正文 Markdown：",
        input.contentMarkdown || ""
      ].join("\n")
    }
  ];
}

export async function generateTopicIdeas(
  input: TopicIdeaInput,
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch } = {}
): Promise<TopicIdea[]> {
  const result = await callKimiJson(TopicIdeasSchema, buildTopicIdeaMessages(input), options);
  return result.topics.slice(0, input.count || 5);
}

export async function runArticleTool(
  input: ArticleToolInput,
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch } = {}
): Promise<ArticleToolResult> {
  return callKimiJson(ArticleToolResultSchema, buildArticleToolMessages(input), options);
}

export async function runPublishCheck(
  input: PublishCheckInput,
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch } = {}
): Promise<PublishCheckResult> {
  const localIssues = getLocalPublishIssues(input);
  const aiResult = await callKimiJson(PublishCheckSchema, buildPublishCheckMessages(input), options);
  const recommended = aiResult.recommendedTemplateId
    ? input.templates.find((template) => template.id === aiResult.recommendedTemplateId)
    : recommendTemplate(input.contentMarkdown || "", input.templates);
  const issues = [...localIssues, ...aiResult.issues];
  const level = issues.some((issue) => issue.severity === "block")
    ? "block"
    : issues.some((issue) => issue.severity === "warning") || aiResult.level === "warn"
      ? "warn"
      : aiResult.level;

  return {
    ...aiResult,
    level,
    issues,
    recommendedTemplateId: recommended?.id || input.templates[0]?.id || "",
    templateReason: aiResult.templateReason || (recommended ? `根据正文结构推荐「${recommended.name}」` : "")
  };
}

export function getLocalPublishIssues(input: Pick<PublishCheckInput, "title" | "digest" | "coverPath" | "contentMarkdown" | "mpId" | "mpStatus">): PublishIssue[] {
  const issues: PublishIssue[] = [];
  if (!input.title?.trim()) issues.push({ severity: "block", message: "文章缺少标题", suggestion: "补充一个明确标题" });
  if (!input.mpId) issues.push({ severity: "block", message: "文章未绑定订阅号", suggestion: "选择目标订阅号" });
  if (input.mpStatus === 0) issues.push({ severity: "block", message: "订阅号已停用", suggestion: "启用订阅号或更换目标账号" });
  if (!input.coverPath?.trim()) issues.push({ severity: "block", message: "文章缺少封面图", suggestion: "上传封面后再推送" });
  if (!input.contentMarkdown?.trim()) issues.push({ severity: "block", message: "文章正文为空", suggestion: "生成或填写正文" });
  if (!input.digest?.trim()) issues.push({ severity: "warning", message: "文章摘要为空", suggestion: "生成 60-80 字摘要" });
  return issues;
}

export function recommendTemplate(content: string, templates: TemplateCandidate[]) {
  if (templates.length === 0) return null;
  const lower = content.toLowerCase();
  const find = (id: string) => templates.find((template) => template.id === id);
  if (/\n\s*(\d+[.)、]|[-*])\s+/.test(content) || lower.includes("步骤") || lower.includes("清单")) {
    return find("dense_playbook") || templates[0];
  }
  if (lower.includes("评测") || lower.includes("对比") || lower.includes("优缺点")) {
    return find("bold_review") || templates[0];
  }
  if (lower.includes("产品") || lower.includes("ai") || lower.includes("saas")) {
    return find("product_report") || templates[0];
  }
  if (lower.includes("复盘") || lower.includes("一人团队") || lower.includes("故事")) {
    return find("warm_column") || templates[0];
  }
  return templates[0];
}

async function callKimiJson<T>(
  schema: z.ZodType<T>,
  messages: KimiMessage[],
  options: { apiKey?: string; model?: string; fetchImpl?: typeof fetch } = {}
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
    return schema.parse(JSON.parse(content));
  } catch {
    throw new Error("Kimi 返回内容格式异常，请重试");
  }
}
