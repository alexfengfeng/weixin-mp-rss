/**
 * callout 模块 - 提示框
 *
 * :::callout tip
 * 这是一条提示信息
 * :::
 *
 * 支持变体：info(默认) / tip / warning / success / danger
 */

import type { LayoutModuleDef, ModuleRenderer, ParsedModule, RenderContext } from "@/server/layout/types";

const CALLOUT_VARIANTS = ["info", "tip", "warning", "success", "danger"] as const;

const VARIANT_STYLES: Record<string, { wrap: string; label: string; labelText: string }> = {
  info: {
    wrap: `background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:14px 18px;margin:0 0 16px;`,
    label: `font-size:12px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;`,
    labelText: "信息"
  },
  tip: {
    wrap: `background:#f0fdf4;border-left:4px solid #22c55e;border-radius:0 8px 8px 0;padding:14px 18px;margin:0 0 16px;`,
    label: `font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;`,
    labelText: "提示"
  },
  warning: {
    wrap: `background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:14px 18px;margin:0 0 16px;`,
    label: `font-size:12px;font-weight:700;color:#d97706;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;`,
    labelText: "注意"
  },
  success: {
    wrap: `background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 8px 8px 0;padding:14px 18px;margin:0 0 16px;`,
    label: `font-size:12px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;`,
    labelText: "成功"
  },
  danger: {
    wrap: `background:#fef2f2;border-left:4px solid #ef4444;border-radius:0 8px 8px 0;padding:14px 18px;margin:0 0 16px;`,
    label: `font-size:12px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;`,
    labelText: "警告"
  }
};

export const calloutDef: LayoutModuleDef = {
  id: "callout",
  category: "sprint4",
  label: "提示框",
  description: "突出显示的提示框，支持 info/tip/warning/success/danger 五种变体。",
  bodyFormat: "text",
  variants: [...CALLOUT_VARIANTS],
  defaultVariant: "info",
  examples: [
    `:::callout tip
这是一条提示信息
:::`,
    `:::callout warning
**注意**：此操作不可逆
:::`
  ],
  since: "1.0.0"
};

export const calloutRender: ModuleRenderer = (module: ParsedModule, ctx: RenderContext): string => {
  const variant = module.variant || "info";
  const defaults = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
  const content = module.body.text || "";

  const wrapStyle = ctx.moduleStyle("callout", variant) || ` style="${defaults.wrap}"`;
  const labelStyle = ctx.moduleStyle("callout", "label") || ` style="${defaults.label}"`;

  let html = `<section${wrapStyle}>`;
  html += `<p${labelStyle}>${defaults.labelText}</p>`;
  if (content.trim()) {
    html += ctx.renderMarkdown(content);
  }
  html += `</section>`;

  return html;
};
