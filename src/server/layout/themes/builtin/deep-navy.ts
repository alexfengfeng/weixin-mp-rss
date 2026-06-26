/**
 * 深海藏蓝主题
 * 深藏蓝主调、稳重专业，适合金融、法律、企业号内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#1e3a8a",
    "secondary": "#1e40af",
    "accent": "#2563eb",
    "text": "#1f2937",
    "muted": "#6b7280",
    "bg": "#fff",
    "surface": "#eff6ff",
    "border": "#bfdbfe",
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
    "scale": 1.5
  },
  "radius": {
    "sm": 2,
    "md": 4,
    "lg": 6
  }
};

export const deep_navyTheme: BuiltinTheme = {
  id: "deep_navy",
  name: "深海藏蓝",
  description: "深藏蓝主调、稳重专业，适合金融、法律、企业号内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#1e3a8a;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#1e3a8a;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#1e40af;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #bfdbfe;",
      img: "max-width:100%;height:auto;border-radius:4px;",
      strong: "color:#1e3a8a;font-weight:700;",
      a: "color:#2563eb;text-decoration:none;border-bottom:1px solid #bfdbfe;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #2563eb;background:#eff6ff;border-radius:0 4px 4px 0;color:#6b7280;",
      code: "background:#eff6ff;padding:2px 6px;border-radius:2px;font-size:0.88em;color:#1e40af;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#eff6ff;border-radius:4px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #bfdbfe;background:#2563eb;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #bfdbfe;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 24
};
