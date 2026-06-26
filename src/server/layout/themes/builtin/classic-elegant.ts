/**
 * 古典优雅主题
 * 适合传统文化、艺术评论、收藏类公众号，深棕衬线、对齐严谨。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#1c1917",
    secondary: "#44403c",
    accent: "#92400e",
    text: "#292524",
    muted: "#78716c",
    bg: "#fbf7f0",
    surface: "#f5ebe0",
    border: "#e7d8c4",
    success: "#65a30d",
    warning: "#ca8a04",
    danger: "#b91c1c"
  },
  font: { baseSize: 16, scale: 1.28, family: 'Georgia, "Songti SC", "Noto Serif SC", serif' },
  spacing: { unit: 8, scale: 1.6 },
  radius: { sm: 2, md: 4, lg: 6 }
};

export const classicElegantTheme: BuiltinTheme = {
  id: "classic_elegant",
  name: "古典优雅",
  description: "深棕衬线、米色纸张质感，适合传统文化、艺术评论类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 24px;color:#1c1917;font-size:26px;line-height:1.4;font-weight:700;text-align:center;letter-spacing:0.05em;",
      h2: "margin:32px 0 14px;color:#44403c;font-size:20px;line-height:1.5;font-weight:700;text-align:center;",
      h3: "margin:24px 0 10px;color:#1c1917;font-size:17px;line-height:1.55;font-weight:600;border-bottom:1px solid #e7d8c4;padding-bottom:4px;",
      p: "margin:0 0 18px;color:#292524;font-size:16px;line-height:2.0;text-indent:2em;",
      ul: "margin:0 0 18px;padding-left:2em;color:#292524;font-size:16px;line-height:1.9;",
      ol: "margin:0 0 18px;padding-left:2em;color:#292524;font-size:16px;line-height:1.9;",
      li: "margin:0 0 8px;text-indent:0;",
      hr: "margin:36px 0;border:0;border-top:1px solid #e7d8c4;",
      img: "max-width:100%;height:auto;border-radius:4px;border:1px solid #e7d8c4;",
      strong: "color:#1c1917;font-weight:700;",
      a: "color:#92400e;text-decoration:none;border-bottom:1px solid #d6c3a5;",
      blockquote: "margin:0 0 18px;padding:14px 22px;border-left:3px solid #92400e;background:#f5ebe0;border-radius:0 4px 4px 0;color:#57534e;font-style:italic;",
      code: "background:#f5ebe0;padding:2px 6px;border-radius:2px;font-size:0.88em;color:#92400e;font-family:monospace;",
      pre: "margin:0 0 18px;padding:16px;background:#f5ebe0;border-radius:4px;overflow-x:auto;border:1px solid #e7d8c4;",
      table: "width:100%;border-collapse:collapse;margin:0 0 18px;font-size:15px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e7d8c4;background:#92400e;color:#fbf7f0;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #e7d8c4;color:#292524;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 16
};
