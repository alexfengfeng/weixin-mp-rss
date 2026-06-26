/**
 * summary 模块 - 摘要
 *
 * :::summary
 * 本期要点
 * 第一条要点内容
 * 第二条要点内容
 * 第三条要点内容
 * :::
 *
 * rows 格式，每行一条要点（单列）。
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const summaryDef: LayoutModuleDef = {
  id: "summary",
  category: "conversion",
  label: "摘要",
  description: "文章要点汇总，每行一条，帮助读者快速回顾核心内容。",
  bodyFormat: "rows",
  hasTitle: true,
  columns: ["要点"],
  examples: [
    `:::summary
本期要点
第一条要点内容
第二条要点内容
:::`
  ],
  since: "1.0.0"
};

export const summaryRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];

  const wrapStyle = ctx.moduleStyle("summary", "wrap") ||
    ` style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin:0 0 16px;"`;
  const titleStyle = ctx.moduleStyle("summary", "title") ||
    ` style="margin:0 0 10px;font-size:16px;font-weight:700;color:#92400e;"`;
  const itemStyle = ctx.moduleStyle("summary", "item") ||
    ` style="display:flex;align-items:flex-start;padding:5px 0;font-size:14px;color:#78350f;line-height:1.7;"`;
  const dotStyle = ctx.moduleStyle("summary", "dot") ||
    ` style="flex-shrink:0;width:6px;height:6px;border-radius:50%;background:#f59e0b;margin:9px 10px 0 0;"`;

  let html = `<section${wrapStyle}>`;
  if (title) html += `<p${titleStyle}>${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const text = row.cells[0] || "";
    if (text.trim()) {
      html += `<div${itemStyle}><span${dotStyle}></span><span>${ctx.renderInline(text)}</span></div>`;
    }
  }
  html += `</section>`;

  return html;
};
