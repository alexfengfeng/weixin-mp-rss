/**
 * 极简黑白主题
 * 纯黑白配色，极致克制，适合深度长文、行业观察。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#000000",
    secondary: "#1f1f1f",
    accent: "#000000",
    text: "#1a1a1a",
    muted: "#999999",
    bg: "#ffffff",
    surface: "#fafafa",
    border: "#e5e5e5",
    success: "#000000",
    warning: "#666666",
    danger: "#000000"
  },
  font: { baseSize: 16, scale: 1.3, family: '-apple-system, "Helvetica Neue", Arial, sans-serif' },
  spacing: { unit: 8, scale: 1.6 },
  radius: { sm: 0, md: 0, lg: 0 }
};

export const minimalMonoTheme: BuiltinTheme = {
  id: "minimal_mono",
  name: "极简黑白",
  description: "纯黑白配色、零圆角、极致克制，适合深度长文和行业观察。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 24px;color:#000000;font-size:28px;line-height:1.35;font-weight:800;letter-spacing:-0.02em;",
      h2: "margin:36px 0 12px;color:#000000;font-size:20px;line-height:1.4;font-weight:700;border-bottom:2px solid #000;padding-bottom:6px;",
      h3: "margin:24px 0 8px;color:#1f1f1f;font-size:17px;line-height:1.5;font-weight:700;",
      p: "margin:0 0 18px;color:#1a1a1a;font-size:16px;line-height:1.9;",
      ul: "margin:0 0 18px;padding-left:1.2em;color:#1a1a1a;font-size:16px;line-height:1.85;",
      ol: "margin:0 0 18px;padding-left:1.35em;color:#1a1a1a;font-size:16px;line-height:1.85;",
      li: "margin:0 0 8px;",
      hr: "margin:36px 0;border:0;border-top:1px solid #000;",
      img: "max-width:100%;height:auto;",
      strong: "color:#000000;font-weight:800;",
      a: "color:#000000;text-decoration:underline;text-underline-offset:3px;",
      blockquote: "margin:0 0 18px;padding:8px 0 8px 20px;border-left:3px solid #000;color:#666;font-style:normal;",
      code: "background:#fafafa;padding:2px 6px;border:1px solid #e5e5e5;font-size:0.88em;font-family:monospace;",
      pre: "margin:0 0 18px;padding:16px;background:#fafafa;border:1px solid #e5e5e5;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 18px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #000;background:#000;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #000;color:#1a1a1a;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 7
};
