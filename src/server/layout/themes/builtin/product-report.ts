/**
 * 产品报告主题
 * 迁移自 presets.ts 的 product_report，扩展模块样式。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#0f172a",
    secondary: "#334155",
    accent: "#2563eb",
    text: "#334155",
    muted: "#64748b",
    bg: "#ffffff",
    surface: "#eff6ff",
    border: "#bfdbfe",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444"
  },
  font: { baseSize: 15, scale: 1.27, family: "system-ui, sans-serif" },
  spacing: { unit: 8, scale: 1.5 },
  radius: { sm: 4, md: 10, lg: 12 }
};

export const productReportTheme: BuiltinTheme = {
  id: "product_report",
  name: "产品报告",
  description: "蓝灰强调，适合产品分析、效率工具和 AI 产品文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#0f172a;font-size:25px;line-height:1.34;font-weight:800;",
      h2: "margin:34px 0 14px;padding:8px 12px;background:#eff6ff;border-left:4px solid #2563eb;color:#1e3a8a;font-size:19px;line-height:1.45;font-weight:800;",
      h3: "margin:24px 0 10px;color:#1d4ed8;font-size:16px;line-height:1.55;font-weight:750;",
      p: "margin:0 0 16px;color:#334155;font-size:15px;line-height:1.92;",
      ul: "margin:0 0 18px;padding-left:1.2em;color:#334155;font-size:15px;line-height:1.88;",
      ol: "margin:0 0 18px;padding-left:1.4em;color:#334155;font-size:15px;line-height:1.88;",
      li: "margin:0 0 8px;",
      hr: "margin:30px 0;border:0;border-top:1px solid #bfdbfe;",
      img: "max-width:100%;height:auto;border-radius:10px;border:1px solid #dbeafe;",
      strong: "color:#1d4ed8;font-weight:800;",
      a: "color:#1d4ed8;text-decoration:none;border-bottom:1px solid #93c5fd;",
      blockquote: "margin:0 0 16px;padding:12px 16px;border-left:4px solid #2563eb;background:#eff6ff;border-radius:0 8px 8px 0;color:#1e40af;",
      code: "background:#eff6ff;padding:2px 6px;border-radius:4px;font-size:0.88em;font-family:monospace;color:#1e40af;",
      pre: "margin:0 0 16px;padding:16px;background:#eff6ff;border-radius:10px;overflow-x:auto;border:1px solid #dbeafe;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #bfdbfe;background:#eff6ff;font-weight:700;color:#1e3a8a;",
      td: "padding:8px 12px;border:1px solid #dbeafe;color:#334155;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 1
};
