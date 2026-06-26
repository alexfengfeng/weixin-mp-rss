/**
 * cta 模块 - 行动号召
 *
 * :::cta
 * title: 开始你的第一次创作
 * note: 点击下方按钮，立即体验
 * :::
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const ctaDef: LayoutModuleDef = {
  id: "cta",
  category: "conversion",
  label: "行动号召",
  description: "引导读者采取行动的块，含标题和可选备注。",
  bodyFormat: "fields",
  fields: [
    { name: "title", required: true, description: "号召标题" },
    { name: "note", required: false, description: "备注说明" }
  ],
  examples: [
    `:::cta
title: 开始你的第一次创作
note: 点击下方按钮，立即体验
:::`
  ],
  since: "1.0.0"
};

export const ctaRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const fields = module.body.fields;
  const title = getField(fields, "title") || "";
  const note = getField(fields, "note");

  const wrapStyle = ctx.moduleStyle("cta", "wrap") ||
    ` style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);border-radius:12px;padding:28px 24px;margin:0 0 16px;text-align:center;"`;
  const titleStyle = ctx.moduleStyle("cta", "title") ||
    ` style="margin:0 0 8px;font-size:20px;font-weight:800;color:#ffffff;line-height:1.4;"`;
  const noteStyle = ctx.moduleStyle("cta", "note") ||
    ` style="margin:0;font-size:14px;color:#e0e7ff;line-height:1.6;"`;

  let html = `<section${wrapStyle}>`;
  html += `<p${titleStyle}>${ctx.renderInline(title)}</p>`;
  if (note) html += `<p${noteStyle}>${ctx.renderInline(note)}</p>`;
  html += `</section>`;

  return html;
};
