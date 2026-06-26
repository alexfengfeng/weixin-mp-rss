/**
 * faq 模块 - 常见问答
 *
 * :::faq
 * 问题 | 回答
 * 如何开始？ | 点击注册按钮即可开始
 * 支持哪些格式？ | 支持 Markdown 和富文本
 * :::
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const faqDef: LayoutModuleDef = {
  id: "faq",
  category: "conversion",
  label: "常见问答",
  description: "问答列表，问题 + 回答，适合 FAQ 和答疑。",
  bodyFormat: "rows",
  hasTitle: true,
  columns: ["问题", "回答"],
  examples: [
    `:::faq
常见问题
如何开始？ | 点击注册按钮即可开始
支持哪些格式？ | 支持 Markdown 和富文本
:::`
  ],
  since: "1.0.0"
};

export const faqRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];

  const wrapStyle = ctx.moduleStyle("faq", "wrap") ||
    ` style="margin:0 0 16px;"`;
  const titleStyle = ctx.moduleStyle("faq", "title") ||
    ` style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;"`;
  const itemStyle = ctx.moduleStyle("faq", "item") ||
    ` style="padding:12px 0;border-bottom:1px solid #f1f5f9;"`;
  const qStyle = ctx.moduleStyle("faq", "question") ||
    ` style="margin:0 0 6px;font-size:15px;font-weight:600;color:#1e293b;"`;
  const aStyle = ctx.moduleStyle("faq", "answer") ||
    ` style="margin:0;font-size:14px;color:#64748b;line-height:1.7;"`;

  let html = `<section${wrapStyle}>`;
  if (title) html += `<p${titleStyle}>${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [q, a] = row.cells;
    html += `<div${itemStyle}>`;
    if (q) html += `<p${qStyle}>Q: ${ctx.renderInline(q)}</p>`;
    if (a) html += `<p${aStyle}>A: ${ctx.renderInline(a)}</p>`;
    html += `</div>`;
  }
  html += `</section>`;

  return html;
};
