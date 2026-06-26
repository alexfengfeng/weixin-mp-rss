/**
 * 温和专栏主题
 * 迁移自 presets.ts 的 warm_column，扩展模块样式。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#7c2d12",
    secondary: "#9a3412",
    accent: "#c2410c",
    text: "#44403c",
    muted: "#a8a29e",
    bg: "#ffffff",
    surface: "#fff7ed",
    border: "#fed7aa",
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626"
  },
  font: { baseSize: 15, scale: 1.25, family: "Georgia, serif" },
  spacing: { unit: 8, scale: 1.5 },
  radius: { sm: 6, md: 12, lg: 16 }
};

export const warmColumnTheme: BuiltinTheme = {
  id: "warm_column",
  name: "温和专栏",
  description: "暖色标题和柔和分隔，适合个人表达、复盘和随笔。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#7c2d12;font-size:24px;line-height:1.38;font-weight:760;",
      h2: "margin:32px 0 13px;color:#9a3412;font-size:19px;line-height:1.5;font-weight:740;border-bottom:1px solid #fed7aa;padding-bottom:6px;",
      h3: "margin:22px 0 9px;color:#b45309;font-size:16px;line-height:1.55;font-weight:700;",
      p: "margin:0 0 16px;color:#44403c;font-size:15px;line-height:1.96;",
      ul: "margin:0 0 18px;padding-left:1.2em;color:#44403c;font-size:15px;line-height:1.9;",
      ol: "margin:0 0 18px;padding-left:1.4em;color:#44403c;font-size:15px;line-height:1.9;",
      li: "margin:0 0 8px;",
      hr: "margin:30px 0;border:0;border-top:1px dashed #fdba74;",
      img: "max-width:100%;height:auto;border-radius:12px;",
      strong: "color:#9a3412;font-weight:760;",
      a: "color:#c2410c;text-decoration:none;border-bottom:1px solid #fdba74;",
      blockquote: "margin:0 0 16px;padding:12px 16px;border-left:4px solid #fdba74;background:#fff7ed;border-radius:0 12px 12px 0;color:#9a3412;",
      code: "background:#fff7ed;padding:2px 6px;border-radius:6px;font-size:0.88em;font-family:monospace;color:#9a3412;",
      pre: "margin:0 0 16px;padding:16px;background:#fff7ed;border-radius:12px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fed7aa;background:#fff7ed;font-weight:700;color:#7c2d12;",
      td: "padding:8px 12px;border:1px solid #fed7aa;color:#44403c;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 2
};
