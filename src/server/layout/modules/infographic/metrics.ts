/**
 * metrics 模块 - 指标展示
 * :::metrics
 * 指标名 | 数值 | 说明 | 颜色
 * 用户增长 | 120% | 同比增长 | green
 * 留存率 | 85% | 月留存 | blue
 * :::
 */
import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const metricsDef: LayoutModuleDef = {
  id: "metrics", category: "infographic", label: "指标展示",
  description: "数据指标卡片，指标名+数值+说明+颜色。",
  bodyFormat: "rows", hasTitle: true, columns: ["指标名", "数值", "说明", "颜色"],
  examples: [`:::metrics\n用户增长 | 120% | 同比增长 | green\n:::`], since: "1.0.0"
};

export const metricsRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];
  const colors: Record<string, string> = { green: "#22c55e", blue: "#3b82f6", orange: "#f59e0b", red: "#ef4444", purple: "#8b5cf6" };
  let html = `<section style="margin:0 0 16px;">`;
  if (title) html += `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;">${ctx.escapeHtml(title)}</p>`;
  html += `<div style="display:flex;flex-wrap:wrap;gap:12px;">`;
  for (const row of rows) {
    const [name, value, desc, colorName] = row.cells;
    const color = colors[(colorName || "blue").toLowerCase()] || colors.blue;
    html += `<div style="flex:1;min-width:120px;background:${color}0d;border-radius:8px;padding:16px;text-align:center;">`;
    if (value) html += `<p style="margin:0 0 4px;font-size:28px;font-weight:800;color:${color};">${ctx.renderInline(value)}</p>`;
    if (name) html += `<p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#1e293b;">${ctx.renderInline(name)}</p>`;
    if (desc) html += `<p style="margin:0;font-size:12px;color:#94a3b8;">${ctx.renderInline(desc)}</p>`;
    html += `</div>`;
  }
  html += `</div></section>`;
  return html;
};
