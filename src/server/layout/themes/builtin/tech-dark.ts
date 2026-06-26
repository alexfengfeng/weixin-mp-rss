/**
 * 科技深色主题
 * 适合科技、AI、极客类公众号文章，深色背景突出对比。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#f8fafc",
    secondary: "#cbd5e1",
    accent: "#38bdf8",
    text: "#e2e8f0",
    muted: "#64748b",
    bg: "#0f172a",
    surface: "#1e293b",
    border: "#334155",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444"
  },
  font: { baseSize: 15, scale: 1.25, family: '-apple-system, "SF Mono", "JetBrains Mono", monospace, sans-serif' },
  spacing: { unit: 8, scale: 1.5 },
  radius: { sm: 4, md: 8, lg: 12 }
};

export const techDarkTheme: BuiltinTheme = {
  id: "tech_dark",
  name: "科技深色",
  description: "深色背景、青蓝强调色，适合科技、AI、极客类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 20px;color:#f8fafc;font-size:24px;line-height:1.4;font-weight:700;border-left:4px solid #38bdf8;padding-left:12px;",
      h2: "margin:30px 0 12px;color:#f8fafc;font-size:19px;line-height:1.5;font-weight:650;",
      h3: "margin:22px 0 8px;color:#cbd5e1;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#e2e8f0;font-size:15px;line-height:1.85;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#e2e8f0;font-size:15px;line-height:1.8;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#e2e8f0;font-size:15px;line-height:1.8;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #334155;",
      img: "max-width:100%;height:auto;border-radius:8px;",
      strong: "color:#38bdf8;font-weight:700;",
      a: "color:#38bdf8;text-decoration:none;border-bottom:1px dashed #38bdf8;",
      blockquote: "margin:0 0 16px;padding:14px 18px;border-left:3px solid #38bdf8;background:#1e293b;border-radius:0 8px 8px 0;color:#94a3b8;",
      code: "background:#334155;padding:2px 6px;border-radius:4px;font-size:0.88em;color:#38bdf8;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#1e293b;border-radius:8px;overflow-x:auto;border:1px solid #334155;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #334155;background:#1e293b;font-weight:700;color:#f8fafc;",
      td: "padding:8px 12px;border:1px solid #334155;color:#e2e8f0;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "dark",
  sortOrder: 6
};
