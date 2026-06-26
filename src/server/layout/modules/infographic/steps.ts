/**
 * steps 模块 - 步骤列表
 *
 * :::steps
 * 序号 | 步骤名 | 步骤说明
 * 1 | 准备环境 | 安装 Node.js 和依赖
 * 2 | 编写代码 | 创建项目结构
 * 3 | 运行测试 | 验证功能正常
 * :::
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const stepsDef: LayoutModuleDef = {
  id: "steps",
  category: "infographic",
  label: "步骤列表",
  description: "有序步骤展示，序号 + 步骤名 + 说明，适合教程和操作指南。",
  bodyFormat: "rows",
  hasTitle: true,
  columns: ["序号", "步骤名", "步骤说明"],
  examples: [
    `:::steps
序号 | 步骤名 | 步骤说明
1 | 准备环境 | 安装 Node.js 和依赖
2 | 编写代码 | 创建项目结构
:::`
  ],
  since: "1.0.0"
};

export const stepsRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];

  const wrapStyle = ctx.moduleStyle("steps", "wrap") ||
    ` style="margin:0 0 16px;"`;
  const titleStyle = ctx.moduleStyle("steps", "title") ||
    ` style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;"`;
  const itemStyle = ctx.moduleStyle("steps", "item") ||
    ` style="display:flex;align-items:flex-start;padding:10px 0;border-bottom:1px solid #f1f5f9;"`;
  const numStyle = ctx.moduleStyle("steps", "num") ||
    ` style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:#3b82f6;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-right:14px;margin-top:2px;"`;
  const nameStyle = ctx.moduleStyle("steps", "name") ||
    ` style="font-weight:600;color:#1e293b;margin-right:8px;white-space:nowrap;"`;
  const descStyle = ctx.moduleStyle("steps", "desc") ||
    ` style="color:#64748b;font-size:14px;line-height:1.6;"`;

  let html = `<section${wrapStyle}>`;
  if (title) html += `<p${titleStyle}>${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [num, name, desc] = row.cells;
    html += `<div${itemStyle}>`;
    if (num) html += `<span${numStyle}>${ctx.escapeHtml(num)}</span>`;
    html += `<div>`;
    if (name) html += `<span${nameStyle}>${ctx.renderInline(name)}</span>`;
    if (desc) html += `<span${descStyle}>${ctx.renderInline(desc)}</span>`;
    html += `</div></div>`;
  }
  html += `</section>`;

  return html;
};
