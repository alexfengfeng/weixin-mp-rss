/**
 * 沙漠沙金主题
 * 沙金色调、干燥温暖，适合旅行、探险、自然类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#78350f",
    "secondary": "#92400e",
    "accent": "#b45309",
    "text": "#292524",
    "muted": "#78716c",
    "bg": "#fef3c7",
    "surface": "#fde68a",
    "border": "#fcd34d",
    "success": "#65a30d",
    "warning": "#ca8a04",
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
    "sm": 2,
    "md": 4,
    "lg": 6
  }
};

export const sand_desertTheme: BuiltinTheme = {
  id: "sand_desert",
  name: "沙漠沙金",
  description: "沙金色调、干燥温暖，适合旅行、探险、自然类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#78350f;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#78350f;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#92400e;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#292524;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#292524;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#292524;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #fcd34d;",
      img: "max-width:100%;height:auto;border-radius:4px;",
      strong: "color:#78350f;font-weight:700;",
      a: "color:#b45309;text-decoration:none;border-bottom:1px solid #fcd34d;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #b45309;background:#fde68a;border-radius:0 4px 4px 0;color:#78716c;",
      code: "background:#fde68a;padding:2px 6px;border-radius:2px;font-size:0.88em;color:#92400e;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#fde68a;border-radius:4px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fcd34d;background:#b45309;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fcd34d;color:#292524;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 46
};
