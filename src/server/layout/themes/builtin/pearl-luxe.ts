/**
 * 珍珠奢华主题
 * 珍珠白+金色点缀、低调奢华，适合高端品牌、奢侈品内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#44403c",
    "secondary": "#57534e",
    "accent": "#a16207",
    "text": "#292524",
    "muted": "#a8a29e",
    "bg": "#fafaf9",
    "surface": "#f5f5f4",
    "border": "#e7e5e4",
    "success": "#65a30d",
    "warning": "#ca8a04",
    "danger": "#b91c1c"
  },
  "font": {
    "baseSize": 15,
    "scale": 1.25,
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

export const pearl_luxeTheme: BuiltinTheme = {
  id: "pearl_luxe",
  name: "珍珠奢华",
  description: "珍珠白+金色点缀、低调奢华，适合高端品牌、奢侈品内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#44403c;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#44403c;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#57534e;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#292524;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#292524;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#292524;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #e7e5e4;",
      img: "max-width:100%;height:auto;border-radius:4px;",
      strong: "color:#44403c;font-weight:700;",
      a: "color:#a16207;text-decoration:none;border-bottom:1px solid #e7e5e4;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #a16207;background:#f5f5f4;border-radius:0 4px 4px 0;color:#a8a29e;",
      code: "background:#f5f5f4;padding:2px 6px;border-radius:2px;font-size:0.88em;color:#57534e;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#f5f5f4;border-radius:4px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e7e5e4;background:#a16207;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #e7e5e4;color:#292524;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 41
};
