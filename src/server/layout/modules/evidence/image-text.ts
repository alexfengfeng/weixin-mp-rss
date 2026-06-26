import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const imageTextDef: LayoutModuleDef = {
  id: "image-text", category: "evidence", label: "图文卡片",
  description: "图片+标题+正文卡片。",
  bodyFormat: "fields",
  fields: [{ name: "src", required: true }, { name: "title", required: true }, { name: "body", required: false }],
  examples: [`:::image-text\nsrc: /img/a.png\ntitle: 产品截图\nbody: 这是主界面\n:::`], since: "1.0.0"
};

export const imageTextRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const f = module.body.fields || [];
  const src = getField(f, "src") || "";
  const title = getField(f, "title") || "";
  const body = getField(f, "body");
  let html = `<section style="background:#f8fafc;border-radius:8px;padding:16px;margin:0 0 16px;">`;
  if (src) html += `<p style="margin:0 0 10px;"><img style="max-width:100%;border-radius:6px;" src="${ctx.escapeAttr(src)}" alt="${ctx.escapeAttr(title)}" /></p>`;
  if (title) html += `<p style="margin:0 0 6px;font-size:15px;font-weight:600;color:#1e293b;">${ctx.renderInline(title)}</p>`;
  if (body) html += `<p style="margin:0;font-size:14px;color:#64748b;line-height:1.7;">${ctx.renderInline(body)}</p>`;
  html += `</section>`;
  return html;
};
