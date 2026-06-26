import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const statRowDef: LayoutModuleDef = {
  id: "stat-row", category: "sprint4", label: "统计行",
  description: "横排统计数据，json_array 格式。",
  bodyFormat: "json_array",
  examples: [`:::stat-row\n[{"label":"用户","value":"10万","unit":"","note":"月活"},{"label":"收入","value":"500","unit":"万","note":"月收入"}]\n:::`],
  since: "1.0.0"
};

export const statRowRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const data = module.body.json as Array<{ label?: string; value?: string; unit?: string; note?: string }> | undefined;
  if (!Array.isArray(data)) return "";
  let html = `<section style="margin:0 0 16px;"><div style="display:flex;gap:12px;">`;
  for (const item of data) {
    html += `<div style="flex:1;background:#f8fafc;border-radius:8px;padding:16px;text-align:center;">`;
    if (item.value) html += `<p style="margin:0 0 2px;font-size:24px;font-weight:800;color:#4f46e5;">${ctx.escapeHtml(item.value)}<span style="font-size:14px;">${ctx.escapeHtml(item.unit || "")}</span></p>`;
    if (item.label) html += `<p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#475569;">${ctx.escapeHtml(item.label)}</p>`;
    if (item.note) html += `<p style="margin:0;font-size:12px;color:#94a3b8;">${ctx.escapeHtml(item.note)}</p>`;
    html += `</div>`;
  }
  html += `</div></section>`;
  return html;
};
