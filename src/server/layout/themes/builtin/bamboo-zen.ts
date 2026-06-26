/**
 * 竹意禅心主题
 * 竹绿色调、禅意宁静，适合茶道、冥想、传统文化类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#1a2e05",
    "secondary": "#3f6212",
    "accent": "#4d7c0f",
    "text": "#1c1917",
    "muted": "#78716c",
    "bg": "#fefce8",
    "surface": "#fef9c3",
    "border": "#fde68a",
    "success": "#65a30d",
    "warning": "#ca8a04",
    "danger": "#b91c1c"
  },
  "font": {
    "baseSize": 16,
    "scale": 1.3,
    "family": "Georgia, \"Songti SC\", serif"
  },
  "spacing": {
    "unit": 8,
    "scale": 1.7
  },
  "radius": {
    "sm": 2,
    "md": 4,
    "lg": 6
  }
};

export const bamboo_zenTheme: BuiltinTheme = {
  id: "bamboo_zen",
  name: "竹意禅心",
  description: "竹绿色调、禅意宁静，适合茶道、冥想、传统文化类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#1a2e05;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#1a2e05;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#3f6212;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1c1917;font-size:16px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1c1917;font-size:16px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1c1917;font-size:16px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #fde68a;",
      img: "max-width:100%;height:auto;border-radius:4px;",
      strong: "color:#1a2e05;font-weight:700;",
      a: "color:#4d7c0f;text-decoration:none;border-bottom:1px solid #fde68a;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #4d7c0f;background:#fef9c3;border-radius:0 4px 4px 0;color:#78716c;",
      code: "background:#fef9c3;padding:2px 6px;border-radius:2px;font-size:0.88em;color:#3f6212;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#fef9c3;border-radius:4px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fde68a;background:#4d7c0f;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fde68a;color:#1c1917;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 30
};
