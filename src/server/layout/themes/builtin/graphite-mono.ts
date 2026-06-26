/**
 * 石墨单色主题
 * 石墨色单色调、极简克制，适合深度长文、行业观察类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#18181b",
    "secondary": "#27272a",
    "accent": "#52525b",
    "text": "#27272a",
    "muted": "#71717a",
    "bg": "#fafafa",
    "surface": "#f4f4f5",
    "border": "#e4e4e7",
    "success": "#16a34a",
    "warning": "#ea580c",
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
    "sm": 0,
    "md": 0,
    "lg": 0
  }
};

export const graphite_monoTheme: BuiltinTheme = {
  id: "graphite_mono",
  name: "石墨单色",
  description: "石墨色单色调、极简克制，适合深度长文、行业观察类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#18181b;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#18181b;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#27272a;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#27272a;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#27272a;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#27272a;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #e4e4e7;",
      img: "max-width:100%;height:auto;border-radius:0px;",
      strong: "color:#18181b;font-weight:700;",
      a: "color:#52525b;text-decoration:none;border-bottom:1px solid #e4e4e7;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #52525b;background:#f4f4f5;border-radius:0 0px 0px 0;color:#71717a;",
      code: "background:#f4f4f5;padding:2px 6px;border-radius:0px;font-size:0.88em;color:#27272a;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#f4f4f5;border-radius:0px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e4e4e7;background:#52525b;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #e4e4e7;color:#27272a;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 40
};
