/**
 * 复古纸张主题
 * 适合历史、人文、读书笔记类公众号，米黄纸张质感。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#451a03",
    secondary: "#78350f",
    accent: "#b45309",
    text: "#422006",
    muted: "#a16207",
    bg: "#fefce8",
    surface: "#fef9c3",
    border: "#fde68a",
    success: "#65a30d",
    warning: "#ca8a04",
    danger: "#b91c1c"
  },
  font: { baseSize: 16, scale: 1.25, family: 'Georgia, "Songti SC", "Noto Serif SC", serif' },
  spacing: { unit: 8, scale: 1.6 },
  radius: { sm: 2, md: 4, lg: 6 }
};

export const vintagePaperTheme: BuiltinTheme = {
  id: "vintage_paper",
  name: "复古纸张",
  description: "米黄纸张质感、衬线字体，适合历史、人文、读书笔记类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 24px;color:#451a03;font-size:26px;line-height:1.4;font-weight:700;text-align:center;border-bottom:2px double #b45309;padding-bottom:12px;",
      h2: "margin:32px 0 14px;color:#78350f;font-size:20px;line-height:1.5;font-weight:700;text-align:center;",
      h3: "margin:24px 0 10px;color:#451a03;font-size:17px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 18px;color:#422006;font-size:16px;line-height:2.0;text-indent:2em;",
      ul: "margin:0 0 18px;padding-left:2em;color:#422006;font-size:16px;line-height:1.9;",
      ol: "margin:0 0 18px;padding-left:2em;color:#422006;font-size:16px;line-height:1.9;",
      li: "margin:0 0 8px;text-indent:0;",
      hr: "margin:36px 0;border:0;text-align:center;",
      img: "max-width:100%;height:auto;border-radius:4px;border:1px solid #fde68a;",
      strong: "color:#451a03;font-weight:700;",
      a: "color:#b45309;text-decoration:none;border-bottom:1px solid #fcd34d;",
      blockquote: "margin:0 0 18px;padding:14px 20px;border-left:3px solid #b45309;background:#fef9c3;border-radius:0 4px 4px 0;color:#78350f;font-style:italic;",
      code: "background:#fef9c3;padding:2px 6px;border-radius:2px;font-size:0.88em;color:#78350f;font-family:monospace;",
      pre: "margin:0 0 18px;padding:16px;background:#fef9c3;border-radius:4px;overflow-x:auto;border:1px solid #fde68a;",
      table: "width:100%;border-collapse:collapse;margin:0 0 18px;font-size:15px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fde68a;background:#b45309;color:#fefce8;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fde68a;color:#422006;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 12
};
