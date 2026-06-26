/**
 * Markdown → 微信 HTML 渲染（薄封装）
 *
 * 此文件保持原有导出签名不变（markdownToWechatHtml / extractMarkdownImageUrls / replaceImageUrlsInHtml），
 * 内部委托给 @/server/layout 的高级排版引擎，确保 push.ts 和 articles/admin.ts 无需改动即可获得 :::module 等新能力。
 */

import type { WechatStyleTemplateOption } from "@/server/templates/service";
import { renderMarkdownWithTheme } from "@/server/layout";
import { getDefaultTheme, resolveBuiltinTheme } from "@/server/layout/themes";
import type { ResolvedTheme } from "@/server/layout/types";

const IMAGE_RE = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

/** 从 Markdown 中提取所有图片 URL */
export function extractMarkdownImageUrls(markdown: string): string[] {
  const urls: string[] = [];
  for (const match of markdown.matchAll(IMAGE_RE)) {
    if (match[1] && !urls.includes(match[1])) urls.push(match[1]);
  }
  return urls;
}

/** 在 HTML 中替换图片 URL（用于微信素材上传后替换本地 URL） */
export function replaceImageUrlsInHtml(html: string, replacements: Map<string, string>): string {
  let next = html;
  for (const [from, to] of replacements) {
    next = next.split(escapeHtmlAttribute(from)).join(escapeHtmlAttribute(to));
  }
  return next;
}

/**
 * 将 Markdown 渲染为微信兼容 HTML。
 * 支持标准 Markdown + :::module 高级排版语法。
 *
 * @param markdown 原始 Markdown 文本
 * @param template 主题 ID 字符串、模板对象或 undefined（使用默认主题）
 */
export function markdownToWechatHtml(markdown: string, template?: string | WechatStyleTemplateOption): string {
  const theme = resolveTemplateToTheme(template);
  return renderMarkdownWithTheme(markdown, theme);
}

/** 将模板参数转换为 ResolvedTheme */
function resolveTemplateToTheme(template?: string | WechatStyleTemplateOption): ResolvedTheme {
  if (!template) return getDefaultTheme();

  if (typeof template === "string") {
    // 支持别名（向后兼容 presets.ts 的 WECHAT_STYLE_ALIASES）
    const aliased = resolveAlias(template);
    return resolveBuiltinTheme(aliased) || resolveBuiltinTheme(template) || getDefaultTheme();
  }

  // WechatStyleTemplateOption（从 DB 来的模板对象）
  return {
    id: template.id,
    name: template.name,
    description: template.description || undefined,
    tokens: template.tokens as ResolvedTheme["tokens"],
    styles: template.themeStyles,
    version: template.version,
    background: template.background
  };
}

/** 主题 ID 别名（向后兼容） */
function resolveAlias(id: string): string {
  const aliases: Record<string, string> = {
    clean: "clean_newsletter",
    magazine: "warm_column",
    compact: "dense_playbook"
  };
  return aliases[id] || id;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtmlAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
