/**
 * 极光夜空主题
 * 极光渐变色、深色背景，适合天文、科幻、梦想类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#67e8f9",
    "secondary": "#86efac",
    "accent": "#c4b5fd",
    "text": "#e5e7eb",
    "muted": "#9ca3af",
    "bg": "#0c1929",
    "surface": "#162236",
    "border": "#1e2d44",
    "success": "#34d399",
    "warning": "#fbbf24",
    "danger": "#f87171"
  },
  "font": {
    "baseSize": 15,
    "scale": 1.25,
    "family": "-apple-system, \"PingFang SC\", sans-serif"
  },
  "spacing": {
    "unit": 8,
    "scale": 1.55
  },
  "radius": {
    "sm": 6,
    "md": 10,
    "lg": 14
  }
};

export const aurora_nightTheme: BuiltinTheme = {
  id: "aurora_night",
  name: "极光夜空",
  description: "极光渐变色、深色背景，适合天文、科幻、梦想类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#67e8f9;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#67e8f9;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#86efac;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#e5e7eb;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#e5e7eb;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#e5e7eb;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #1e2d44;",
      img: "max-width:100%;height:auto;border-radius:10px;",
      strong: "color:#67e8f9;font-weight:700;",
      a: "color:#c4b5fd;text-decoration:none;border-bottom:1px solid #1e2d44;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #c4b5fd;background:#162236;border-radius:0 10px 10px 0;color:#9ca3af;",
      code: "background:#162236;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#86efac;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#162236;border-radius:10px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #1e2d44;background:#c4b5fd;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #1e2d44;color:#e5e7eb;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "dark",
  sortOrder: 44
};
