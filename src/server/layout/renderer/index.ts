/**
 * 渲染器统一入口
 *
 * renderDocument: 遍历 Block[]，text 块调用 renderTextLines，module 块调用 registry 的 render。
 * renderMarkdownToHtml: 便捷函数，从 Markdown 文本直接渲染为 HTML。
 */

import type { Block, ResolvedTheme } from "@/server/layout/types";
import { getModule } from "@/server/layout/modules/registry";
import { createRenderContext, renderTextLines } from "@/server/layout/renderer/context";

/**
 * 渲染已解析的文档块为 HTML。
 *
 * @param blocks parseDocument 返回的 Block[]
 * @param theme 已解析的主题
 * @returns 完整 HTML 字符串
 */
export function renderDocument(blocks: Block[], theme: ResolvedTheme): string {
  const ctx = createRenderContext(theme);
  const htmlParts: string[] = [];

  for (const block of blocks) {
    if (block.type === "text") {
      const html = renderTextLines(block.lines, ctx);
      if (html) htmlParts.push(html);
    } else if (block.type === "module") {
      const html = renderModuleBlock(block.module, ctx);
      if (html) htmlParts.push(html);
    }
  }

  return htmlParts.join("\n");
}

/** 渲染单个模块块 */
function renderModuleBlock(
  module: { name: string; raw: string; unknown?: boolean; parseError?: string },
  ctx: ReturnType<typeof createRenderContext>
): string {
  // 未注册模块：保留原文，不报错
  if (module.unknown) {
    const escaped = ctx.escapeHtml(module.raw);
    return `<p${ctx.style("p")}>${escaped}</p>`;
  }

  const registered = getModule(module.name);
  if (!registered) {
    // 运行时模块未注册（防御性）
    const escaped = ctx.escapeHtml(module.raw);
    return `<p${ctx.style("p")}>${escaped}</p>`;
  }

  // 解析错误：保留原文并标注
  if (module.parseError) {
    const escaped = ctx.escapeHtml(module.raw);
    return `<p${ctx.style("p")}>${escaped}</p>`;
  }

  return registered.render(module as never, ctx);
}

export { createRenderContext, renderTextLines, escapeHtml, escapeAttr } from "@/server/layout/renderer/context";
export { renderInlineMarkdown } from "@/server/layout/renderer/inline";
export { renderBasicBlock, renderHeading, renderParagraph } from "@/server/layout/renderer/block-basic";
export { renderCodeBlock } from "@/server/layout/renderer/block-code";
export { renderQuoteBlock } from "@/server/layout/renderer/block-quote";
export { renderTable } from "@/server/layout/renderer/block-table";
