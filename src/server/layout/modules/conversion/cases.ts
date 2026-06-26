import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const casesDef: LayoutModuleDef = {
  id: "cases", category: "conversion", label: "案例展示",
  description: "案例列表，案例名+行业+结果描述。",
  bodyFormat: "rows", hasTitle: true, columns: ["案例名", "行业", "结果描述"],
  examples: [`:::cases\n客户A | 电商 | 转化率提升 30%\n:::`], since: "1.0.0"
};

export const casesRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];
  let html = `<section style="margin:0 0 16px;">`;
  if (title) html += `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;">${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [name, industry, result] = row.cells;
    html += `<div style="display:flex;align-items:center;background:#f8fafc;border-radius:8px;padding:12px 16px;margin:0 0 8px;">`;
    if (name) html += `<div style="flex:1;"><p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#1e293b;">${ctx.renderInline(name)}</p>`;
    if (industry) html += `<p style="margin:0;font-size:12px;color:#94a3b8;">${ctx.renderInline(industry)}</p>`;
    html += `</div>`;
    if (result) html += `<div style="flex:1;text-align:right;font-size:14px;color:#22c55e;font-weight:600;">${ctx.renderInline(result)}</div>`;
    html += `</div>`;
  }
  html += `</section>`;
  return html;
};
