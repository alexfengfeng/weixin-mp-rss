/**
 * 玫瑰优雅主题
 * 适合美妆、时尚、女性向公众号，玫粉主调、温柔装饰。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#831843",
    secondary: "#9f1239",
    accent: "#e11d48",
    text: "#1f2937",
    muted: "#9ca3af",
    bg: "#fff1f5",
    surface: "#ffe4e6",
    border: "#fecdd3",
    success: "#16a34a",
    warning: "#ea580c",
    danger: "#be123c"
  },
  font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' },
  spacing: { unit: 8, scale: 1.55 },
  radius: { sm: 8, md: 12, lg: 16 }
};

export const roseElegantTheme: BuiltinTheme = {
  id: "rose_elegant",
  name: "玫瑰优雅",
  description: "玫粉色调、温柔装饰，适合美妆、时尚、女性向文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#831843;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#9f1239;font-size:19px;line-height:1.5;font-weight:700;text-align:center;padding-bottom:6px;border-bottom:2px dotted #fecdd3;",
      h3: "margin:22px 0 8px;color:#831843;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:2px dotted #fecdd3;",
      img: "max-width:100%;height:auto;border-radius:12px;",
      strong: "color:#9f1239;font-weight:700;",
      a: "color:#e11d48;text-decoration:none;border-bottom:1px solid #fda4af;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:4px solid #e11d48;background:#ffe4e6;border-radius:0 12px 12px 0;color:#9f1239;font-style:italic;",
      code: "background:#ffe4e6;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#9f1239;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#ffe4e6;border-radius:12px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fecdd3;background:#e11d48;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fecdd3;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 19
};
