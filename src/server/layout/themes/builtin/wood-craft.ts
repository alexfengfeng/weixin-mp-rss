/**
 * 原木手作主题
 * 原木色调、手作质感，适合手工艺、家居、木工类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#451a03",
    "secondary": "#78350f",
    "accent": "#a16207",
    "text": "#292524",
    "muted": "#78716c",
    "bg": "#fefce8",
    "surface": "#fef3c7",
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
    "scale": 1.6
  },
  "radius": {
    "sm": 2,
    "md": 4,
    "lg": 6
  }
};

export const wood_craftTheme: BuiltinTheme = {
  id: "wood_craft",
  name: "原木手作",
  description: "原木色调、手作质感，适合手工艺、家居、木工类内容。",
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
      hr: "margin:28px 0;border:0;border-top:1px solid #fde68a;",
      img: "max-width:100%;height:auto;border-radius:4px;",
      strong: "color:#451a03;font-weight:700;",
      a: "color:#a16207;text-decoration:none;border-bottom:1px solid #fde68a;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #a16207;background:#fef3c7;border-radius:0 4px 4px 0;color:#78716c;",
      code: "background:#fef3c7;padding:2px 6px;border-radius:2px;font-size:0.88em;color:#78350f;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#fef3c7;border-radius:4px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fde68a;background:#a16207;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fde68a;color:#292524;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 47
};
