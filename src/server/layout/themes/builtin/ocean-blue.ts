/**
 * 海洋蓝调主题
 * 适合教育、科技、出海类公众号，深蓝主调专业感强。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#0c4a6e",
    secondary: "#075985",
    accent: "#0284c7",
    text: "#1e293b",
    muted: "#94a3b8",
    bg: "#ffffff",
    surface: "#f0f9ff",
    border: "#bae6fd",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444"
  },
  font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' },
  spacing: { unit: 8, scale: 1.5 },
  radius: { sm: 6, md: 8, lg: 12 }
};

export const oceanBlueTheme: BuiltinTheme = {
  id: "ocean_blue",
  name: "海洋蓝调",
  description: "深蓝主调，专业稳重，适合教育、科技、出海类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#0c4a6e;font-size:25px;line-height:1.38;font-weight:700;border-bottom:3px solid #0284c7;padding-bottom:10px;",
      h2: "margin:30px 0 12px;color:#075985;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#0c4a6e;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1e293b;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1e293b;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1e293b;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #bae6fd;",
      img: "max-width:100%;height:auto;border-radius:8px;border:1px solid #bae6fd;",
      strong: "color:#075985;font-weight:700;",
      a: "color:#0284c7;text-decoration:none;border-bottom:1px solid #7dd3fc;",
      blockquote: "margin:0 0 16px;padding:14px 18px;border-left:4px solid #0284c7;background:#f0f9ff;border-radius:0 8px 8px 0;color:#075985;",
      code: "background:#f0f9ff;padding:2px 6px;border-radius:4px;font-size:0.88em;color:#0284c7;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#f0f9ff;border-radius:8px;overflow-x:auto;border-left:3px solid #0284c7;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #bae6fd;background:#0284c7;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #bae6fd;color:#1e293b;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 9
};
