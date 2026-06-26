/**
 * 天晴亮蓝主题
 * 明亮天蓝色调、清爽干净，适合教育、公益、科普类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#0369a1",
    "secondary": "#0284c7",
    "accent": "#0ea5e9",
    "text": "#1f2937",
    "muted": "#64748b",
    "bg": "#fff",
    "surface": "#f0f9ff",
    "border": "#bae6fd",
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
    "sm": 6,
    "md": 8,
    "lg": 12
  }
};

export const sky_brightTheme: BuiltinTheme = {
  id: "sky_bright",
  name: "天晴亮蓝",
  description: "明亮天蓝色调、清爽干净，适合教育、公益、科普类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#0369a1;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#0369a1;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#0284c7;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #bae6fd;",
      img: "max-width:100%;height:auto;border-radius:8px;",
      strong: "color:#0369a1;font-weight:700;",
      a: "color:#0ea5e9;text-decoration:none;border-bottom:1px solid #bae6fd;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #0ea5e9;background:#f0f9ff;border-radius:0 8px 8px 0;color:#64748b;",
      code: "background:#f0f9ff;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#0284c7;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#f0f9ff;border-radius:8px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #bae6fd;background:#0ea5e9;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #bae6fd;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 25
};
