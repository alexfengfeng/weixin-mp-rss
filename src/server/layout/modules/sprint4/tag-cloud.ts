/**
 * tag-cloud 模块：标签云
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";
import { getField } from "@/server/layout/parser/body-fields";

export const tagCloudDef: LayoutModuleDef = {
  id: "tag-cloud",
  category: "sprint4",
  label: "标签云",
  description: "以不同大小和颜色展示一组标签，适合关键词和主题标签展示。",
  bodyFormat: "fields",
  hasTitle: false,
  examples: [`:::tag-cloud\n标签: AI, 公众号, 排版, Markdown, 微信, 自动化\n:::`],
  since: "1.1.0"
};

export const tagCloudRender: ModuleRenderer = (mod: ParsedModule, ctx: RenderContext): string => {
  const fields = mod.body.fields;
  const rawTags = getField(fields, "标签") || getField(fields, "tags") || "";
  const tags = rawTags.split(/[、,，\n]/).map((t) => t.trim()).filter(Boolean);
  const c = ctx.theme.tokens?.colors || {} as any;

  const wrapStyle = ` style="margin:16px 0;padding:14px 16px;background:${c.surface};border-radius:10px;display:flex;flex-wrap:wrap;gap:8px;"`;
  const tagColors = [c.accent, c.primary, c.secondary, c.warning];

  let html = `<section${wrapStyle}>`;
  tags.forEach((tag, i) => {
    const color = tagColors[i % tagColors.length];
    const size = 12 + (i % 3) * 2;
    const tagStyle = ` style="display:inline-block;padding:4px 12px;border-radius:16px;background:${color}18;color:${color};font-size:${size}px;font-weight:500;"`;
    html += `<span${tagStyle}>${ctx.escapeHtml(tag)}</span>`;
  });
  html += `</section>`;
  return html;
};
