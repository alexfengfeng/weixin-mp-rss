import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const seriesDef: LayoutModuleDef = {
  id: "series", category: "brand", label: "系列标识",
  description: "系列文章标识，含系列名和期号。",
  bodyFormat: "fields",
  fields: [{ name: "name", required: true }, { name: "episode", required: true }, { name: "topic", required: false }],
  examples: [`:::series\nname: 产品手记\nepisode: 第 5 期\ntopic: 用户增长\n:::`], since: "1.0.0"
};

export const seriesRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const f = module.body.fields || [];
  const name = getField(f, "name") || "";
  const episode = getField(f, "episode") || "";
  const topic = getField(f, "topic");
  let html = `<section style="display:flex;align-items:center;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);border-radius:8px;padding:12px 16px;margin:0 0 16px;">`;
  html += `<span style="flex-shrink:0;background:#0284c7;color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:4px;margin-right:12px;">${ctx.escapeHtml(episode)}</span>`;
  html += `<div>`;
  if (name) html += `<span style="font-size:15px;font-weight:600;color:#0c4a6e;">${ctx.renderInline(name)}</span>`;
  if (topic) html += `<span style="font-size:13px;color:#0369a1;margin-left:8px;">| ${ctx.renderInline(topic)}</span>`;
  html += `</div></section>`;
  return html;
};
