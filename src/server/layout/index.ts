/**
 * 高级排版系统 - 对外统一入口
 *
 * 提供 renderMarkdown / renderMarkdownWithTheme 等便捷函数。
 * 内部整合 parser + renderer + modules + themes。
 */

import type { ResolvedTheme } from "@/server/layout/types";
import { parseDocument } from "@/server/layout/parser/document";
import { renderDocument } from "@/server/layout/renderer";
import { builtinModuleResolver } from "@/server/layout/modules";
import { ensureModulesRegistered } from "@/server/layout/modules";
import { getDefaultTheme, resolveBuiltinTheme, parseThemeStyles } from "@/server/layout/themes";

/**
 * 使用指定主题渲染 Markdown 为微信兼容 HTML。
 *
 * @param markdown 原始 Markdown 文本（可含 :::module 语法）
 * @param theme 已解析的主题
 * @returns 微信兼容的 HTML（纯 inline CSS）
 */
export function renderMarkdownWithTheme(markdown: string, theme: ResolvedTheme): string {
  ensureModulesRegistered();
  const normalized = normalizeMarkdown(markdown);
  const blocks = parseDocument(normalized, { resolver: builtinModuleResolver });
  return renderDocument(blocks, theme);
}

/** 规范化 Markdown：统一换行符，将 <br> 转为换行 */
function normalizeMarkdown(markdown: string): string {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n");
}

/**
 * 便捷渲染：通过主题 ID 渲染 Markdown。
 * 仅支持内置主题 ID。自定义主题请使用 renderMarkdownWithTheme。
 *
 * @param markdown 原始 Markdown 文本
 * @param themeId 内置主题 ID（如 "clean_newsletter"），默认 clean_newsletter
 */
export function renderMarkdown(markdown: string, themeId?: string): string {
  const theme = themeId ? resolveBuiltinTheme(themeId) || getDefaultTheme() : getDefaultTheme();
  return renderMarkdownWithTheme(markdown, theme);
}

/** 从 stylesJson 字符串构建 ResolvedTheme（用于 DB 自定义主题） */
export function resolveThemeFromStylesJson(
  stylesJson: string,
  meta?: { id?: string; name?: string; description?: string; version?: number; background?: string; tokens?: unknown }
): ResolvedTheme {
  const styles = parseThemeStyles(stylesJson);
  return {
    id: meta?.id || "custom",
    name: meta?.name || "自定义主题",
    description: meta?.description,
    tokens: meta?.tokens as ResolvedTheme["tokens"],
    styles,
    version: meta?.version || 1,
    background: meta?.background || "plain"
  };
}

// 导出常用工具
export { parseDocument } from "@/server/layout/parser/document";
export { renderDocument } from "@/server/layout/renderer";
export { ensureModulesRegistered, builtinModuleResolver } from "@/server/layout/modules";
export { getDefaultTheme, resolveBuiltinTheme, parseThemeStyles, BUILTIN_THEMES, getBuiltinTheme } from "@/server/layout/themes";
export type { BuiltinTheme } from "@/server/layout/themes/tokens";
