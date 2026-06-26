/**
 * 墨韵随笔主题（新增）
 * 适合文学、随笔、散文类公众号文章，衬线字体，柔和米色背景。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#1c1917",
    secondary: "#44403c",
    accent: "#78716c",
    text: "#44403c",
    muted: "#a8a29e",
    bg: "#fefcf9",
    surface: "#f5f1eb",
    border: "#e7e0d5",
    success: "#65a30d",
    warning: "#ca8a04",
    danger: "#b91c1c"
  },
  font: { baseSize: 16, scale: 1.25, family: 'Georgia, "Songti SC", "Noto Serif SC", serif' },
  spacing: { unit: 8, scale: 1.6 },
  radius: { sm: 2, md: 4, lg: 6 }
};

export const inkEssayTheme: BuiltinTheme = {
  id: "ink_essay",
  name: "墨韵随笔",
  description: "衬线字体、米色背景，适合文学、随笔和散文类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 24px;color:#1c1917;font-size:26px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:36px 0 14px;color:#1c1917;font-size:20px;line-height:1.5;font-weight:700;text-align:center;",
      h3: "margin:28px 0 10px;color:#44403c;font-size:17px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 18px;color:#44403c;font-size:16px;line-height:2.0;text-indent:2em;",
      ul: "margin:0 0 18px;padding-left:2em;color:#44403c;font-size:16px;line-height:1.9;",
      ol: "margin:0 0 18px;padding-left:2em;color:#44403c;font-size:16px;line-height:1.9;",
      li: "margin:0 0 8px;text-indent:0;",
      hr: "margin:36px 0;border:0;border-top:1px solid #e7e0d5;",
      img: "max-width:100%;height:auto;border-radius:4px;display:block;margin:0 auto;",
      strong: "color:#1c1917;font-weight:700;",
      a: "color:#78716c;text-decoration:none;border-bottom:1px solid #d6d3d1;",
      blockquote: "margin:0 0 18px;padding:14px 20px;border-left:3px solid #e7e0d5;background:#f5f1eb;border-radius:0 4px 4px 0;color:#78716c;font-style:italic;",
      code: "background:#f5f1eb;padding:2px 6px;border-radius:2px;font-size:0.88em;font-family:monospace;color:#44403c;",
      pre: "margin:0 0 18px;padding:16px;background:#f5f1eb;border-radius:4px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 18px;font-size:15px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e7e0d5;background:#f5f1eb;font-weight:700;color:#1c1917;",
      td: "padding:8px 12px;border:1px solid #e7e0d5;color:#44403c;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 5
};
