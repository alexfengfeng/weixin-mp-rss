/**
 * 珊瑚暖阳主题
 * 珊瑚色暖调，适合旅行、美食、生活方式类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#9a3412",
    "secondary": "#c2410c",
    "accent": "#f97316",
    "text": "#292524",
    "muted": "#78716c",
    "bg": "#fff7ed",
    "surface": "#ffedd5",
    "border": "#fed7aa",
    "success": "#16a34a",
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
    "sm": 6,
    "md": 10,
    "lg": 14
  }
};

export const coral_warmTheme: BuiltinTheme = {
  id: "coral_warm",
  name: "珊瑚暖阳",
  description: "珊瑚色暖调，适合旅行、美食、生活方式类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#9a3412;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#9a3412;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#c2410c;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#292524;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#292524;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#292524;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #fed7aa;",
      img: "max-width:100%;height:auto;border-radius:10px;",
      strong: "color:#9a3412;font-weight:700;",
      a: "color:#f97316;text-decoration:none;border-bottom:1px solid #fed7aa;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #f97316;background:#ffedd5;border-radius:0 10px 10px 0;color:#78716c;",
      code: "background:#ffedd5;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#c2410c;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#ffedd5;border-radius:10px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fed7aa;background:#f97316;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fed7aa;color:#292524;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 21
};
