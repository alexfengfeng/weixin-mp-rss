/**
 * 彩虹缤纷主题
 * 多彩配色、活泼有趣，适合亲子、教育、活动推广类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#7c3aed",
    "secondary": "#2563eb",
    "accent": "#f59e0b",
    "text": "#1f2937",
    "muted": "#6b7280",
    "bg": "#fff",
    "surface": "#fef3c7",
    "border": "#fde68a",
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
    "sm": 8,
    "md": 12,
    "lg": 16
  }
};

export const rainbow_vibrantTheme: BuiltinTheme = {
  id: "rainbow_vibrant",
  name: "彩虹缤纷",
  description: "多彩配色、活泼有趣，适合亲子、教育、活动推广类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#7c3aed;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#7c3aed;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#2563eb;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #fde68a;",
      img: "max-width:100%;height:auto;border-radius:12px;",
      strong: "color:#7c3aed;font-weight:700;",
      a: "color:#f59e0b;text-decoration:none;border-bottom:1px solid #fde68a;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #f59e0b;background:#fef3c7;border-radius:0 12px 12px 0;color:#6b7280;",
      code: "background:#fef3c7;padding:2px 6px;border-radius:8px;font-size:0.88em;color:#2563eb;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#fef3c7;border-radius:12px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fde68a;background:#f59e0b;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fde68a;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 42
};
