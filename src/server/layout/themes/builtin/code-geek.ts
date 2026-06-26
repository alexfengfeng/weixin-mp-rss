/**
 * 极客代码主题
 * 适合技术教程、开源项目、编程类公众号，深绿强调色，等宽字体。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#0a0a0a",
    secondary: "#262626",
    accent: "#22c55e",
    text: "#171717",
    muted: "#737373",
    bg: "#ffffff",
    surface: "#f5f5f5",
    border: "#e5e5e5",
    success: "#22c55e",
    warning: "#eab308",
    danger: "#dc2626"
  },
  font: { baseSize: 15, scale: 1.2, family: '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace' },
  spacing: { unit: 8, scale: 1.4 },
  radius: { sm: 4, md: 6, lg: 8 }
};

export const codeGeekTheme: BuiltinTheme = {
  id: "code_geek",
  name: "极客代码",
  description: "等宽字体、绿色终端风，适合技术教程、开源项目类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 20px;color:#0a0a0a;font-size:23px;line-height:1.4;font-weight:700;font-family:monospace;",
      h2: "margin:28px 0 12px;color:#0a0a0a;font-size:18px;line-height:1.5;font-weight:700;font-family:monospace;padding:4px 8px;background:#f5f5f5;border-left:3px solid #22c55e;",
      h3: "margin:22px 0 8px;color:#262626;font-size:16px;line-height:1.55;font-weight:700;font-family:monospace;",
      p: "margin:0 0 15px;color:#171717;font-size:15px;line-height:1.85;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#171717;font-size:15px;line-height:1.8;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#171717;font-size:15px;line-height:1.8;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px dashed #d4d4d4;",
      img: "max-width:100%;height:auto;border-radius:6px;border:1px solid #e5e5e5;",
      strong: "color:#22c55e;font-weight:700;",
      a: "color:#22c55e;text-decoration:none;border-bottom:1px dashed #86efac;",
      blockquote: "margin:0 0 16px;padding:12px 16px;border-left:3px solid #22c55e;background:#f5f5f5;border-radius:0 6px 6px 0;color:#525252;font-family:monospace;",
      code: "background:#0a0a0a;color:#22c55e;padding:2px 6px;border-radius:4px;font-size:0.88em;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#0a0a0a;color:#e5e5e5;border-radius:6px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #e5e5e5;background:#0a0a0a;color:#22c55e;font-weight:700;font-family:monospace;",
      td: "padding:8px 12px;border:1px solid #e5e5e5;color:#171717;font-family:monospace;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 13
};
