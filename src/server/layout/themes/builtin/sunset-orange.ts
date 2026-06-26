/**
 * 暖橙日落主题
 * 适合生活方式、亲子、美食类公众号，温暖橙色系。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#7c2d12",
    secondary: "#9a3412",
    accent: "#ea580c",
    text: "#292524",
    muted: "#a8a29e",
    bg: "#fffbeb",
    surface: "#fef3c7",
    border: "#fde68a",
    success: "#16a34a",
    warning: "#ea580c",
    danger: "#dc2626"
  },
  font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' },
  spacing: { unit: 8, scale: 1.55 },
  radius: { sm: 8, md: 12, lg: 16 }
};

export const sunsetOrangeTheme: BuiltinTheme = {
  id: "sunset_orange",
  name: "暖橙日落",
  description: "温暖橙色调，米黄背景，适合生活、亲子、美食类文章。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#7c2d12;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#9a3412;font-size:19px;line-height:1.5;font-weight:700;text-align:center;",
      h3: "margin:22px 0 8px;color:#7c2d12;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#292524;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#292524;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#292524;font-size:15px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;text-align:center;",
      img: "max-width:100%;height:auto;border-radius:12px;",
      strong: "color:#9a3412;font-weight:700;",
      a: "color:#ea580c;text-decoration:none;border-bottom:1px solid #fdba74;",
      blockquote: "margin:0 0 16px;padding:14px 18px;border-left:4px solid #ea580c;background:#fef3c7;border-radius:0 12px 12px 0;color:#9a3412;",
      code: "background:#fef3c7;padding:2px 6px;border-radius:6px;font-size:0.88em;color:#9a3412;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#fef3c7;border-radius:12px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #fde68a;background:#ea580c;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #fde68a;color:#292524;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "warm",
  sortOrder: 10
};
