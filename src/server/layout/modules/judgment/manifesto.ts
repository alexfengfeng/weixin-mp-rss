import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const manifestoDef: LayoutModuleDef = {
  id: "manifesto", category: "judgment", label: "宣言",
  description: "宣言式声明，小标签+主标题，醒目展示。",
  bodyFormat: "fields",
  fields: [{ name: "eyebrow", required: true }, { name: "title", required: true }],
  examples: [`:::manifesto\neyebrow: 我们相信\ntitle: 好工具应该让人更自由\n:::`], since: "1.0.0"
};

export const manifestoRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const f = module.body.fields || [];
  const eyebrow = getField(f, "eyebrow") || "";
  const title = getField(f, "title") || "";
  let html = `<section style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);border-radius:12px;padding:32px 24px;margin:0 0 16px;text-align:center;">`;
  if (eyebrow) html += `<p style="margin:0 0 10px;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;color:#e0e7ff;font-weight:600;">${ctx.escapeHtml(eyebrow)}</p>`;
  html += `<p style="margin:0;font-size:24px;font-weight:800;color:#ffffff;line-height:1.4;">${ctx.renderInline(title)}</p>`;
  html += `</section>`;
  return html;
};
