/**
 * 紫罗兰雾主题
 * 紫罗兰淡紫色、朦胧柔和，适合诗歌、摄影、美学类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#5b21b6",
    "secondary": "#6d28d9",
    "accent": "#8b5cf6",
    "text": "#1f2937",
    "muted": "#9ca3af",
    "bg": "#f5f3ff",
    "surface": "#ede9fe",
    "border": "#ddd6fe",
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
    "scale": 1.6
  },
  "radius": {
    "sm": 6,
    "md": 10,
    "lg": 14
  }
};

export const violet_mistTheme: BuiltinTheme = {
  id: "violet_mist",
  name: "紫罗兰雾",
  description: "紫罗兰淡紫色、朦胧柔和，适合诗歌、摄影、美学类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#5b21b6;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#5b21b6;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#6d28d9;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #ddd6fe;",
      img: "max-width:100%;height:auto;border-radius:10px;",
      strong: "color:#5b21b6;font-weight:700;",
      a: "color:#8b5cf6;text-decoration:none;border-bottom:1px solid #ddd6fe;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #8b5cf6;background:#ede9fe;border-radius:0 10px 10px 0;color:#9ca3af;",
      code: "background:#ede9fe;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#6d28d9;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#ede9fe;border-radius:10px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #ddd6fe;background:#8b5cf6;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #ddd6fe;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 37
};
