/**
 * checklist 模块 - 清单
 *
 * :::checklist
 * 描述 | 状态
 * 完成需求分析 | done
 * 编写技术方案 | done
 * 上线发布 | todo
 * :::
 *
 * 状态：done / todo / na
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

const STATUS_ICONS: Record<string, string> = {
  done: "&#10003;",
  todo: "&#9633;",
  na: "&#8211;"
};

const STATUS_COLORS: Record<string, string> = {
  done: "#22c55e",
  todo: "#94a3b8",
  na: "#cbd5e1"
};

export const checklistDef: LayoutModuleDef = {
  id: "checklist",
  category: "conversion",
  label: "清单",
  description: "待办清单，支持 done/todo/na 三种状态标记。",
  bodyFormat: "rows",
  hasTitle: true,
  columns: ["描述", "状态"],
  examples: [
    `:::checklist
发布前检查
完成需求分析 | done
编写技术方案 | done
上线发布 | todo
:::`
  ],
  since: "1.0.0"
};

export const checklistRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];

  const wrapStyle = ctx.moduleStyle("checklist", "wrap") ||
    ` style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin:0 0 16px;"`;
  const titleStyle = ctx.moduleStyle("checklist", "title") ||
    ` style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;"`;
  const itemStyle = ctx.moduleStyle("checklist", "item") ||
    ` style="display:flex;align-items:center;padding:6px 0;font-size:14px;"`;
  const descStyle = ctx.moduleStyle("checklist", "desc") ||
    ` style="color:#475569;"`;

  let html = `<section${wrapStyle}>`;
  if (title) html += `<p${titleStyle}>${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [desc, status] = row.cells;
    const st = (status || "todo").toLowerCase().trim();
    const icon = STATUS_ICONS[st] || STATUS_ICONS.todo;
    const color = STATUS_COLORS[st] || STATUS_COLORS.todo;
    // icon 样式直接内联（含动态颜色，不使用 moduleStyle 回退）
    const iconStyle = ` style="flex-shrink:0;width:20px;height:20px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px;margin-right:10px;background:${color}22;color:${color};"`;
    html += `<div${itemStyle}>`;
    html += `<span${iconStyle}>${icon}</span>`;
    html += `<span${descStyle}>${ctx.renderInline(desc || "")}</span>`;
    html += `</div>`;
  }
  html += `</section>`;

  return html;
};
