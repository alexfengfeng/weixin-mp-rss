/**
 * progress-bar 模块：进度条
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const progressBarDef: LayoutModuleDef = {
  id: "progress-bar",
  category: "sprint4",
  label: "进度条",
  description: "可视化展示进度、完成度、比例等数据，适合项目进度和目标达成展示。",
  bodyFormat: "fields",
  hasTitle: false,
  examples: [`:::progress-bar\n标签: 项目完成度\n值: 75\n最大值: 100\n单位: %\n:::`, `:::progress-bar\n标签: 年度目标\n值: 38\n最大值: 50\n单位: 万\n:::`],
  since: "1.1.0"
};

export const progressBarRender: ModuleRenderer = (mod: ParsedModule, ctx: RenderContext): string => {
  const fields = mod.body.fields;
  const label = getField(fields, "标签") || getField(fields, "label") || "";
  const value = parseInt(getField(fields, "值") || getField(fields, "value") || "0", 10);
  const max = parseInt(getField(fields, "最大值") || getField(fields, "max") || "100", 10);
  const unit = getField(fields, "单位") || getField(fields, "unit") || "%";
  const c = ctx.theme.tokens?.colors || {} as any;

  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  const wrapStyle = ` style="margin:12px 0;"`;
  const labelStyle = ` style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;color:${c.text};"`;
  const trackStyle = ` style="width:100%;height:8px;background:${c.surface};border-radius:4px;overflow:hidden;"`;
  const barStyle = ` style="height:100%;width:${percent}%;background:${c.accent};border-radius:4px;"`;

  let html = `<section${wrapStyle}>`;
  if (label) {
    html += `<div${labelStyle}><span>${ctx.escapeHtml(label)}</span><span>${value}${unit}</span></div>`;
  }
  html += `<div${trackStyle}><div${barStyle}></div></div>`;
  html += `</section>`;
  return html;
};
