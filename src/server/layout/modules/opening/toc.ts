/**
 * toc 模块 - 目录
 *
 * :::toc
 * 序号 | 章节名 | 说明
 * 1 | 开篇 | 为什么要做这件事
 * 2 | 实践 | 具体怎么做
 * :::
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const tocDef: LayoutModuleDef = {
  id: "toc",
  category: "opening",
  label: "目录",
  description: "文章目录，序号 + 章节名 + 说明，帮助读者快速了解文章结构。",
  bodyFormat: "rows",
  hasTitle: true,
  columns: ["序号", "章节名", "说明"],
  examples: [
    `:::toc
序号 | 章节名 | 说明
1 | 开篇 | 为什么要做这件事
2 | 实践 | 具体怎么做
:::`
  ],
  since: "1.0.0"
};

export const tocRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];

  const wrapStyle = ctx.moduleStyle("toc", "wrap") ||
    ` style="background:#f8fafc;border-radius:8px;padding:20px;margin:0 0 20px;"`;
  const titleStyle = ctx.moduleStyle("toc", "title") ||
    ` style="margin:0 0 12px;font-size:16px;font-weight:700;color:#334155;"`;
  const itemStyle = ctx.moduleStyle("toc", "item") ||
    ` style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#475569;"`;
  const numStyle = ctx.moduleStyle("toc", "num") ||
    ` style="flex-shrink:0;width:24px;height:24px;border-radius:50%;background:#e0e7ff;color:#4f46e5;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-right:12px;"`;
  const nameStyle = ctx.moduleStyle("toc", "name") ||
    ` style="font-weight:600;color:#1e293b;margin-right:8px;"`;
  const descStyle = ctx.moduleStyle("toc", "desc") ||
    ` style="color:#94a3b8;font-size:13px;"`;

  let html = `<section${wrapStyle}>`;
  if (title) html += `<p${titleStyle}>${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [num, name, desc] = row.cells;
    html += `<div${itemStyle}>`;
    if (num) html += `<span${numStyle}>${ctx.escapeHtml(num)}</span>`;
    if (name) html += `<span${nameStyle}>${ctx.renderInline(name)}</span>`;
    if (desc) html += `<span${descStyle}>${ctx.renderInline(desc)}</span>`;
    html += `</div>`;
  }
  html += `</section>`;

  return html;
};
