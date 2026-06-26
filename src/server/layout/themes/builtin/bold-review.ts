/**
 * 评测强调主题
 * 迁移自 presets.ts 的 bold_review，扩展模块样式。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#020617",
    secondary: "#1f2937",
    accent: "#dc2626",
    text: "#1f2937",
    muted: "#6b7280",
    bg: "#ffffff",
    surface: "#fef2f2",
    border: "#fecaca",
    success: "#16a34a",
    warning: "#f59e0b",
    danger: "#ef4444"
  },
  font: { baseSize: 15, scale: 1.3, family: "system-ui, sans-serif" },
  spacing: { unit: 8, scale: 1.5 },
  radius: { sm: 4, md: 8, lg: 12 }
};

export const boldReviewTheme: BuiltinTheme = {
  id: "bold_review",
  name: "评测强调",
  description: "强标题、重点突出，适合工具评测和方案对比。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 24px;color:#020617;font-size:27px;line-height:1.3;font-weight:850;",
      h2: "margin:34px 0 14px;color:#020617;font-size:20px;line-height:1.42;font-weight:820;border-left:5px solid #ef4444;padding-left:10px;",
      h3: "margin:24px 0 10px;color:#991b1b;font-size:17px;line-height:1.5;font-weight:780;",
      p: "margin:0 0 16px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 18px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.86;",
      ol: "margin:0 0 18px;padding-left:1.4em;color:#1f2937;font-size:15px;line-height:1.86;",
      li: "margin:0 0 8px;",
      hr: "margin:32px 0;border:0;border-top:2px solid #fecaca;",
      img: "max-width:100%;height:auto;border-radius:8px;border:1px solid #fee2e2;",
      strong: "color:#b91c1c;font-weight:850;",
      a: "color:#dc2626;text-decoration:none;border-bottom:1px solid #fca5a5;",
      blockquote: "margin:0 0 16px;padding:12px 16px;border-left:4px solid #ef4444;background:#fef2f2;border-radius:0 8px 8px 0;color:#991b1b;",
      code: "background:#fef2f2;padding:2px 6px;border-radius:4px;font-size:0.88em;font-family:monospace;color:#b91c1c;",
      pre: "margin:0 0 16px;padding:16px;background:#fef2f2;border-radius:8px;overflow-x:auto;border:1px solid #fee2e2;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fecaca;background:#fef2f2;font-weight:700;color:#020617;",
      td: "padding:8px 12px;border:1px solid #fee2e2;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 4
};
