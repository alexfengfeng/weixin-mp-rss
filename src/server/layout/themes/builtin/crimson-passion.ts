/**
 * 猩红热情主题
 * 猩红色调、强视觉冲击，适合热点评论和活动推广。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#7f1d1d",
    "secondary": "#991b1b",
    "accent": "#dc2626",
    "text": "#1f2937",
    "muted": "#6b7280",
    "bg": "#fff",
    "surface": "#fef2f2",
    "border": "#fecaca",
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
    "scale": 1.5
  },
  "radius": {
    "sm": 4,
    "md": 6,
    "lg": 8
  }
};

export const crimson_passionTheme: BuiltinTheme = {
  id: "crimson_passion",
  name: "猩红热情",
  description: "猩红色调、强视觉冲击，适合热点评论和活动推广。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#7f1d1d;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#7f1d1d;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#991b1b;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #fecaca;",
      img: "max-width:100%;height:auto;border-radius:6px;",
      strong: "color:#7f1d1d;font-weight:700;",
      a: "color:#dc2626;text-decoration:none;border-bottom:1px solid #fecaca;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #dc2626;background:#fef2f2;border-radius:0 6px 6px 0;color:#6b7280;",
      code: "background:#fef2f2;padding:2px 6px;border-radius:4px;font-size:0.88em;color:#991b1b;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#fef2f2;border-radius:6px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fecaca;background:#dc2626;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fecaca;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 20
};
