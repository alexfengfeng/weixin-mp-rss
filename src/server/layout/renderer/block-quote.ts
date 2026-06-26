/**
 * 引用块渲染
 *
 * 支持 > 前缀的引用块，支持嵌套。
 */

import type { RenderContext } from "@/server/layout/types";

/** 判断行是否为引用块 */
export function isQuoteLine(line: string): boolean {
  return /^\s{0,3}>/.test(line);
}

/** 去除引用前缀 >，返回内容行 */
export function stripQuotePrefix(line: string): string {
  return line.replace(/^\s{0,3}>\s?/, "");
}

/**
 * 渲染引用块。
 * 接受引用块的所有原始行（含 > 前缀），递归处理嵌套引用。
 */
export function renderQuoteBlock(lines: string[], ctx: RenderContext): string {
  // 去除前缀，得到引用内容
  const contentLines = lines.map(stripQuotePrefix);

  // 递归渲染引用内容（支持嵌套引用和内部 markdown）
  const innerHtml = ctx.renderMarkdown(contentLines.join("\n"));

  return `<blockquote${ctx.style("blockquote")}>${innerHtml}</blockquote>`;
}
