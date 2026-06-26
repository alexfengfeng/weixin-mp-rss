import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const questionDef: LayoutModuleDef = {
  id: "question", category: "sprint4", label: "问答对",
  description: "问答对列表，json_array 格式。",
  bodyFormat: "json_array",
  examples: [`:::question\n[{"q":"如何开始？","a":"点击注册即可"},{"q":"支持什么格式？","a":"Markdown"}]\n:::`],
  since: "1.0.0"
};

export const questionRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const data = module.body.json as Array<{ q?: string; a?: string }> | undefined;
  if (!Array.isArray(data)) return "";
  let html = `<section style="margin:0 0 16px;">`;
  for (const item of data) {
    html += `<div style="padding:12px 0;border-bottom:1px solid #f1f5f9;">`;
    if (item.q) html += `<p style="margin:0 0 6px;font-size:15px;font-weight:600;color:#1e293b;">Q: ${ctx.renderInline(item.q)}</p>`;
    if (item.a) html += `<p style="margin:0;font-size:14px;color:#64748b;line-height:1.7;">A: ${ctx.renderInline(item.a)}</p>`;
    html += `</div>`;
  }
  html += `</section>`;
  return html;
};
