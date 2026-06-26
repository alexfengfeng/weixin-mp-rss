/**
 * infographic 模块 - 信息图
 * :::infographic
 * type: data
 * value: 85%
 * label: 用户满意度
 * note: 基于 1000 份问卷
 * :::
 * type 可选: data / quote / fact
 */
import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const infographicDef: LayoutModuleDef = {
  id: "infographic", category: "infographic", label: "信息图",
  description: "单条信息图，支持 data/quote/fact 三种类型。",
  bodyFormat: "fields",
  fields: [
    { name: "type", required: true, description: "类型：data/quote/fact" },
    { name: "value", required: true, description: "主值" },
    { name: "label", required: true, description: "标签" },
    { name: "note", required: false, description: "备注" }
  ],
  examples: [`:::infographic\ntype: data\nvalue: 85%\nlabel: 用户满意度\n:::`], since: "1.0.0"
};

export const infographicRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const fields = module.body.fields;
  const type = (getField(fields, "type") || "data").toLowerCase();
  const value = getField(fields, "value") || "";
  const label = getField(fields, "label") || "";
  const note = getField(fields, "note");

  const styles: Record<string, { bg: string; color: string }> = {
    data: { bg: "#eff6ff", color: "#2563eb" },
    quote: { bg: "#f5f3ff", color: "#7c3aed" },
    fact: { bg: "#f0fdf4", color: "#16a34a" }
  };
  const s = styles[type] || styles.data;

  let html = `<section style="background:${s.bg};border-radius:12px;padding:24px;text-align:center;margin:0 0 16px;">`;
  if (value) html += `<p style="margin:0 0 6px;font-size:32px;font-weight:800;color:${s.color};">${ctx.renderInline(value)}</p>`;
  if (label) html += `<p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#1e293b;">${ctx.renderInline(label)}</p>`;
  if (note) html += `<p style="margin:0;font-size:13px;color:#94a3b8;">${ctx.renderInline(note)}</p>`;
  html += `</section>`;
  return html;
};
