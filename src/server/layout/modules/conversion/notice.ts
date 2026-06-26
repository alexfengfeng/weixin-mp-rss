/**
 * notice 模块 - 通知
 *
 * :::notice
 * title: 系统维护通知
 * body: 系统将于今晚 22:00-23:00 进行维护升级，期间服务暂停。
 * :::
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const noticeDef: LayoutModuleDef = {
  id: "notice",
  category: "conversion",
  label: "通知",
  description: "醒目通知块，含标题和正文，适合公告和提醒。",
  bodyFormat: "fields",
  fields: [
    { name: "title", required: true, description: "通知标题" },
    { name: "body", required: false, description: "通知正文" }
  ],
  examples: [
    `:::notice
title: 系统维护通知
body: 系统将于今晚 22:00-23:00 进行维护升级，期间服务暂停。
:::`
  ],
  since: "1.0.0"
};

export const noticeRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const fields = module.body.fields;
  const title = getField(fields, "title") || "";
  const body = getField(fields, "body");

  const wrapStyle = ctx.moduleStyle("notice", "wrap") ||
    ` style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin:0 0 16px;"`;
  const titleStyle = ctx.moduleStyle("notice", "title") ||
    ` style="margin:0 0 8px;font-size:16px;font-weight:700;color:#991b1b;"`;
  const bodyStyle = ctx.moduleStyle("notice", "body") ||
    ` style="margin:0;font-size:14px;color:#7f1d1d;line-height:1.7;"`;

  let html = `<section${wrapStyle}>`;
  html += `<p${titleStyle}>${ctx.renderInline(title)}</p>`;
  if (body) html += `<p${bodyStyle}>${ctx.renderInline(body)}</p>`;
  html += `</section>`;

  return html;
};
