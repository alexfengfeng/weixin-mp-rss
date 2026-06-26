import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const imageStepsDef: LayoutModuleDef = {
  id: "image-steps", category: "evidence", label: "图文步骤",
  description: "图文步骤列表，步骤序号+说明+图片URL。",
  bodyFormat: "rows", hasTitle: true, columns: ["步骤序号", "步骤说明", "图片URL"],
  examples: [`:::image-steps\n1 | 打开设置 | /img/step1.png\n2 | 点击保存 | /img/step2.png\n:::`], since: "1.0.0"
};

export const imageStepsRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const title = module.body.title;
  const rows = module.body.rows || [];
  let html = `<section style="margin:0 0 16px;">`;
  if (title) html += `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1e293b;">${ctx.escapeHtml(title)}</p>`;
  for (const row of rows) {
    const [num, desc, img] = row.cells;
    html += `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9;">`;
    html += `<span style="flex-shrink:0;width:24px;height:24px;border-radius:50%;background:#3b82f6;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;">${ctx.escapeHtml(num || "")}</span>`;
    html += `<span style="flex:1;font-size:14px;color:#475569;">${ctx.renderInline(desc || "")}</span>`;
    if (img) html += `<img style="max-width:80px;border-radius:6px;" src="${ctx.escapeAttr(img)}" />`;
    html += `</div>`;
  }
  html += `</section>`;
  return html;
};
