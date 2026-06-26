/**
 * part 模块 - 分隔标题
 *
 * :::part
 * eyebrow: 第一章
 * title: 基础概念
 * body: 本章介绍核心概念和术语
 * :::
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const partDef: LayoutModuleDef = {
  id: "part",
  category: "opening",
  label: "分隔标题",
  description: "章节分隔标题，含小标签、主标题和可选描述。",
  bodyFormat: "fields",
  fields: [
    { name: "eyebrow", required: true, description: "小标签（如第一章）" },
    { name: "title", required: true, description: "章节标题" },
    { name: "body", required: false, description: "章节描述" }
  ],
  examples: [`:::part\neyebrow: 第一章\ntitle: 基础概念\nbody: 本章介绍核心概念\n:::`],
  since: "1.0.0"
};

export const partRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const fields = module.body.fields;
  const eyebrow = getField(fields, "eyebrow") || "";
  const title = getField(fields, "title") || "";
  const body = getField(fields, "body");

  const wrapStyle = ctx.moduleStyle("part", "wrap") || ` style="margin:32px 0 20px;padding:20px 0;border-top:2px solid #e5e7eb;border-bottom:1px solid #f1f5f9;"`;
  const eyebrowStyle = ctx.moduleStyle("part", "eyebrow") || ` style="margin:0 0 6px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#6366f1;font-weight:600;"`;
  const titleStyle = ctx.moduleStyle("part", "title") || ` style="margin:0 0 6px;font-size:22px;font-weight:800;color:#0f172a;"`;
  const bodyStyle = ctx.moduleStyle("part", "body") || ` style="margin:0;font-size:14px;color:#64748b;line-height:1.7;"`;

  let html = `<section${wrapStyle}>`;
  if (eyebrow) html += `<p${eyebrowStyle}>${ctx.escapeHtml(eyebrow)}</p>`;
  html += `<p${titleStyle}>${ctx.renderInline(title)}</p>`;
  if (body) html += `<p${bodyStyle}>${ctx.renderInline(body)}</p>`;
  html += `</section>`;
  return html;
};
