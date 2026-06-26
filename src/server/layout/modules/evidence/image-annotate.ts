import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField, getFieldAll } from "@/server/layout/parser/body-fields";

export const imageAnnotateDef: LayoutModuleDef = {
  id: "image-annotate", category: "evidence", label: "图片标注",
  description: "带标注点的图片，src+title+多个point。",
  bodyFormat: "fields",
  fields: [{ name: "src", required: true }, { name: "title", required: true }, { name: "point", required: false }, { name: "note", required: false }],
  examples: [`:::image-annotate\nsrc: /img/a.png\ntitle: 架构图\npoint: 1 | 50 | 30 | 前端 | 用户入口\n:::`], since: "1.0.0"
};

export const imageAnnotateRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const f = module.body.fields || [];
  const src = getField(f, "src") || "";
  const title = getField(f, "title") || "";
  const note = getField(f, "note");
  const points = getFieldAll(f, "point");
  let html = `<section style="margin:0 0 16px;">`;
  if (src) html += `<p style="margin:0 0 8px;"><img style="max-width:100%;border-radius:8px;" src="${ctx.escapeAttr(src)}" alt="${ctx.escapeAttr(title)}" /></p>`;
  if (title) html += `<p style="margin:0 0 6px;font-size:14px;font-weight:600;color:#1e293b;">${ctx.renderInline(title)}</p>`;
  for (const p of points) {
    const parts = p.split("|").map((s) => s.trim());
    html += `<p style="margin:0 0 4px;font-size:13px;color:#64748b;">&#9656; ${ctx.renderInline(parts[3] || "")}: ${ctx.renderInline(parts[4] || "")}</p>`;
  }
  if (note) html += `<p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">${ctx.renderInline(note)}</p>`;
  html += `</section>`;
  return html;
};
