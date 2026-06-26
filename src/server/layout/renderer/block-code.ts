/**
 * 代码块渲染
 *
 * 支持 ``` 围栏代码块。
 * 识别逻辑在 renderer/index.ts 中完成，此文件只负责渲染。
 */

import type { RenderContext } from "@/server/layout/types";

/** 渲染代码块 */
export function renderCodeBlock(content: string, lang: string, ctx: RenderContext): string {
  const escaped = ctx.escapeHtml(content);
  const langAttr = lang ? ` data-lang="${ctx.escapeAttr(lang)}"` : "";
  return `<pre${ctx.style("pre")}><code${ctx.style("code")}${langAttr}>${escaped}</code></pre>`;
}

/** 判断行是否为代码围栏起始 */
export function isCodeFenceStart(line: string): boolean {
  return /^\s{0,3}(```|~~~)/.test(line);
}

/** 提取代码围栏的语言标识 */
export function extractCodeFenceLang(line: string): string {
  const match = line.match(/^\s{0,3}(```|~~~)\s*(.*)$/);
  return match?.[2]?.trim() || "";
}

/** 判断行是否为代码围 fence 结束（匹配任意 ``` 或 ~~~） */
export function isCodeFenceEnd(line: string): boolean {
  return /^\s{0,3}(```|~~~)\s*$/.test(line);
}
