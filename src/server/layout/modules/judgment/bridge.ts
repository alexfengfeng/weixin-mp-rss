import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const bridgeDef: LayoutModuleDef = {
  id: "bridge", category: "judgment", label: "过渡桥",
  description: "承上启下的过渡块，从A到B的引导。",
  bodyFormat: "fields",
  fields: [{ name: "from", required: true }, { name: "to", required: true }],
  examples: [`:::bridge\nfrom: 基础概念\nto: 实际应用\n:::`], since: "1.0.0"
};

export const bridgeRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const f = module.body.fields || [];
  const from = getField(f, "from") || "";
  const to = getField(f, "to") || "";
  let html = `<section style="text-align:center;margin:0 0 16px;padding:16px;">`;
  html += `<div style="display:inline-flex;align-items:center;gap:16px;background:#f8fafc;border-radius:12px;padding:12px 24px;">`;
  html += `<span style="font-size:15px;color:#64748b;">${ctx.renderInline(from)}</span>`;
  html += `<span style="color:#6366f1;font-size:20px;">&#8594;</span>`;
  html += `<span style="font-size:15px;font-weight:700;color:#6366f1;">${ctx.renderInline(to)}</span>`;
  html += `</div></section>`;
  return html;
};
