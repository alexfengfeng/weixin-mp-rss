import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const peopleDef: LayoutModuleDef = {
  id: "people", category: "brand", label: "人物列表",
  description: "人物列表，姓名+职位+简介。",
  bodyFormat: "rows", hasTitle: true, columns: ["姓名", "职位", "简介"],
  examples: [`:::people\n团队成员\n张三 | CEO | 负责产品方向\n李四 | CTO | 负责技术架构\n:::`], since: "1.0.0"
};

export const peopleRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];
  let html = `<section style="margin:0 0 16px;">`;
  if (title) html += `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;">${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [name, role, bio] = row.cells;
    html += `<div style="display:flex;align-items:flex-start;padding:10px 0;border-bottom:1px solid #f1f5f9;">`;
    html += `<div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:#e0e7ff;color:#4f46e5;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;margin-right:12px;">${ctx.escapeHtml((name || "?").charAt(0))}</div>`;
    html += `<div>`;
    if (name) html += `<span style="font-size:14px;font-weight:600;color:#1e293b;">${ctx.renderInline(name)}</span>`;
    if (role) html += `<span style="font-size:13px;color:#6366f1;margin-left:8px;">${ctx.renderInline(role)}</span>`;
    if (bio) html += `<p style="margin:2px 0 0;font-size:13px;color:#94a3b8;">${ctx.renderInline(bio)}</p>`;
    html += `</div></div>`;
  }
  html += `</section>`;
  return html;
};
