/**
 * compare 模块 - 对比
 * :::compare
 * 维度 | A方描述 | B方描述 | 颜色
 * 价格 | 免费 | $99/月 | green
 * 功能 | 基础 | 完整 | blue
 * :::
 */
import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const compareDef: LayoutModuleDef = {
  id: "compare", category: "infographic", label: "对比",
  description: "双列对比展示，维度+A方+B方+颜色。",
  bodyFormat: "rows", hasTitle: true, columns: ["维度", "A方描述", "B方描述", "颜色"],
  examples: [`:::compare\n价格 | 免费 | $99/月 | green\n:::`], since: "1.0.0"
};

export const compareRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];
  let html = `<section style="margin:0 0 16px;">`;
  if (title) html += `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;">${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [dim, a, b] = row.cells;
    html += `<div style="display:flex;align-items:center;padding:12px 0;border-bottom:1px solid #f1f5f9;">`;
    if (dim) html += `<div style="flex-shrink:0;width:80px;font-size:13px;font-weight:600;color:#64748b;">${ctx.renderInline(dim)}</div>`;
    html += `<div style="flex:1;text-align:center;font-size:14px;color:#475569;">${ctx.renderInline(a || "")}</div>`;
    html += `<div style="flex-shrink:0;padding:0 12px;color:#cbd5e1;">vs</div>`;
    html += `<div style="flex:1;text-align:center;font-size:14px;color:#475569;">${ctx.renderInline(b || "")}</div>`;
    html += `</div>`;
  }
  html += `</section>`;
  return html;
};
