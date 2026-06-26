/**
 * 薄荷清凉主题
 * 薄荷绿色调、清凉舒爽，适合夏日、饮品、健康类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#166534",
    "secondary": "#15803d",
    "accent": "#22c55e",
    "text": "#1f2937",
    "muted": "#6b7280",
    "bg": "#f0fdf4",
    "surface": "#dcfce7",
    "border": "#bbf7d0",
    "success": "#16a34a",
    "warning": "#ea580c",
    "danger": "#b91c1c"
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

export const mint_coolTheme: BuiltinTheme = {
  id: "mint_cool",
  name: "薄荷清凉",
  description: "薄荷绿色调、清凉舒爽，适合夏日、饮品、健康类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#166534;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#166534;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#15803d;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #bbf7d0;",
      img: "max-width:100%;height:auto;border-radius:10px;",
      strong: "color:#166534;font-weight:700;",
      a: "color:#22c55e;text-decoration:none;border-bottom:1px solid #bbf7d0;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #22c55e;background:#dcfce7;border-radius:0 10px 10px 0;color:#6b7280;",
      code: "background:#dcfce7;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#15803d;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#dcfce7;border-radius:10px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #bbf7d0;background:#22c55e;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #bbf7d0;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 28
};
