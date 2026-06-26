/**
 * image-link 模块：图片链接卡片
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const imageLinkDef: LayoutModuleDef = {
  id: "image-link",
  category: "sprint4",
  label: "图片链接卡片",
  description: "可点击的图片卡片，含图片、标题、描述、链接，适合资源推荐和跳转引导。",
  bodyFormat: "fields",
  hasTitle: false,
  examples: [`:::image-link\n图片: https://example.com/cover.png\n标题: 推荐工具\n描述: 一款高效的公众号排版工具\n链接: https://example.com\n:::`],
  since: "1.1.0"
};

export const imageLinkRender: ModuleRenderer = (mod: ParsedModule, ctx: RenderContext): string => {
  const fields = mod.body.fields;
  const image = getField(fields, "图片") || getField(fields, "image") || "";
  const title = getField(fields, "标题") || getField(fields, "title") || mod.title || "";
  const desc = getField(fields, "描述") || getField(fields, "description") || "";
  const link = getField(fields, "链接") || getField(fields, "link") || "";
  const c = ctx.theme.tokens?.colors || {} as any;

  const wrapStyle = ` style="display:block;margin:16px 0;border-radius:12px;overflow:hidden;border:1px solid ${c.border};background:${c.surface};text-decoration:none;color:inherit;"`;
  const imgStyle = ` style="display:block;width:100%;height:auto;"`;
  const bodyStyle = ` style="padding:12px 16px;"`;
  const titleStyle = ` style="margin:0 0 4px;font-size:15px;font-weight:600;color:${c.primary};"`;
  const descStyle = ` style="margin:0;font-size:13px;color:${c.muted};"`;

  let html = link ? `<a href="${ctx.escapeAttr(link)}"${wrapStyle}>` : `<section${wrapStyle}>`;
  if (image) html += `<img src="${ctx.escapeAttr(image)}"${imgStyle} alt="${ctx.escapeAttr(title)}" />`;
  if (title || desc) {
    html += `<div${bodyStyle}>`;
    if (title) html += `<p${titleStyle}>${ctx.escapeHtml(title)}</p>`;
    if (desc) html += `<p${descStyle}>${ctx.renderInline(desc)}</p>`;
    html += `</div>`;
  }
  html += link ? `</a>` : `</section>`;
  return html;
};
