/**
 * 柠檬活力主题
 * 柠檬黄色调、活泼明亮，适合创意、设计、灵感类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#713f12",
    "secondary": "#854d0e",
    "accent": "#eab308",
    "text": "#1f2937",
    "muted": "#6b7280",
    "bg": "#fefce8",
    "surface": "#fef9c3",
    "border": "#fde047",
    "success": "#16a34a",
    "warning": "#ea580c",
    "danger": "#b91c1c"
  },
  "font": {
    "baseSize": 15,
    "scale": 1.2,
    "family": "-apple-system, \"PingFang SC\", sans-serif"
  },
  "spacing": {
    "unit": 8,
    "scale": 1.5
  },
  "radius": {
    "sm": 6,
    "md": 10,
    "lg": 14
  }
};

export const lemon_zestyTheme: BuiltinTheme = {
  id: "lemon_zesty",
  name: "柠檬活力",
  description: "柠檬黄色调、活泼明亮，适合创意、设计、灵感类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#713f12;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#713f12;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#854d0e;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #fde047;",
      img: "max-width:100%;height:auto;border-radius:10px;",
      strong: "color:#713f12;font-weight:700;",
      a: "color:#eab308;text-decoration:none;border-bottom:1px solid #fde047;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #eab308;background:#fef9c3;border-radius:0 10px 10px 0;color:#6b7280;",
      code: "background:#fef9c3;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#854d0e;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#fef9c3;border-radius:10px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fde047;background:#eab308;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fde047;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 33
};
