/**
 * quote 模块 - 引用卡片
 *
 * :::quote
 * 这是一段引用内容，可以多行。
 * 来源 | 作者名
 * :::
 *
 * body 为混合格式：正文部分为引用内容，末行若为 "来源 | 作者" 则作为出处。
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const quoteDef: LayoutModuleDef = {
  id: "quote",
  category: "evidence",
  label: "引用卡片",
  description: "突出展示引用内容，可选附注来源和作者。",
  bodyFormat: "text",
  examples: [
    `:::quote
简单不是少，而是刚刚好。
《设计心理学》 | 唐纳德·诺曼
:::`
  ],
  since: "1.0.0"
};

export const quoteRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const text = module.body.text || "";
  const lines = text.split("\n").filter((l) => l.trim());

  let source: string | undefined;
  let author: string | undefined;
  let quoteLines = lines;

  // 末行若为 "来源 | 作者" 格式，则提取出处
  const lastLine = lines[lines.length - 1];
  if (lastLine && lastLine.includes("|") && !lastLine.match(/^>/)) {
    const parts = lastLine.split("|").map((s) => s.trim());
    if (parts.length === 2 && parts[0] && parts[1]) {
      source = parts[0];
      author = parts[1];
      quoteLines = lines.slice(0, -1);
    }
  }

  const wrapStyle = ctx.moduleStyle("quote", "wrap") ||
    ` style="background:#fafafa;border-left:4px solid #d1d5db;border-radius:0 8px 8px 0;padding:20px 24px;margin:0 0 16px;"`;
  const textStyle = ctx.moduleStyle("quote", "text") ||
    ` style="margin:0 0 8px;font-size:16px;color:#374151;line-height:1.8;font-style:italic;"`;
  const sourceStyle = ctx.moduleStyle("quote", "source") ||
    ` style="font-size:13px;color:#9ca3af;text-align:right;"`;

  const quoteText = quoteLines.join("<br />");
  let html = `<section${wrapStyle}>`;
  html += `<p${textStyle}>${ctx.renderInline(quoteText)}</p>`;
  if (source || author) {
    const sourceText = [source, author].filter(Boolean).join(" · ");
    html += `<p${sourceStyle}>${ctx.escapeHtml(sourceText)}</p>`;
  }
  html += `</section>`;

  return html;
};
