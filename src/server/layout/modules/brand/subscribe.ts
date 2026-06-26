import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const subscribeDef: LayoutModuleDef = {
  id: "subscribe", category: "brand", label: "订阅引导",
  description: "订阅号引导块，含标题和可选正文。",
  bodyFormat: "fields",
  fields: [{ name: "title", required: true }, { name: "body", required: false }],
  examples: [`:::subscribe\ntitle: 关注获取更多内容\nbody: 每周更新，不错过每篇好文\n:::`], since: "1.0.0"
};

export const subscribeRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const f = module.body.fields || [];
  const title = getField(f, "title") || "";
  const body = getField(f, "body");
  let html = `<section style="background:#fffbeb;border:1px dashed #f59e0b;border-radius:12px;padding:24px;text-align:center;margin:0 0 16px;">`;
  html += `<p style="margin:0 0 6px;font-size:13px;color:#d97706;font-weight:600;">&#9889; 订阅</p>`;
  if (title) html += `<p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#92400e;">${ctx.renderInline(title)}</p>`;
  if (body) html += `<p style="margin:0;font-size:14px;color:#b45309;line-height:1.6;">${ctx.renderInline(body)}</p>`;
  html += `</section>`;
  return html;
};
