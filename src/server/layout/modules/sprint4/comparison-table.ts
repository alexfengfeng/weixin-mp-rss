import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const comparisonTableDef: LayoutModuleDef = {
  id: "comparison-table", category: "sprint4", label: "对比表",
  description: "左右对比表，json_object 格式。",
  bodyFormat: "json_object",
  examples: [`:::comparison-table\n{"left":{"title":"方案A","items":["免费","基础功能"]},"right":{"title":"方案B","items":["$99/月","完整功能"]}}\n:::`],
  since: "1.0.0"
};

export const comparisonTableRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const data = module.body.json as { left?: { title?: string; items?: string[] }; right?: { title?: string; items?: string[] } } | undefined;
  if (!data) return "";
  let html = `<section style="margin:0 0 16px;"><div style="display:flex;gap:12px;">`;
  const sides = [
    { data: data.left, color: "#3b82f6", bg: "#eff6ff" },
    { data: data.right, color: "#8b5cf6", bg: "#f5f3ff" }
  ];
  for (const side of sides) {
    if (!side.data) continue;
    html += `<div style="flex:1;background:${side.bg};border-radius:8px;padding:16px;">`;
    if (side.data.title) html += `<p style="margin:0 0 10px;font-size:15px;font-weight:700;color:${side.color};">${ctx.escapeHtml(side.data.title)}</p>`;
    if (side.data.items) {
      for (const item of side.data.items) {
        html += `<p style="margin:0 0 6px;font-size:13px;color:#475569;">&#10003; ${ctx.renderInline(item)}</p>`;
      }
    }
    html += `</div>`;
  }
  html += `</div></section>`;
  return html;
};
