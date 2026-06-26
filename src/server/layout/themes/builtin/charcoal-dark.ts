/**
 * 炭黑深邃主题
 * 炭黑深色背景、白色文字，适合科技、极客、夜间阅读。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#e5e7eb",
    "secondary": "#d1d5db",
    "accent": "#60a5fa",
    "text": "#f3f4f6",
    "muted": "#9ca3af",
    "bg": "#111827",
    "surface": "#1f2937",
    "border": "#374151",
    "success": "#34d399",
    "warning": "#fbbf24",
    "danger": "#f87171"
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

export const charcoal_darkTheme: BuiltinTheme = {
  id: "charcoal_dark",
  name: "炭黑深邃",
  description: "炭黑深色背景、白色文字，适合科技、极客、夜间阅读。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#e5e7eb;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#e5e7eb;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#d1d5db;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#f3f4f6;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#f3f4f6;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#f3f4f6;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #374151;",
      img: "max-width:100%;height:auto;border-radius:6px;",
      strong: "color:#e5e7eb;font-weight:700;",
      a: "color:#60a5fa;text-decoration:none;border-bottom:1px solid #374151;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #60a5fa;background:#1f2937;border-radius:0 6px 6px 0;color:#9ca3af;",
      code: "background:#1f2937;padding:2px 6px;border-radius:4px;font-size:0.88em;color:#d1d5db;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#1f2937;border-radius:6px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #374151;background:#60a5fa;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #374151;color:#f3f4f6;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "dark",
  sortOrder: 39
};
