/**
 * 现代渐变主题
 * 适合 SaaS、互联网产品类公众号，使用渐变色装饰强调现代感。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#0f172a",
    secondary: "#334155",
    accent: "#6366f1",
    text: "#1e293b",
    muted: "#94a3b8",
    bg: "#ffffff",
    surface: "#f8fafc",
    border: "#e2e8f0",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444"
  },
  font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' },
  spacing: { unit: 8, scale: 1.5 },
  radius: { sm: 6, md: 10, lg: 14 }
};

export const modernGradientTheme: BuiltinTheme = {
  id: "modern_gradient",
  name: "现代渐变",
  description: "渐变装饰、靛蓝强调，适合 SaaS、互联网产品类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#0f172a;font-size:25px;line-height:1.4;font-weight:700;background:linear-gradient(90deg,#6366f1,#8b5cf6);-webkit-background-clip:text;background-clip:text;color:transparent;",
      h2: "margin:30px 0 12px;color:#0f172a;font-size:19px;line-height:1.5;font-weight:700;padding:8px 14px;background:linear-gradient(90deg,#eef2ff,#faf5ff);border-radius:0 10px 10px 0;border-left:4px solid #6366f1;",
      h3: "margin:22px 0 8px;color:#334155;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1e293b;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1e293b;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1e293b;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;height:2px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899);",
      img: "max-width:100%;height:auto;border-radius:10px;",
      strong: "color:#6366f1;font-weight:700;",
      a: "color:#6366f1;text-decoration:none;border-bottom:1px solid #c7d2fe;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:4px solid #6366f1;background:linear-gradient(90deg,#eef2ff,#ffffff);border-radius:0 10px 10px 0;color:#475569;",
      code: "background:#eef2ff;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#6366f1;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#0f172a;color:#e2e8f0;border-radius:10px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e2e8f0;background:linear-gradient(90deg,#6366f1,#8b5cf6);color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #e2e8f0;color:#1e293b;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 17
};
