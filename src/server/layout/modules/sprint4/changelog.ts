import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const changelogDef: LayoutModuleDef = {
  id: "changelog", category: "sprint4", label: "更新日志",
  description: "版本更新日志，json_object 格式。",
  bodyFormat: "json_object",
  examples: [`:::changelog\n{"version":"v2.0","date":"2024-06","added":["新增主题系统"],"changed":["优化性能"],"fixed":["修复渲染bug"]}\n:::`],
  since: "1.0.0"
};

export const changelogRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const data = module.body.json as { version?: string; date?: string; added?: string[]; changed?: string[]; fixed?: string[] } | undefined;
  if (!data) return "";
  let html = `<section style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin:0 0 16px;">`;
  html += `<div style="display:flex;align-items:center;margin:0 0 12px;">`;
  if (data.version) html += `<span style="background:#22c55e;color:#fff;font-size:13px;font-weight:700;padding:3px 10px;border-radius:4px;margin-right:10px;">${ctx.escapeHtml(data.version)}</span>`;
  if (data.date) html += `<span style="font-size:13px;color:#94a3b8;">${ctx.escapeHtml(data.date)}</span>`;
  html += `</div>`;
  const sections: Array<{ label: string; items?: string[]; color: string }> = [
    { label: "新增", items: data.added, color: "#22c55e" },
    { label: "变更", items: data.changed, color: "#f59e0b" },
    { label: "修复", items: data.fixed, color: "#3b82f6" }
  ];
  for (const sec of sections) {
    if (sec.items && sec.items.length > 0) {
      html += `<p style="margin:8px 0 4px;font-size:13px;font-weight:600;color:${sec.color};">${sec.label}</p>`;
      for (const item of sec.items) {
        html += `<p style="margin:0 0 3px;font-size:13px;color:#64748b;padding-left:12px;">&bull; ${ctx.renderInline(item)}</p>`;
      }
    }
  }
  html += `</section>`;
  return html;
};
