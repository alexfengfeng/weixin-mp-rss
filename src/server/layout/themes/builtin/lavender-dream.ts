/**
 * 薰衣草梦主题
 * 薰衣草紫色调、梦幻浪漫，适合情感、文艺、婚礼类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#581c87",
    "secondary": "#6b21a8",
    "accent": "#9333ea",
    "text": "#1f2937",
    "muted": "#9ca3af",
    "bg": "#faf5ff",
    "surface": "#f3e8ff",
    "border": "#e9d5ff",
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
    "sm": 8,
    "md": 12,
    "lg": 16
  }
};

export const lavender_dreamTheme: BuiltinTheme = {
  id: "lavender_dream",
  name: "薰衣草梦",
  description: "薰衣草紫色调、梦幻浪漫，适合情感、文艺、婚礼类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#581c87;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#581c87;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#6b21a8;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #e9d5ff;",
      img: "max-width:100%;height:auto;border-radius:12px;",
      strong: "color:#581c87;font-weight:700;",
      a: "color:#9333ea;text-decoration:none;border-bottom:1px solid #e9d5ff;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #9333ea;background:#f3e8ff;border-radius:0 12px 12px 0;color:#9ca3af;",
      code: "background:#f3e8ff;padding:2px 6px;border-radius:8px;font-size:0.88em;color:#6b21a8;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#f3e8ff;border-radius:12px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e9d5ff;background:#9333ea;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #e9d5ff;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 35
};
