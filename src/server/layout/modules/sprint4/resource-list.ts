import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const resourceListDef: LayoutModuleDef = {
  id: "resource-list", category: "sprint4", label: "资源列表",
  description: "资源链接列表，json_array 格式。",
  bodyFormat: "json_array",
  examples: [`:::resource-list\n[{"icon":"&#128279;","name":"官网","url":"https://example.com","desc":"了解详情"}]\n:::`],
  since: "1.0.0"
};

export const resourceListRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const data = module.body.json as Array<{ icon?: string; name?: string; url?: string; desc?: string }> | undefined;
  if (!Array.isArray(data)) return "";
  let html = `<section style="margin:0 0 16px;">`;
  for (const item of data) {
    html += `<div style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;">`;
    if (item.icon) html += `<span style="flex-shrink:0;margin-right:10px;font-size:18px;">${item.icon}</span>`;
    html += `<div style="flex:1;">`;
    if (item.name) {
      if (item.url) html += `<a style="font-size:14px;font-weight:600;color:#2563eb;text-decoration:none;" href="${ctx.escapeAttr(item.url)}">${ctx.renderInline(item.name)}</a>`;
      else html += `<span style="font-size:14px;font-weight:600;color:#1e293b;">${ctx.renderInline(item.name)}</span>`;
    }
    if (item.desc) html += `<p style="margin:0;font-size:13px;color:#94a3b8;">${ctx.renderInline(item.desc)}</p>`;
    html += `</div></div>`;
  }
  html += `</section>`;
  return html;
};
