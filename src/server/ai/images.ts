import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

type ImageType = "cover" | "illustration";
type ImageSize = "1024x1024" | "1024x1536" | "1536x1024";

export type GenerateImageInput = {
  type: ImageType;
  title?: string | null;
  digest?: string | null;
  contentMarkdown?: string | null;
  selectedText?: string | null;
  styleHint?: string | null;
  referenceImages?: string[] | null;
};

export type GeneratedImageResult = {
  path: string;
  storagePath: string;
  size: ImageSize;
  prompt: string;
  mode: "text" | "edit";
  references: string[];
};

type ImageSource = { url?: string; base64?: string };
type ProviderErrorBody = { error?: { message?: string } };

const DEFAULT_BASE_URL = "https://api.highwayapi.ai/v3";
const FALLBACK_BASE_URL = "https://api.jiekou.ai/v3";
const TEXT_ENDPOINT_PATH = "/gpt-image-2-light-text-to-image";
const EDIT_ENDPOINT_PATH = "/gpt-image-2-light-edit";

export function chooseImageSize(input: Pick<GenerateImageInput, "type" | "contentMarkdown" | "selectedText">): ImageSize {
  if (input.type === "cover") return "1536x1024";

  const content = `${input.selectedText || ""}\n${input.contentMarkdown || ""}`.toLowerCase();
  if (/步骤|清单|教程|sop|流程|信息图|infographic|\n\s*(\d+[.)、]|[-*])\s+/.test(content)) return "1536x1024";
  if (/人物|故事|访谈|手记|创始人|一人团队|复盘|portrait|person/.test(content)) return "1024x1536";
  return "1024x1024";
}

export function buildImagePrompt(input: GenerateImageInput) {
  const purpose = input.type === "cover" ? "微信公众号文章封面图" : "微信公众号文章正文插图";
  const context = input.selectedText?.trim() || input.contentMarkdown?.trim() || "请根据标题和摘要构思画面";
  return [
    `用途：${purpose}`,
    `标题：${input.title?.trim() || "未命名文章"}`,
    `摘要：${input.digest?.trim() || "无"}`,
    `视觉风格：${input.styleHint?.trim() || "现代、清晰、有公众号阅读场景的编辑感"}`,
    "要求：画面干净、主体明确、适合中文公众号；避免密集小字、二维码、水印、真实品牌商标；不要生成夸张猎奇元素。",
    "内容上下文：",
    context.slice(0, 1600)
  ].join("\n");
}

export function parseGeneratedImage(body: unknown): ImageSource {
  const images = typeof body === "object" && body && "images" in body
    ? (body as { images?: unknown[] }).images
    : undefined;
  const first = images?.[0];

  if (typeof first === "string" && first) return { url: first };
  if (typeof first === "object" && first) {
    const item = first as { url?: unknown; image_url?: unknown; href?: unknown; b64_json?: unknown; base64?: unknown };
    if (typeof item.url === "string" && item.url) return { url: item.url };
    if (typeof item.image_url === "string" && item.image_url) return { url: item.image_url };
    if (typeof item.href === "string" && item.href) return { url: item.href };
    if (typeof item.b64_json === "string" && item.b64_json) return { base64: item.b64_json };
    if (typeof item.base64 === "string" && item.base64) return { base64: item.base64 };
  }

  throw new Error("图片生成失败：接口未返回图片");
}

export async function generateArticleImage(
  input: GenerateImageInput,
  options: {
    apiKey?: string;
    baseUrl?: string;
    endpoint?: string;
    model?: string;
    uploadDir?: string;
    fetchImpl?: typeof fetch;
  } = {}
): Promise<GeneratedImageResult> {
  const apiKey = options.apiKey ?? process.env.HIGHWAY_API_KEY ?? process.env.JIEKOU_API_KEY ?? "";
  if (!apiKey.trim()) throw new Error("未配置 HIGHWAY_API_KEY 或 JIEKOU_API_KEY");

  const size = chooseImageSize(input);
  const prompt = buildImagePrompt(input);
  const baseUrl = resolveBaseUrl(options);
  const fetchImpl = options.fetchImpl || fetch;
  const references = (input.referenceImages || []).map((item) => item.trim()).filter(Boolean).slice(0, 16);
  const mode = references.length > 0 ? "edit" : "text";
  const normalizedReferences = mode === "edit"
    ? await Promise.all(references.map((image) => normalizeReferenceImage(image, options.uploadDir)))
    : [];
  const endpoint = endpointUrl(baseUrl, mode === "edit" ? EDIT_ENDPOINT_PATH : TEXT_ENDPOINT_PATH);

  let response = await requestImage(endpoint, apiKey, {
    mode,
    prompt,
    size,
    fetchImpl,
    referenceImages: normalizedReferences
  });
  let finalSize = size;
  if (shouldDowngradeSize(response.status, size)) {
    finalSize = "1024x1024";
    response = await requestImage(endpoint, apiKey, {
      mode,
      prompt,
      size: finalSize,
      fetchImpl,
      referenceImages: normalizedReferences
    });
  }
  if (shouldFallbackToJiekouHost(response.status, baseUrl)) {
    response = await requestImage(endpointUrl(FALLBACK_BASE_URL, mode === "edit" ? EDIT_ENDPOINT_PATH : TEXT_ENDPOINT_PATH), apiKey, {
      mode,
      prompt,
      size: finalSize,
      fetchImpl,
      referenceImages: normalizedReferences
    });
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(normalizeImageApiError(response.status, body));

  const source = parseGeneratedImage(body);
  const bytes = source.base64
    ? Buffer.from(stripDataUrlPrefix(source.base64), "base64")
    : await downloadImage(source.url || "", fetchImpl);
  const extension = source.url ? extensionFromUrl(source.url) : ".png";
  return saveGeneratedImage(bytes, extension, finalSize, prompt, mode, references, options.uploadDir);
}

async function requestImage(
  endpoint: string,
  apiKey: string,
  input: {
    mode: "text" | "edit";
    prompt: string;
    size: ImageSize;
    fetchImpl: typeof fetch;
    referenceImages: string[];
  }
) {
  try {
    const body: Record<string, unknown> = {
      prompt: input.prompt,
      size: input.size,
      background: "auto",
      moderation: "auto"
    };
    if (input.mode === "edit") {
      body.images = input.referenceImages.map((image) => ({ image_url: image }));
    }

    return await input.fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
  } catch {
    throw new Error(`图片生成网络请求失败（${new URL(endpoint).host}），请检查服务器网络或稍后重试`);
  }
}

function resolveBaseUrl(options: { baseUrl?: string }) {
  const baseUrl = (options.baseUrl || process.env.HIGHWAY_IMAGE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  return baseUrl.endsWith("/openai") ? DEFAULT_BASE_URL : baseUrl;
}

function endpointUrl(baseUrl: string, endpointPath: string) {
  return `${baseUrl}${endpointPath}`;
}

function shouldDowngradeSize(status: number, size: ImageSize) {
  return size !== "1024x1024" && [408, 502, 503, 504].includes(status);
}

function shouldFallbackToJiekouHost(status: number, baseUrl: string) {
  return baseUrl === DEFAULT_BASE_URL && [408, 502, 503, 504].includes(status);
}

function normalizeImageApiError(status: number, body: unknown) {
  const message = typeof body === "object" && body && "error" in body
    ? (body as ProviderErrorBody).error?.message
    : "";
  if (status === 401 || status === 403) return "图片生成鉴权失败，请检查 HIGHWAY_API_KEY";
  if (status === 429) return "图片生成调用受限，请稍后重试或检查额度";
  if ([408, 502, 503, 504].includes(status)) return "图片生成上游超时，请稍后重试";
  return message ? `图片生成失败: ${message}` : `图片生成失败: HTTP ${status}`;
}

async function downloadImage(url: string, fetchImpl: typeof fetch) {
  if (!url) throw new Error("图片生成失败：接口未返回图片");
  if (url.startsWith("data:")) return Buffer.from(stripDataUrlPrefix(url), "base64");
  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`图片下载失败: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

export async function normalizeReferenceImage(image: string, uploadDir?: string) {
  if (/^https?:\/\//i.test(image) || image.startsWith("data:")) return image;
  const dir = uploadDir || path.join(/* turbopackIgnore: true */ process.cwd(), "data", "uploads");
  const filename = image.startsWith("/uploads/")
    ? image.replace(/^\/uploads\//, "")
    : image.startsWith("data/uploads/")
      ? image.replace(/^data\/uploads\//, "")
      : path.basename(image);
  const filePath = path.join(dir, filename);
  const extension = path.extname(filePath).toLowerCase();
  const mimeType = mimeTypeFromExtension(extension);
  const bytes = await readFile(/* turbopackIgnore: true */ filePath);
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

async function saveGeneratedImage(
  bytes: Buffer,
  extension: string,
  size: ImageSize,
  prompt: string,
  mode: "text" | "edit",
  references: string[],
  uploadDir?: string
): Promise<GeneratedImageResult> {
  const dir = uploadDir || path.join(/* turbopackIgnore: true */ process.cwd(), "data", "uploads");
  await mkdir(dir, { recursive: true });
  const safeExtension = [".jpg", ".jpeg", ".png", ".webp"].includes(extension.toLowerCase()) ? extension.toLowerCase() : ".png";
  const filename = `${randomUUID()}${safeExtension}`;
  const absolutePath = uploadDir
    ? `${dir.replace(/\/$/, "")}/${filename}`
    : path.join(/* turbopackIgnore: true */ process.cwd(), "data", "uploads", filename);
  await writeFile(/* turbopackIgnore: true */ absolutePath, bytes);
  return {
    path: `/uploads/${filename}`,
    storagePath: `data/uploads/${filename}`,
    size,
    prompt,
    mode,
    references
  };
}

function extensionFromUrl(url: string) {
  try {
    const extension = path.extname(new URL(url).pathname).toLowerCase();
    return extension || ".png";
  } catch {
    return ".png";
  }
}

function stripDataUrlPrefix(value: string) {
  const match = value.match(/^data:[^;]+;base64,(.+)$/);
  return match ? match[1] : value;
}

function mimeTypeFromExtension(extension: string) {
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  return "image/png";
}
