import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const quoteCardDef: LayoutModuleDef = {
  id: "quote-card", category: "sprint4", label: "引用卡片",
  description: "精美引用卡片，json_object 格式。",
  bodyFormat: "json_object",
  examples: [`:::quote-card\n{"text":"简单不是少，而是刚刚好。","source":"《设计心理学》"}\n:::`],
  since: "1.0.0"
};

export const quoteCardRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const data = module.body.json as { text?: string; source?: string } | undefined;
  if (!data) return "";
  let html = `<section style="background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%);border-radius:12px;padding:28px 24px;margin:0 0 16px;">`;
  html += `<p style="margin:0 0 10px;font-size:36px;color:#a78bfa;line-height:1;">&ldquo;</p>`;
  if (data.text) html += `<p style="margin:0 0 12px;font-size:17px;color:#5b21b6;line-height:1.8;font-style:italic;">${ctx.renderInline(data.text)}</p>`;
  if (data.source) html += `<p style="margin:0;font-size:14px;color:#7c3aed;text-align:right;">&mdash; ${ctx.escapeHtml(data.source)}</p>`;
  html += `</section>`;
  return html;
};
