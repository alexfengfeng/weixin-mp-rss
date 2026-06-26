/**
 * 葡萄深紫主题
 * 深紫色调、神秘高贵，适合艺术、哲学、深度思考类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#581c87",
    "secondary": "#6b21a8",
    "accent": "#a855f7",
    "text": "#e5e7eb",
    "muted": "#9ca3af",
    "bg": "#1e1b2e",
    "surface": "#2d2a44",
    "border": "#3d3a5c",
    "success": "#10b981",
    "warning": "#f59e0b",
    "danger": "#ef4444"
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
    "sm": 4,
    "md": 6,
    "lg": 8
  }
};

export const grape_deepTheme: BuiltinTheme = {
  id: "grape_deep",
  name: "葡萄深紫",
  description: "深紫色调、神秘高贵，适合艺术、哲学、深度思考类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#581c87;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#581c87;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#6b21a8;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#e5e7eb;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#e5e7eb;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#e5e7eb;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #3d3a5c;",
      img: "max-width:100%;height:auto;border-radius:6px;",
      strong: "color:#581c87;font-weight:700;",
      a: "color:#a855f7;text-decoration:none;border-bottom:1px solid #3d3a5c;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #a855f7;background:#2d2a44;border-radius:0 6px 6px 0;color:#9ca3af;",
      code: "background:#2d2a44;padding:2px 6px;border-radius:4px;font-size:0.88em;color:#6b21a8;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#2d2a44;border-radius:6px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #3d3a5c;background:#a855f7;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #3d3a5c;color:#e5e7eb;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "dark",
  sortOrder: 36
};
