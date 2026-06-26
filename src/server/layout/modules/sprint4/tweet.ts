import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

export const tweetDef: LayoutModuleDef = {
  id: "tweet", category: "sprint4", label: "推文卡片",
  description: "推文风格引用卡片，json_object 格式。",
  bodyFormat: "json_object",
  examples: [`:::tweet\n{"name":"张三","handle":"@zhangsan","text":"好工具应该让人更自由","timestamp":"2小时前","likes":"120"}\n:::`],
  since: "1.0.0"
};

export const tweetRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const data = module.body.json as { name?: string; handle?: string; text?: string; timestamp?: string; likes?: string } | undefined;
  if (!data) return "";
  let html = `<section style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px 20px;margin:0 0 16px;">`;
  html += `<div style="display:flex;align-items:center;margin:0 0 10px;">`;
  html += `<div style="flex-shrink:0;width:40px;height:40px;border-radius:50%;background:#1d9bf0;color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;margin-right:10px;">${ctx.escapeHtml((data.name || "?").charAt(0))}</div>`;
  html += `<div>`;
  if (data.name) html += `<span style="font-size:14px;font-weight:700;color:#0f172a;">${ctx.escapeHtml(data.name)}</span>`;
  if (data.handle) html += `<span style="font-size:13px;color:#64748b;margin-left:6px;">${ctx.escapeHtml(data.handle)}</span>`;
  html += `</div></div>`;
  if (data.text) html += `<p style="margin:0 0 10px;font-size:15px;color:#1e293b;line-height:1.6;">${ctx.renderInline(data.text)}</p>`;
  html += `<div style="display:flex;gap:20px;font-size:13px;color:#94a3b8;">`;
  if (data.timestamp) html += `<span>${ctx.escapeHtml(data.timestamp)}</span>`;
  if (data.likes) html += `<span>&#9825; ${ctx.escapeHtml(data.likes)}</span>`;
  html += `</div></section>`;
  return html;
};
