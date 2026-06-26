import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const audienceFitDef: LayoutModuleDef = {
  id: "audience-fit", category: "judgment", label: "适用人群",
  description: "适用/不适用人群列表，类型为 fit 或 not-fit。",
  bodyFormat: "rows", hasTitle: true, columns: ["类型", "描述"],
  examples: [`:::audience-fit\nfit | 内容创作者\nnot-fit | 纯技术团队\n:::`], since: "1.0.0"
};

export const audienceFitRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];
  let html = `<section style="margin:0 0 16px;">`;
  if (title) html += `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;">${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [type, desc] = row.cells;
    const isFit = (type || "").toLowerCase().includes("fit") && !(type || "").toLowerCase().includes("not");
    const color = isFit ? "#22c55e" : "#ef4444";
    const icon = isFit ? "&#10003;" : "&#10007;";
    html += `<div style="display:flex;align-items:center;padding:8px 0;">`;
    html += `<span style="flex-shrink:0;width:24px;height:24px;border-radius:50%;background:${color}1a;color:${color};display:flex;align-items:center;justify-content:center;font-size:14px;margin-right:12px;">${icon}</span>`;
    html += `<span style="font-size:14px;color:#475569;">${ctx.renderInline(desc || "")}</span>`;
    html += `</div>`;
  }
  html += `</section>`;
  return html;
};
