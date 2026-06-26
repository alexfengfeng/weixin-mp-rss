/**
 * 岩灰专业主题
 * 岩灰色调、冷静专业，适合 B2B、SaaS、企业服务类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#0f172a",
    "secondary": "#334155",
    "accent": "#475569",
    "text": "#1e293b",
    "muted": "#64748b",
    "bg": "#f8fafc",
    "surface": "#f1f5f9",
    "border": "#e2e8f0",
    "success": "#16a34a",
    "warning": "#ea580c",
    "danger": "#b91c1c"
  },
  "font": {
    "baseSize": 14,
    "scale": 1.2,
    "family": "-apple-system, \"PingFang SC\", sans-serif"
  },
  "spacing": {
    "unit": 8,
    "scale": 1.45
  },
  "radius": {
    "sm": 2,
    "md": 4,
    "lg": 6
  }
};

export const slate_proTheme: BuiltinTheme = {
  id: "slate_pro",
  name: "岩灰专业",
  description: "岩灰色调、冷静专业，适合 B2B、SaaS、企业服务类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#0f172a;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#0f172a;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#334155;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1e293b;font-size:14px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1e293b;font-size:14px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1e293b;font-size:14px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #e2e8f0;",
      img: "max-width:100%;height:auto;border-radius:4px;",
      strong: "color:#0f172a;font-weight:700;",
      a: "color:#475569;text-decoration:none;border-bottom:1px solid #e2e8f0;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #475569;background:#f1f5f9;border-radius:0 4px 4px 0;color:#64748b;",
      code: "background:#f1f5f9;padding:2px 6px;border-radius:2px;font-size:0.88em;color:#334155;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#f1f5f9;border-radius:4px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e2e8f0;background:#475569;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #e2e8f0;color:#1e293b;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 38
};
