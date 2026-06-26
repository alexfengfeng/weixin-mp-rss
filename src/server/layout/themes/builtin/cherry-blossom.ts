/**
 * 樱花粉主题
 * 樱花粉色调、温柔少女感，适合美妆、恋爱、治愈系内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#9d174d",
    "secondary": "#be185d",
    "accent": "#ec4899",
    "text": "#1f2937",
    "muted": "#9ca3af",
    "bg": "#fdf2f8",
    "surface": "#fce7f3",
    "border": "#fbcfe8",
    "success": "#16a34a",
    "warning": "#ea580c",
    "danger": "#be123c"
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

export const cherry_blossomTheme: BuiltinTheme = {
  id: "cherry_blossom",
  name: "樱花粉",
  description: "樱花粉色调、温柔少女感，适合美妆、恋爱、治愈系内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#9d174d;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#9d174d;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#be185d;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #fbcfe8;",
      img: "max-width:100%;height:auto;border-radius:12px;",
      strong: "color:#9d174d;font-weight:700;",
      a: "color:#ec4899;text-decoration:none;border-bottom:1px solid #fbcfe8;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #ec4899;background:#fce7f3;border-radius:0 12px 12px 0;color:#9ca3af;",
      code: "background:#fce7f3;padding:2px 6px;border-radius:8px;font-size:0.88em;color:#be185d;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#fce7f3;border-radius:12px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fbcfe8;background:#ec4899;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fbcfe8;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 23
};
