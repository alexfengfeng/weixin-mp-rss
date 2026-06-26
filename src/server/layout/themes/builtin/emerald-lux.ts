/**
 * 翡翠奢华主题
 * 翡翠绿色调、高级奢华感，适合珠宝、奢侈品、高端生活方式。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#064e3b",
    "secondary": "#065f46",
    "accent": "#10b981",
    "text": "#e5e7eb",
    "muted": "#9ca3af",
    "bg": "#0f172a",
    "surface": "#1e293b",
    "border": "#334155",
    "success": "#10b981",
    "warning": "#f59e0b",
    "danger": "#ef4444"
  },
  "font": {
    "baseSize": 15,
    "scale": 1.25,
    "family": "-apple-system, \"PingFang SC\", sans-serif"
  },
  "spacing": {
    "unit": 8,
    "scale": 1.5
  },
  "radius": {
    "sm": 6,
    "md": 10,
    "lg": 14
  }
};

export const emerald_luxTheme: BuiltinTheme = {
  id: "emerald_lux",
  name: "翡翠奢华",
  description: "翡翠绿色调、高级奢华感，适合珠宝、奢侈品、高端生活方式。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#064e3b;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#064e3b;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#065f46;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#e5e7eb;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#e5e7eb;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#e5e7eb;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #334155;",
      img: "max-width:100%;height:auto;border-radius:10px;",
      strong: "color:#064e3b;font-weight:700;",
      a: "color:#10b981;text-decoration:none;border-bottom:1px solid #334155;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #10b981;background:#1e293b;border-radius:0 10px 10px 0;color:#9ca3af;",
      code: "background:#1e293b;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#065f46;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#1e293b;border-radius:10px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #334155;background:#10b981;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #334155;color:#e5e7eb;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "dark",
  sortOrder: 31
};
