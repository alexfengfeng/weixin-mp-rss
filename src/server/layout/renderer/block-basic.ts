/**
 * 基础块渲染
 *
 * 从现有 markdown.ts 的 renderBlock 迁移并增强。
 * 提供标题、段落、列表、分隔线、独立图片的渲染函数。
 * 识别逻辑在 renderer/index.ts 的 renderTextLines 中完成。
 */

import type { RenderContext } from "@/server/layout/types";

/** 渲染标题 h1-h3 */
export function renderHeading(level: 1 | 2 | 3, text: string, ctx: RenderContext): string {
  const key = `h${level}` as "h1" | "h2" | "h3";
  return `<h${level}${ctx.style(key)}>${ctx.renderInline(text)}</h${level}>`;
}

/** 渲染段落 */
export function renderParagraph(text: string, ctx: RenderContext): string {
  return `<p${ctx.style("p")}>${ctx.renderInline(text)}</p>`;
}

/** 渲染无序列表 */
export function renderUnorderedList(items: string[], ctx: RenderContext): string {
  const lis = items
    .map((item) => `<li${ctx.style("li")}>${ctx.renderInline(item)}</li>`)
    .join("");
  return `<ul${ctx.style("ul")}>${lis}</ul>`;
}

/** 渲染有序列表 */
export function renderOrderedList(items: string[], ctx: RenderContext): string {
  const lis = items
    .map((item) => `<li${ctx.style("li")}>${ctx.renderInline(item)}</li>`)
    .join("");
  return `<ol${ctx.style("ol")}>${lis}</ol>`;
}

/** 渲染分隔线 */
export function renderHr(ctx: RenderContext): string {
  return `<hr${ctx.style("hr")} />`;
}

/** 渲染独立图片 */
export function renderStandaloneImage(alt: string, url: string, ctx: RenderContext): string {
  return `<p${ctx.style("p")}><img${ctx.style("img")} src="${ctx.escapeAttr(url)}" alt="${ctx.escapeAttr(alt)}" /></p>`;
}

/**
 * 渲染基础块（不含表格/引用/代码块）。
 * 接受按空行分隔的子块文本，识别标题/列表/段落/图片/分隔线。
 */
export function renderBasicBlock(block: string, ctx: RenderContext): string {
  const trimmed = block.trim();
  if (!trimmed) return "";

  // 分隔线
  if (/^[-*_]{3,}$/.test(trimmed)) {
    return renderHr(ctx);
  }

  // 标题
  const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
  if (heading) {
    const level = heading[1].length as 1 | 2 | 3;
    return renderHeading(level, heading[2], ctx);
  }

  // 独立图片
  const image = trimmed.match(/^!\[([^\]]*)]\(([^)\s]+)(?:\s+"[^"]*")?\)$/);
  if (image) {
    return renderStandaloneImage(image[1], image[2], ctx);
  }

  // 多行：检查是否为列表
  const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);

  // 全是无序列表项
  if (lines.every((line) => /^[-*]\s+/.test(line))) {
    const items = lines.map((line) => line.replace(/^[-*]\s+/, ""));
    return renderUnorderedList(items, ctx);
  }

  // 全是有序列表项
  if (lines.every((line) => /^\d+[.)、]\s+/.test(line))) {
    const items = lines.map((line) => line.replace(/^\d+[.)、]\s+/, ""));
    return renderOrderedList(items, ctx);
  }

  // 混合列表和段落
  if (lines.some((line) => /^[-*]\s+/.test(line) || /^\d+[.)、]\s+/.test(line))) {
    return renderMixedLines(lines, ctx);
  }

  // 普通段落（多行用 <br /> 连接）
  return renderParagraph(lines.join("<br />"), ctx);
}

/** 渲染混合列表和段落的行 */
function renderMixedLines(lines: string[], ctx: RenderContext): string {
  const parts: string[] = [];
  let paragraph: string[] = [];
  let unordered: string[] = [];
  let ordered: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) return;
    parts.push(renderParagraph(paragraph.join("<br />"), ctx));
    paragraph = [];
  }
  function flushUnordered() {
    if (unordered.length === 0) return;
    parts.push(renderUnorderedList(unordered, ctx));
    unordered = [];
  }
  function flushOrdered() {
    if (ordered.length === 0) return;
    parts.push(renderOrderedList(ordered, ctx));
    ordered = [];
  }

  for (const line of lines) {
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      flushOrdered();
      unordered.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }
    if (/^\d+[.)、]\s+/.test(line)) {
      flushParagraph();
      flushUnordered();
      ordered.push(line.replace(/^\d+[.)、]\s+/, ""));
      continue;
    }
    flushUnordered();
    flushOrdered();
    paragraph.push(line);
  }

  flushParagraph();
  flushUnordered();
  flushOrdered();
  return parts.join("\n");
}
