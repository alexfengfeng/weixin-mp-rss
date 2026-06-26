/**
 * reading-time 模块：阅读时间提示
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const readingTimeDef: LayoutModuleDef = {
  id: "reading-time",
  category: "sprint4",
  label: "阅读时间",
  description: "显示预计阅读时间和字数，放在文章开头提升阅读预期管理。",
  bodyFormat: "fields",
  hasTitle: false,
  examples: [`:::reading-time\n字数: 2500\n分钟: 7\n:::`, `:::reading-time\n字数: 1800\n:::`],
  since: "1.1.0"
};

export const readingTimeRender: ModuleRenderer = (mod: ParsedModule, ctx: RenderContext): string => {
  const fields = mod.body.fields;
  const wordCount = parseInt(getField(fields, "字数") || getField(fields, "words") || "0", 10);
  const readTime = parseInt(getField(fields, "分钟") || getField(fields, "minutes") || "0", 10);
  const label = getField(fields, "标签") || getField(fields, "label") || "阅读时间";
  const c = ctx.theme.tokens?.colors || {} as any;

  const actualTime = readTime || (wordCount > 0 ? Math.ceil(wordCount / 400) : 3);
  const actualWords = wordCount || actualTime * 400;

  const wrapStyle = ` style="margin:12px 0;padding:10px 16px;background:${c.surface};border-radius:8px;display:flex;align-items:center;gap:12px;"`;
  const iconStyle = ` style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:${c.accent}18;display:flex;align-items:center;justify-content:center;font-size:16px;"`;
  const textStyle = ` style="font-size:13px;color:${c.muted};"`;
  const highlightStyle = ` style="color:${c.primary};font-weight:600;"`;

  return `<section${wrapStyle}>` +
    `<span${iconStyle}>⏱</span>` +
    `<span${textStyle}>${ctx.escapeHtml(label)}：约 <strong${highlightStyle}>${actualWords}</strong> 字 · 预计 <strong${highlightStyle}>${actualTime}</strong> 分钟</span>` +
    `</section>`;
};
