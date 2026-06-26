/**
 * 紫色梦幻主题
 * 适合创意、设计、艺术类公众号，紫色系梦幻氛围。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#4c1d95",
    secondary: "#6d28d9",
    accent: "#8b5cf6",
    text: "#1e1b4b",
    muted: "#a5b4fc",
    bg: "#faf5ff",
    surface: "#f3e8ff",
    border: "#e9d5ff",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444"
  },
  font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' },
  spacing: { unit: 8, scale: 1.5 },
  radius: { sm: 8, md: 12, lg: 20 }
};

export const purpleDreamTheme: BuiltinTheme = {
  id: "purple_dream",
  name: "紫色梦幻",
  description: "梦幻紫色调、大圆角，适合创意、设计、艺术类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#4c1d95;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#6d28d9;font-size:19px;line-height:1.5;font-weight:700;text-align:center;",
      h3: "margin:22px 0 8px;color:#4c1d95;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1e1b4b;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1e1b4b;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1e1b4b;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:2px dashed #e9d5ff;",
      img: "max-width:100%;height:auto;border-radius:20px;",
      strong: "color:#6d28d9;font-weight:700;",
      a: "color:#8b5cf6;text-decoration:none;border-bottom:1px solid #ddd6fe;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:4px solid #8b5cf6;background:#f3e8ff;border-radius:0 12px 12px 0;color:#6d28d9;font-style:italic;",
      code: "background:#f3e8ff;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#6d28d9;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#f3e8ff;border-radius:12px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e9d5ff;background:#8b5cf6;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #e9d5ff;color:#1e1b4b;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 11
};
