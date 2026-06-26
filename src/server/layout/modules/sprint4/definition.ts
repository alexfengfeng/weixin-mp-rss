import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const definitionDef: LayoutModuleDef = {
  id: "definition", category: "sprint4", label: "术语定义",
  description: "术语定义卡片，json_object 格式。",
  bodyFormat: "json_object",
  examples: [`:::definition\n{"term":"RAG","def":"检索增强生成","termLabel":"检索增强生成"}\n:::`],
  since: "1.0.0"
};

export const definitionRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const data = module.body.json as { term?: string; def?: string; termLabel?: string } | undefined;
  if (!data) return "";
  let html = `<section style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin:0 0 16px;border-left:4px solid #6366f1;">`;
  if (data.term) html += `<p style="margin:0 0 6px;font-size:18px;font-weight:800;color:#4f46e5;">${ctx.escapeHtml(data.term)}</p>`;
  if (data.termLabel) html += `<p style="margin:0 0 8px;font-size:13px;color:#818cf8;">${ctx.escapeHtml(data.termLabel)}</p>`;
  if (data.def) html += `<p style="margin:0;font-size:14px;color:#475569;line-height:1.7;">${ctx.renderInline(data.def)}</p>`;
  html += `</section>`;
  return html;
};
