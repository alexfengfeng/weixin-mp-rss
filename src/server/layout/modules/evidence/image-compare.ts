import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const imageCompareDef: LayoutModuleDef = {
  id: "image-compare", category: "evidence", label: "图片对比",
  description: "前后对比图片，before+after+可选标签。",
  bodyFormat: "fields",
  fields: [{ name: "before", required: true }, { name: "after", required: true }, { name: "label_before", required: false }, { name: "label_after", required: false }],
  examples: [`:::image-compare\nbefore: /img/before.png\nafter: /img/after.png\nlabel_before: 优化前\nlabel_after: 优化后\n:::`], since: "1.0.0"
};

export const imageCompareRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const f = module.body.fields || [];
  const before = getField(f, "before") || "";
  const after = getField(f, "after") || "";
  const lb = getField(f, "label_before") || "Before";
  const la = getField(f, "label_after") || "After";
  let html = `<section style="margin:0 0 16px;"><div style="display:flex;gap:12px;">`;
  html += `<div style="flex:1;"><img style="max-width:100%;border-radius:8px;" src="${ctx.escapeAttr(before)}" /><p style="margin:6px 0 0;font-size:13px;color:#94a3b8;text-align:center;">${ctx.escapeHtml(lb)}</p></div>`;
  html += `<div style="flex:1;"><img style="max-width:100%;border-radius:8px;" src="${ctx.escapeAttr(after)}" /><p style="margin:6px 0 0;font-size:13px;color:#94a3b8;text-align:center;">${ctx.escapeHtml(la)}</p></div>`;
  html += `</div></section>`;
  return html;
};
