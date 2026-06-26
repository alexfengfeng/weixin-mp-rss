/**
 * 蜜糖金主题
 * 蜜糖金色调、甜蜜温暖，适合亲子、美食、烘焙类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#7c2d12",
    "secondary": "#9a3412",
    "accent": "#f59e0b",
    "text": "#292524",
    "muted": "#78716c",
    "bg": "#fff7ed",
    "surface": "#ffedd5",
    "border": "#fed7aa",
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

export const honey_goldTheme: BuiltinTheme = {
  id: "honey_gold",
  name: "蜜糖金",
  description: "蜜糖金色调、甜蜜温暖，适合亲子、美食、烘焙类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#7c2d12;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#7c2d12;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#9a3412;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#292524;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#292524;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#292524;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #fed7aa;",
      img: "max-width:100%;height:auto;border-radius:12px;",
      strong: "color:#7c2d12;font-weight:700;",
      a: "color:#f59e0b;text-decoration:none;border-bottom:1px solid #fed7aa;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #f59e0b;background:#ffedd5;border-radius:0 12px 12px 0;color:#78716c;",
      code: "background:#ffedd5;padding:2px 6px;border-radius:8px;font-size:0.88em;color:#9a3412;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#ffedd5;border-radius:12px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fed7aa;background:#f59e0b;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fed7aa;color:#292524;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 34
};
