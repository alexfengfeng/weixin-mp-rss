/**
 * 渲染上下文工厂
 *
 * 创建 RenderContext，整合主题样式、行内渲染、块级渲染工具。
 * 块级渲染编排逻辑（代码块/引用/表格/基础块的识别与分发）也在此文件中。
 */

import type { Block, RenderContext, ResolvedTheme, BaseStyleKey } from "@/server/layout/types";
import { renderInlineMarkdown } from "@/server/layout/renderer/inline";
import { renderBasicBlock } from "@/server/layout/renderer/block-basic";
import { renderCodeBlock, isCodeFenceStart, isCodeFenceEnd, extractCodeFenceLang } from "@/server/layout/renderer/block-code";
import { renderQuoteBlock, isQuoteLine } from "@/server/layout/renderer/block-quote";
import { renderTable, isTableSeparator } from "@/server/layout/renderer/block-table";

/** HTML 转义 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** HTML 属性转义 */
export function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

/**
 * 创建渲染上下文。
 * renderMarkdown 闭包会递归调用 renderTextLines，支持引用块嵌套。
 */
export function createRenderContext(theme: ResolvedTheme): RenderContext {
  const ctx: RenderContext = {
    theme,
    escapeHtml,
    escapeAttr,
    style: (key: BaseStyleKey) => styleAttr(theme, key),
    moduleStyle: (moduleName: string, key: string) => moduleStyleAttr(theme, moduleName, key),
    renderInline: (text: string) =>
      renderInlineMarkdown(text, { escapeHtml, escapeAttr, style: (key: string) => styleAttr(theme, key as BaseStyleKey) }),
    renderMarkdown: (text: string) => renderTextLines(text.split("\n"), ctx)
  };
  return ctx;
}

/** 获取基础样式 → ` style="..."` 或空字符串 */
function styleAttr(theme: ResolvedTheme, key: BaseStyleKey): string {
  const css = theme.styles.base[key];
  return css ? ` style="${escapeAttr(css)}"` : "";
}

/** 获取模块样式 → ` style="..."` 或空字符串 */
function moduleStyleAttr(theme: ResolvedTheme, moduleName: string, key: string): string {
  const css = theme.styles.modules?.[moduleName]?.[key];
  return css ? ` style="${escapeAttr(css)}"` : "";
}

/**
 * 渲染文本行（text 块的 lines）为 HTML。
 * 按行扫描，识别代码块/引用块/表格/基础块，分发到对应渲染函数。
 */
export function renderTextLines(lines: string[], ctx: RenderContext): string {
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 跳过空行
    if (!line.trim()) {
      i++;
      continue;
    }

    // 代码块（``` 或 ~~~ 围栏）
    if (isCodeFenceStart(line)) {
      const lang = extractCodeFenceLang(line);
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !isCodeFenceEnd(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // 跳过结束围栏（若有）
      html.push(renderCodeBlock(codeLines.join("\n"), lang, ctx));
      continue;
    }

    // 引用块（> 前缀的连续行）
    if (isQuoteLine(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && isQuoteLine(lines[i])) {
        quoteLines.push(lines[i]);
        i++;
      }
      html.push(renderQuoteBlock(quoteLines, ctx));
      continue;
    }

    // 表格（首行有 |，次行是分隔行）
    if (line.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const tableLines: string[] = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        tableLines.push(lines[i]);
        i++;
      }
      html.push(renderTable(tableLines, ctx));
      continue;
    }

    // 基础块（按空行分块的连续非特殊行）
    const blockLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !isCodeFenceStart(lines[i]) &&
      !isQuoteLine(lines[i])
    ) {
      // 表格起始也中断基础块
      if (lines[i].includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
        break;
      }
      // 标题行独占一块：如果当前块已有内容且遇到标题行，中断
      if (blockLines.length > 0 && /^#{1,3}\s+/.test(lines[i].trim())) {
        break;
      }
      blockLines.push(lines[i]);
      i++;
    }
    const blockText = blockLines.join("\n");
    // 按空行再分块（保持与原渲染器一致的行为）
    const subBlocks = blockText.split(/\n{2,}/);
    for (const subBlock of subBlocks) {
      const trimmed = subBlock.trim();
      if (trimmed) {
        html.push(renderBasicBlock(trimmed, ctx));
      }
    }
  }

  return html.filter(Boolean).join("\n");
}
