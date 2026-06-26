/**
 * cards 模块 - 卡片列表
 *
 * :::cards
 * 卡片标题 | 副标题 | 说明 | 颜色
 * 产品分析 | 深度 | 从用户需求出发 | blue
 * 增长策略 | 实战 | 可复用的方法论 | green
 * :::
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

const COLOR_MAP: Record<string, string> = {
  blue: "#3b82f6",
  green: "#22c55e",
  orange: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  gray: "#6b7280"
};

export const cardsDef: LayoutModuleDef = {
  id: "cards",
  category: "opening",
  label: "卡片列表",
  description: "多卡片并列展示，每张卡片含标题、副标题、说明和颜色标记。",
  bodyFormat: "rows",
  hasTitle: true,
  columns: ["卡片标题", "副标题", "说明", "颜色"],
  examples: [`:::cards\n产品分析 | 深度 | 从用户需求出发 | blue\n增长策略 | 实战 | 可复用方法论 | green\n:::`],
  since: "1.0.0"
};

export const cardsRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];

  const wrapStyle = ctx.moduleStyle("cards", "wrap") || ` style="margin:0 0 16px;"`;
  const titleStyle = ctx.moduleStyle("cards", "title") || ` style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;"`;
  const cardBase = "padding:16px;border-radius:8px;margin:0 0 10px;";

  let html = `<section${wrapStyle}>`;
  if (title) html += `<p${titleStyle}>${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [cardTitle, subtitle, desc, colorName] = row.cells;
    const color = COLOR_MAP[(colorName || "blue").toLowerCase()] || COLOR_MAP.blue;
    const cardStyle = ctx.moduleStyle("cards", "card") || ` style="${cardBase}background:${color}11;border-left:4px solid ${color};"`;
    html += `<div${cardStyle}>`;
    if (cardTitle) html += `<p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${color};">${ctx.renderInline(cardTitle)}</p>`;
    if (subtitle) html += `<p style="margin:0 0 6px;font-size:13px;color:#64748b;">${ctx.renderInline(subtitle)}</p>`;
    if (desc) html += `<p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">${ctx.renderInline(desc)}</p>`;
    html += `</div>`;
  }
  html += `</section>`;
  return html;
};
