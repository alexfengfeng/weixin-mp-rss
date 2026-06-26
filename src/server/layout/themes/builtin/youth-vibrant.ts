/**
 * 青春活力主题
 * 适合青年文化、潮流、校园类公众号，明亮活泼配色。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#7c3aed",
    secondary: "#db2777",
    accent: "#ec4899",
    text: "#18181b",
    muted: "#a1a1aa",
    bg: "#ffffff",
    surface: "#fdf4ff",
    border: "#f5d0fe",
    success: "#16a34a",
    warning: "#ea580c",
    danger: "#dc2626"
  },
  font: { baseSize: 15, scale: 1.28, family: '-apple-system, "PingFang SC", sans-serif' },
  spacing: { unit: 8, scale: 1.5 },
  radius: { sm: 8, md: 14, lg: 20 }
};

export const youthVibrantTheme: BuiltinTheme = {
  id: "youth_vibrant",
  name: "青春活力",
  description: "粉紫撞色、大圆角，适合青年文化、潮流、校园类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#7c3aed;font-size:26px;line-height:1.4;font-weight:800;text-align:center;",
      h2: "margin:28px 0 12px;color:#db2777;font-size:20px;line-height:1.5;font-weight:700;text-align:center;",
      h3: "margin:22px 0 8px;color:#7c3aed;font-size:17px;line-height:1.55;font-weight:700;",
      p: "margin:0 0 15px;color:#18181b;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#18181b;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#18181b;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:3px dashed #f5d0fe;",
      img: "max-width:100%;height:auto;border-radius:14px;",
      strong: "color:#db2777;font-weight:700;",
      a: "color:#ec4899;text-decoration:none;border-bottom:2px solid #f9a8d4;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:4px solid #ec4899;background:#fdf4ff;border-radius:0 14px 14px 0;color:#7c3aed;",
      code: "background:#fdf4ff;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#db2777;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#fdf4ff;border-radius:14px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #f5d0fe;background:#ec4899;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #f5d0fe;color:#18181b;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 15
};
