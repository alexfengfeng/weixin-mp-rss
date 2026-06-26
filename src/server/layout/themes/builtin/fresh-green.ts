/**
 * 清新绿意主题
 * 适合健康、生活、自然类公众号，绿色系配色。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#064e3b",
    secondary: "#047857",
    accent: "#10b981",
    text: "#1f2937",
    muted: "#9ca3af",
    bg: "#ffffff",
    surface: "#ecfdf5",
    border: "#d1fae5",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444"
  },
  font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' },
  spacing: { unit: 8, scale: 1.5 },
  radius: { sm: 6, md: 10, lg: 14 }
};

export const freshGreenTheme: BuiltinTheme = {
  id: "fresh_green",
  name: "清新绿意",
  description: "柔和绿色系，圆角设计，适合健康、生活、自然类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 20px;color:#064e3b;font-size:24px;line-height:1.4;font-weight:700;",
      h2: "margin:28px 0 12px;color:#047857;font-size:19px;line-height:1.5;font-weight:700;padding-left:12px;border-left:4px solid #10b981;",
      h3: "margin:22px 0 8px;color:#064e3b;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:2px dashed #d1fae5;",
      img: "max-width:100%;height:auto;border-radius:10px;",
      strong: "color:#047857;font-weight:700;",
      a: "color:#10b981;text-decoration:none;border-bottom:1px solid #a7f3d0;",
      blockquote: "margin:0 0 16px;padding:14px 18px;border-left:4px solid #10b981;background:#ecfdf5;border-radius:0 10px 10px 0;color:#047857;",
      code: "background:#ecfdf5;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#047857;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#ecfdf5;border-radius:10px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #d1fae5;background:#10b981;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #d1fae5;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 8
};
