import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const verdictDef: LayoutModuleDef = {
  id: "verdict", category: "judgment", label: "结论",
  description: "文章核心结论，含小标签、主标题和可选正文。",
  bodyFormat: "fields",
  fields: [{ name: "eyebrow", required: true }, { name: "title", required: true }, { name: "body", required: false }, { name: "note", required: false }],
  examples: [`:::verdict\neyebrow: 结论\ntitle: 值得尝试\n:::`], since: "1.0.0"
};

export const verdictRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const f = module.body.fields || [];
  const eyebrow = getField(f, "eyebrow") || "";
  const title = getField(f, "title") || "";
  const body = getField(f, "body");
  const note = getField(f, "note");
  let html = `<section style="background:#0f172a;border-radius:12px;padding:28px 24px;margin:0 0 16px;text-align:center;">`;
  if (eyebrow) html += `<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;font-weight:600;">${ctx.escapeHtml(eyebrow)}</p>`;
  html += `<p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#f8fafc;line-height:1.4;">${ctx.renderInline(title)}</p>`;
  if (body) html += `<p style="margin:0 0 8px;font-size:15px;color:#cbd5e1;line-height:1.7;">${ctx.renderInline(body)}</p>`;
  if (note) html += `<p style="margin:0;font-size:13px;color:#64748b;">${ctx.renderInline(note)}</p>`;
  html += `</section>`;
  return html;
};
