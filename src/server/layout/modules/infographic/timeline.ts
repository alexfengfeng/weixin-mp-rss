/**
 * timeline 模块 - 时间线
 * :::timeline
 * 时间点 | 事件标题 | 事件说明
 * 2024-01 | 项目启动 | 正式立项
 * 2024-06 | 首版发布 | MVP 上线
 * :::
 */
import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const timelineDef: LayoutModuleDef = {
  id: "timeline", category: "infographic", label: "时间线",
  description: "时间线展示，时间点+事件标题+说明。",
  bodyFormat: "rows", hasTitle: true, columns: ["时间点", "事件标题", "事件说明"],
  examples: [`:::timeline\n2024-01 | 项目启动 | 正式立项\n:::`], since: "1.0.0"
};

export const timelineRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];
  let html = `<section style="margin:0 0 16px;">`;
  if (title) html += `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;">${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [time, eventTitle, desc] = row.cells;
    html += `<div style="display:flex;align-items:flex-start;padding:8px 0;">`;
    html += `<div style="flex-shrink:0;width:80px;font-size:13px;font-weight:700;color:#6366f1;">${ctx.escapeHtml(time || "")}</div>`;
    html += `<div style="position:relative;padding-left:16px;flex:1;">`;
    html += `<div style="position:absolute;left:0;top:6px;width:8px;height:8px;border-radius:50%;background:#6366f1;"></div>`;
    if (eventTitle) html += `<p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#1e293b;">${ctx.renderInline(eventTitle)}</p>`;
    if (desc) html += `<p style="margin:0;font-size:13px;color:#94a3b8;">${ctx.renderInline(desc)}</p>`;
    html += `</div></div>`;
  }
  html += `</section>`;
  return html;
};
