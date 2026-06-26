/**
 * hero 模块 - 封面头图
 *
 * :::hero
 * eyebrow: 深度观察
 * title: AI 时代的公众号写作
 * subtitle: 为什么读者愿意继续读下去
 * cta_text: 阅读全文
 * :::
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const heroDef: LayoutModuleDef = {
  id: "hero",
  category: "opening",
  label: "封面头图",
  description: "文章开场的注意力抓取块，含小标签、大标题、副标题和可选行动号召。",
  bodyFormat: "fields",
  fields: [
    { name: "eyebrow", required: true, description: "小标签（眉题）" },
    { name: "title", required: true, description: "主标题" },
    { name: "subtitle", required: false, description: "副标题" },
    { name: "cta_text", required: false, description: "行动号召文本" }
  ],
  examples: [
    `:::hero
eyebrow: 深度观察
title: AI 时代的公众号写作
subtitle: 为什么读者愿意继续读下去
:::`
  ],
  since: "1.0.0"
};

export const heroRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const fields = module.body.fields;
  const eyebrow = getField(fields, "eyebrow") || "";
  const title = getField(fields, "title") || "";
  const subtitle = getField(fields, "subtitle");
  const ctaText = getField(fields, "cta_text");

  const wrapStyle = ctx.moduleStyle("hero", "wrap") ||
    ` style="background:linear-gradient(135deg,#f8fafc 0%,#eef2ff 100%);border-radius:12px;padding:32px 24px;margin:0 0 24px;text-align:center;"`;
  const eyebrowStyle = ctx.moduleStyle("hero", "eyebrow") ||
    ` style="display:inline-block;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#6366f1;font-weight:600;margin:0 0 8px;"`;
  const titleStyle = ctx.moduleStyle("hero", "title") ||
    ` style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0f172a;line-height:1.35;"`;
  const subtitleStyle = ctx.moduleStyle("hero", "subtitle") ||
    ` style="margin:0 0 16px;font-size:15px;color:#64748b;line-height:1.7;"`;
  const ctaStyle = ctx.moduleStyle("hero", "cta") ||
    ` style="display:inline-block;font-size:14px;font-weight:600;color:#4f46e5;border:1px solid #c7d2fe;border-radius:6px;padding:6px 16px;"`;

  let html = `<section${wrapStyle}>`;
  if (eyebrow) html += `<span${eyebrowStyle}>${ctx.escapeHtml(eyebrow)}</span>`;
  html += `<h2${titleStyle}>${ctx.renderInline(title)}</h2>`;
  if (subtitle) html += `<p${subtitleStyle}>${ctx.renderInline(subtitle)}</p>`;
  if (ctaText) html += `<span${ctaStyle}>${ctx.escapeHtml(ctaText)}</span>`;
  html += `</section>`;

  return html;
};
