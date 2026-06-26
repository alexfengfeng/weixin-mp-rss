/**
 * Brand Profile（品牌档案）服务
 *
 * 使用 Setting 表存储品牌档案 JSON，跨会话保持写作风格一致性。
 * 在 AI 写作/去痕/质检时自动注入。
 */

import { prisma } from "@/server/db/prisma";
import { getSetting, setSetting } from "@/server/settings/settings";

const SETTING_KEY = "brandProfile";

export type BrandProfile = {
  /** 品牌名称 / 订阅号名称 */
  brandName: string;
  /** Slogan / 一句话定位 */
  slogan: string;
  /** 默认作者署名 */
  author: string;
  /** 默认排版主题 ID */
  defaultThemeId: string;
  /** 默认写作风格 ID */
  defaultStyleId: string;
  /** 品牌人设描述（给 AI 的 prompt） */
  persona: string;
  /** 封面图风格描述 */
  coverStyle: string;
  /** 写作偏好（给 AI 的补充指令） */
  writingPreference: string;
  /** 禁用词 / 敏感词列表（换行分隔） */
  bannedWords: string;
};

const DEFAULT_PROFILE: BrandProfile = {
  brandName: "",
  slogan: "",
  author: "",
  defaultThemeId: "clean_newsletter",
  defaultStyleId: "",
  persona: "",
  coverStyle: "",
  writingPreference: "",
  bannedWords: ""
};

export async function getBrandProfile(): Promise<BrandProfile> {
  const raw = await getSetting(SETTING_KEY, "");
  if (!raw.trim()) return { ...DEFAULT_PROFILE };
  try {
    const parsed = JSON.parse(raw) as Partial<BrandProfile>;
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export async function saveBrandProfile(profile: BrandProfile): Promise<void> {
  await setSetting(SETTING_KEY, JSON.stringify(profile));
}

/**
 * 获取品牌档案的 prompt 片段，用于注入 AI 写作流程。
 * 只包含非空字段，避免给 AI 无效信息。
 */
export async function getBrandProfilePrompt(): Promise<string> {
  const profile = await getBrandProfile();
  const lines: string[] = [];

  if (profile.brandName.trim()) lines.push(`品牌名称：${profile.brandName.trim()}`);
  if (profile.slogan.trim()) lines.push(`定位 slogan：${profile.slogan.trim()}`);
  if (profile.author.trim()) lines.push(`默认作者：${profile.author.trim()}`);
  if (profile.persona.trim()) lines.push(`品牌人设：${profile.persona.trim()}`);
  if (profile.writingPreference.trim()) lines.push(`写作偏好：${profile.writingPreference.trim()}`);
  if (profile.bannedWords.trim()) {
    const words = profile.bannedWords.split(/\n/).map((w) => w.trim()).filter(Boolean);
    if (words.length > 0) lines.push(`禁用词：${words.join("、")}`);
  }

  return lines.join("\n");
}

/**
 * 获取封面图风格 prompt
 */
export async function getBrandCoverPrompt(): Promise<string> {
  const profile = await getBrandProfile();
  return profile.coverStyle.trim();
}
