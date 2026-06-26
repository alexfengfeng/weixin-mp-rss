/**
 * 橄榄自然主题
 * 橄榄绿色调、自然质朴，适合环保、农业、有机生活类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#365314",
    "secondary": "#4d7c0f",
    "accent": "#65a30d",
    "text": "#292524",
    "muted": "#78716c",
    "bg": "#f7fee7",
    "surface": "#ecfccb",
    "border": "#d9f99d",
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
    "sm": 4,
    "md": 6,
    "lg": 8
  }
};

export const olive_naturalTheme: BuiltinTheme = {
  id: "olive_natural",
  name: "橄榄自然",
  description: "橄榄绿色调、自然质朴，适合环保、农业、有机生活类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#365314;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#365314;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#4d7c0f;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#292524;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#292524;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#292524;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #d9f99d;",
      img: "max-width:100%;height:auto;border-radius:6px;",
      strong: "color:#365314;font-weight:700;",
      a: "color:#65a30d;text-decoration:none;border-bottom:1px solid #d9f99d;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #65a30d;background:#ecfccb;border-radius:0 6px 6px 0;color:#78716c;",
      code: "background:#ecfccb;padding:2px 6px;border-radius:4px;font-size:0.88em;color:#4d7c0f;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#ecfccb;border-radius:6px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #d9f99d;background:#65a30d;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #d9f99d;color:#292524;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 29
};
