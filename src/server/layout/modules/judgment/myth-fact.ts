import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const mythFactDef: LayoutModuleDef = {
  id: "myth-fact", category: "judgment", label: "误区与事实",
  description: "误区和事实对比，类型为 myth 或 fact。",
  bodyFormat: "rows", hasTitle: true, columns: ["类型", "内容"],
  examples: [`:::myth-fact\nmyth | AI 会取代所有工作\nfact | AI 改变工作方式\n:::`], since: "1.0.0"
};

export const mythFactRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];
  let html = `<section style="margin:0 0 16px;">`;
  if (title) html += `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;">${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [type, content] = row.cells;
    const isMyth = (type || "").toLowerCase().includes("myth");
    const bg = isMyth ? "#fef2f2" : "#f0fdf4";
    const color = isMyth ? "#dc2626" : "#16a34a";
    const label = isMyth ? "误区" : "事实";
    html += `<div style="display:flex;align-items:flex-start;background:${bg};border-radius:8px;padding:12px 16px;margin:0 0 8px;">`;
    html += `<span style="flex-shrink:0;font-size:12px;font-weight:700;color:${color};background:#fff;padding:2px 8px;border-radius:4px;margin-right:12px;margin-top:2px;">${label}</span>`;
    html += `<span style="font-size:14px;color:#475569;line-height:1.6;">${ctx.renderInline(content || "")}</span>`;
    html += `</div>`;
  }
  html += `</section>`;
  return html;
};
