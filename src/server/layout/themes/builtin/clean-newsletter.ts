/**
 * 简洁通讯主题
 * 迁移自 presets.ts 的 clean_newsletter，扩展模块样式。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#111827",
    secondary: "#374151",
    accent: "#2563eb",
    text: "#374151",
    muted: "#9ca3af",
    bg: "#ffffff",
    surface: "#f8fafc",
    border: "#e5e7eb",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444"
  },
  font: { baseSize: 15, scale: 1.25, family: "system-ui, sans-serif" },
  spacing: { unit: 8, scale: 1.5 },
  radius: { sm: 6, md: 8, lg: 12 }
};

export const cleanNewsletterTheme: BuiltinTheme = {
  id: "clean_newsletter",
  name: "简洁通讯",
  description: "黑白灰、低装饰，适合稳定更新的知识通讯。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 20px;color:#111827;font-size:24px;line-height:1.38;font-weight:750;",
      h2: "margin:30px 0 12px;color:#111827;font-size:18px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#374151;font-size:16px;line-height:1.55;font-weight:700;",
      p: "margin:0 0 15px;color:#374151;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#374151;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#374151;font-size:15px;line-height:1.85;",
      li: "margin:0 0 7px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #e5e7eb;",
      img: "max-width:100%;height:auto;border-radius:6px;",
      strong: "color:#111827;font-weight:750;",
      a: "color:#2563eb;text-decoration:none;border-bottom:1px solid #bfdbfe;",
      blockquote: "margin:0 0 16px;padding:12px 16px;border-left:4px solid #e5e7eb;background:#f8fafc;border-radius:0 6px 6px 0;color:#6b7280;",
      code: "background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:0.88em;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#f3f4f6;border-radius:8px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e5e7eb;background:#f8fafc;font-weight:700;color:#111827;",
      td: "padding:8px 12px;border:1px solid #e5e7eb;color:#374151;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 0
};
