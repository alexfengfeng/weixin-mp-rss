/**
 * 商务专业主题
 * 适合企业号、B2B、财经类公众号，深蓝灰主调，结构严谨。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#1e293b",
    secondary: "#334155",
    accent: "#1e40af",
    text: "#1e293b",
    muted: "#94a3b8",
    bg: "#ffffff",
    surface: "#f8fafc",
    border: "#cbd5e1",
    success: "#15803d",
    warning: "#b45309",
    danger: "#b91c1c"
  },
  font: { baseSize: 15, scale: 1.22, family: '-apple-system, "Helvetica Neue", Arial, "PingFang SC", sans-serif' },
  spacing: { unit: 8, scale: 1.45 },
  radius: { sm: 3, md: 4, lg: 6 }
};

export const businessProTheme: BuiltinTheme = {
  id: "business_pro",
  name: "商务专业",
  description: "深蓝灰主调、结构严谨，适合企业号、B2B、财经类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#1e293b;font-size:24px;line-height:1.4;font-weight:700;border-bottom:2px solid #1e40af;padding-bottom:8px;",
      h2: "margin:30px 0 12px;color:#1e293b;font-size:18px;line-height:1.5;font-weight:700;border-left:3px solid #1e40af;padding-left:10px;",
      h3: "margin:22px 0 8px;color:#334155;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 14px;color:#1e293b;font-size:15px;line-height:1.85;",
      ul: "margin:0 0 14px;padding-left:1.2em;color:#1e293b;font-size:15px;line-height:1.8;",
      ol: "margin:0 0 14px;padding-left:1.35em;color:#1e293b;font-size:15px;line-height:1.8;",
      li: "margin:0 0 5px;",
      hr: "margin:26px 0;border:0;border-top:1px solid #cbd5e1;",
      img: "max-width:100%;height:auto;border-radius:4px;",
      strong: "color:#1e40af;font-weight:700;",
      a: "color:#1e40af;text-decoration:none;border-bottom:1px solid #93c5fd;",
      blockquote: "margin:0 0 14px;padding:12px 16px;border-left:3px solid #cbd5e1;background:#f8fafc;border-radius:0 4px 4px 0;color:#475569;",
      code: "background:#f1f5f9;padding:2px 6px;border-radius:3px;font-size:0.88em;color:#1e40af;font-family:monospace;",
      pre: "margin:0 0 14px;padding:14px;background:#f1f5f9;border-radius:4px;overflow-x:auto;border:1px solid #cbd5e1;",
      table: "width:100%;border-collapse:collapse;margin:0 0 14px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #cbd5e1;background:#1e293b;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #cbd5e1;color:#1e293b;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 14
};
