/**
 * label-title 模块 - 标签标题
 *
 * :::label-title
 * label: 推荐
 * title: 本周必读的三篇文章
 * :::
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const labelTitleDef: LayoutModuleDef = {
  id: "label-title",
  category: "opening",
  label: "标签标题",
  description: "带小标签的标题，适合推荐、精选、置顶等场景。",
  bodyFormat: "fields",
  fields: [
    { name: "label", required: true, description: "标签文本" },
    { name: "title", required: true, description: "标题" }
  ],
  examples: [`:::label-title\nlabel: 推荐\ntitle: 本周必读的三篇文章\n:::`],
  since: "1.0.0"
};

export const labelTitleRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const fields = module.body.fields;
  const label = getField(fields, "label") || "";
  const title = getField(fields, "title") || "";

  const wrapStyle = ctx.moduleStyle("label-title", "wrap") || ` style="margin:0 0 20px;"`;
  const labelStyle = ctx.moduleStyle("label-title", "label") || ` style="display:inline-block;background:#6366f1;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;margin:0 0 8px;"`;
  const titleStyle = ctx.moduleStyle("label-title", "title") || ` style="margin:0;font-size:22px;font-weight:800;color:#0f172a;line-height:1.4;"`;

  let html = `<section${wrapStyle}>`;
  if (label) html += `<span${labelStyle}>${ctx.escapeHtml(label)}</span>`;
  html += `<p${titleStyle}>${ctx.renderInline(title)}</p>`;
  html += `</section>`;
  return html;
};
