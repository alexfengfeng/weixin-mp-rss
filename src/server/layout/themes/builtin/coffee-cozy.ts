/**
 * 咖啡温馨主题
 * 咖啡棕色调、温馨舒适，适合读书、咖啡、慢生活类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#451a03",
    "secondary": "#78350f",
    "accent": "#92400e",
    "text": "#292524",
    "muted": "#78716c",
    "bg": "#fdf6e3",
    "surface": "#f5e6c8",
    "border": "#e7d5a0",
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
    "scale": 1.65
  },
  "radius": {
    "sm": 4,
    "md": 6,
    "lg": 8
  }
};

export const coffee_cozyTheme: BuiltinTheme = {
  id: "coffee_cozy",
  name: "咖啡温馨",
  description: "咖啡棕色调、温馨舒适，适合读书、咖啡、慢生活类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#451a03;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#451a03;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#78350f;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#292524;font-size:16px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#292524;font-size:16px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#292524;font-size:16px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #e7d5a0;",
      img: "max-width:100%;height:auto;border-radius:6px;",
      strong: "color:#451a03;font-weight:700;",
      a: "color:#92400e;text-decoration:none;border-bottom:1px solid #e7d5a0;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #92400e;background:#f5e6c8;border-radius:0 6px 6px 0;color:#78716c;",
      code: "background:#f5e6c8;padding:2px 6px;border-radius:4px;font-size:0.88em;color:#78350f;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#f5e6c8;border-radius:6px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e7d5a0;background:#92400e;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #e7d5a0;color:#292524;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 45
};
