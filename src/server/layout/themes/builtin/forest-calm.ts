/**
 * 森林宁静主题
 * 适合户外、自然、环保、冥想类公众号，墨绿主调。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#14532d",
    secondary: "#166534",
    accent: "#15803d",
    text: "#1f2937",
    muted: "#9ca3af",
    bg: "#f7faf7",
    surface: "#ecfdf5",
    border: "#d1d7d1",
    success: "#15803d",
    warning: "#ca8a04",
    danger: "#b91c1c"
  },
  font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' },
  spacing: { unit: 8, scale: 1.55 },
  radius: { sm: 4, md: 8, lg: 12 }
};

export const forestCalmTheme: BuiltinTheme = {
  id: "forest_calm",
  name: "森林宁静",
  description: "墨绿主调、低饱和度，适合户外、自然、环保、冥想类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#14532d;font-size:24px;line-height:1.4;font-weight:700;",
      h2: "margin:30px 0 12px;color:#166534;font-size:19px;line-height:1.5;font-weight:700;padding-bottom:6px;border-bottom:1px solid #d1d7d1;",
      h3: "margin:22px 0 8px;color:#14532d;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 16px;color:#1f2937;font-size:15px;line-height:1.95;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.9;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#1f2937;font-size:15px;line-height:1.9;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #d1d7d1;",
      img: "max-width:100%;height:auto;border-radius:8px;",
      strong: "color:#166534;font-weight:700;",
      a: "color:#15803d;text-decoration:none;border-bottom:1px solid #86efac;",
      blockquote: "margin:0 0 16px;padding:14px 18px;border-left:3px solid #15803d;background:#ecfdf5;border-radius:0 8px 8px 0;color:#166534;font-style:italic;",
      code: "background:#ecfdf5;padding:2px 6px;border-radius:4px;font-size:0.88em;color:#166534;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#ecfdf5;border-radius:8px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #d1d7d1;background:#14532d;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #d1d7d1;color:#1f2937;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 18
};
