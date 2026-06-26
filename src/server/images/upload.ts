/**
 * 独立图片上传服务
 *
 * 将本地图片上传到微信素材库，返回微信可访问的 URL。
 * 支持：正文图片（uploadimg）、永久素材（add_material）。
 */

import { uploadPermanentImage, uploadArticleImage, toAbsoluteUploadPath } from "@/server/wechat/media";
import { getOfficialAccessToken } from "@/server/wechat/official";
import { prisma } from "@/server/db/prisma";

export type UploadImageMode = "article" | "permanent";

export type UploadImageInput = {
  /** 本地图片路径（/uploads/xxx.png 或 data/uploads/xxx.png 或绝对路径） */
  filePath: string;
  /** 目标订阅号 ID */
  mpId: string;
  /** 上传模式：article=正文图片(返回 url)，permanent=永久素材(返回 media_id) */
  mode?: UploadImageMode;
};

export type UploadImageResult = {
  mode: UploadImageMode;
  /** article 模式返回微信 URL，permanent 模式返回 media_id */
  url?: string;
  mediaId?: string;
  originalPath: string;
};

export async function uploadImageToWechat(input: UploadImageInput): Promise<UploadImageResult> {
  if (!input.filePath.trim()) throw new Error("请提供图片路径");
  if (!input.mpId) throw new Error("请提供目标订阅号 ID");

  const mode: UploadImageMode = input.mode || "article";
  const accessToken = await getOfficialAccessToken(input.mpId);

  // 验证路径可访问
  const absolutePath = toAbsoluteUploadPath(input.filePath);

  if (mode === "permanent") {
    const mediaId = await uploadPermanentImage(accessToken, input.filePath);
    return { mode, mediaId, originalPath: input.filePath };
  }

  const url = await uploadArticleImage(accessToken, input.filePath);
  return { mode, url, originalPath: input.filePath };
}

/**
 * 批量上传正文图片到微信
 */
export async function batchUploadImagesToWechat(
  filePaths: string[],
  mpId: string
): Promise<Array<{ filePath: string; url?: string; error?: string }>> {
  if (!filePaths.length) return [];
  const accessToken = await getOfficialAccessToken(mpId);
  const results: Array<{ filePath: string; url?: string; error?: string }> = [];

  for (const filePath of filePaths) {
    try {
      const url = await uploadArticleImage(accessToken, filePath);
      results.push({ filePath, url });
    } catch (e) {
      results.push({ filePath, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return results;
}

/**
 * 从 Markdown 中提取本地图片路径并批量上传
 */
export async function uploadArticleImagesFromMarkdown(
  markdown: string,
  mpId: string
): Promise<{ replacements: Map<string, string>; errors: string[] }> {
  const imageRegex = /!\[[^\]]*]\(([^)]+)\)/g;
  const localPaths: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = imageRegex.exec(markdown)) !== null) {
    const url = m[1];
    if (url.startsWith("/uploads/") || url.startsWith("data/uploads/")) {
      localPaths.push(url);
    }
  }

  const results = await batchUploadImagesToWechat(localPaths, mpId);
  const replacements = new Map<string, string>();
  const errors: string[] = [];

  for (const r of results) {
    if (r.url) {
      replacements.set(r.filePath, r.url);
    } else {
      errors.push(`${r.filePath}: ${r.error}`);
    }
  }

  return { replacements, errors };
}
