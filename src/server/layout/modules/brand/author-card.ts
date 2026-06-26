import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const authorCardDef: LayoutModuleDef = {
  id: "author-card", category: "brand", label: "作者卡片",
  description: "作者信息卡片，含头像、姓名、简介。",
  bodyFormat: "fields",
  fields: [{ name: "name", required: true }, { name: "bio", required: true }, { name: "avatar", required: false }],
  examples: [`:::author-card\nname: 张三\nbio: 产品设计师，专注用户体验\navatar: /img/avatar.png\n:::`], since: "1.0.0"
};

export const authorCardRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const f = module.body.fields || [];
  const name = getField(f, "name") || "";
  const bio = getField(f, "bio") || "";
  const avatar = getField(f, "avatar");
  let html = `<section style="display:flex;align-items:center;background:#f8fafc;border-radius:12px;padding:20px;margin:0 0 16px;">`;
  if (avatar) {
    html += `<img style="flex-shrink:0;width:56px;height:56px;border-radius:50%;margin-right:16px;" src="${ctx.escapeAttr(avatar)}" alt="${ctx.escapeAttr(name)}" />`;
  } else {
    html += `<div style="flex-shrink:0;width:56px;height:56px;border-radius:50%;background:#6366f1;color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;margin-right:16px;">${ctx.escapeHtml(name.charAt(0))}</div>`;
  }
  html += `<div>`;
  if (name) html += `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1e293b;">${ctx.renderInline(name)}</p>`;
  if (bio) html += `<p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">${ctx.renderInline(bio)}</p>`;
  html += `</div></section>`;
  return html;
};
