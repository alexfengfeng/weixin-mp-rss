/**
 * 琥珀暖光主题
 * 琥珀金黄色调、温暖明亮，适合读书、咖啡、慢生活类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#78350f",
    "secondary": "#92400e",
    "accent": "#d97706",
    "text": "#292524",
    "muted": "#78716c",
    "bg": "#fffbeb",
    "surface": "#fef3c7",
    "border": "#fde68a",
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
    "md": 8,
    "lg": 12
  }
};

export const amber_glowTheme: BuiltinTheme = {
  id: "amber_glow",
  name: "琥珀暖光",
  description: "琥珀金黄色调、温暖明亮，适合读书、咖啡、慢生活类内容。",
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
      hr: "margin:28px 0;border:0;border-top:1px solid #fde68a;",
      img: "max-width:100%;height:auto;border-radius:8px;",
      strong: "color:#78350f;font-weight:700;",
      a: "color:#d97706;text-decoration:none;border-bottom:1px solid #fde68a;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #d97706;background:#fef3c7;border-radius:0 8px 8px 0;color:#78716c;",
      code: "background:#fef3c7;padding:2px 6px;border-radius:4px;font-size:0.88em;color:#92400e;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#fef3c7;border-radius:8px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fde68a;background:#d97706;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fde68a;color:#292524;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 32
};
