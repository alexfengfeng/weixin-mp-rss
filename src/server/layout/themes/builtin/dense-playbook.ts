/**
 * 紧凑手册主题
 * 迁移自 presets.ts 的 dense_playbook，扩展模块样式。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  colors: {
    primary: "#111827",
    secondary: "#374151",
    accent: "#1d4ed8",
    text: "#374151",
    muted: "#9ca3af",
    bg: "#ffffff",
    surface: "#f9fafb",
    border: "#d1d5db",
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626"
  },
  font: { baseSize: 14, scale: 1.2, family: "system-ui, sans-serif" },
  spacing: { unit: 6, scale: 1.4 },
  radius: { sm: 4, md: 6, lg: 8 }
};

export const densePlaybookTheme: BuiltinTheme = {
  id: "dense_playbook",
  name: "紧凑手册",
  description: "高密度、强步骤感，适合教程、清单和 SOP。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 14px;color:#111827;font-size:22px;line-height:1.3;font-weight:800;",
      h2: "margin:22px 0 8px;color:#111827;font-size:17px;line-height:1.4;font-weight:760;",
      h3: "margin:18px 0 6px;color:#374151;font-size:15px;line-height:1.42;font-weight:720;",
      p: "margin:0 0 10px;color:#374151;font-size:14px;line-height:1.72;",
      ul: "margin:0 0 12px;padding-left:1.15em;color:#374151;font-size:14px;line-height:1.7;",
      ol: "margin:0 0 12px;padding-left:1.35em;color:#374151;font-size:14px;line-height:1.7;",
      li: "margin:0 0 4px;",
      hr: "margin:18px 0;border:0;border-top:1px dashed #d1d5db;",
      img: "max-width:100%;height:auto;border-radius:4px;",
      strong: "color:#111827;font-weight:780;background:#fef3c7;padding:0 2px;",
      a: "color:#1d4ed8;text-decoration:none;",
      blockquote: "margin:0 0 12px;padding:8px 12px;border-left:3px solid #d1d5db;background:#f9fafb;border-radius:0 4px 4px 0;color:#6b7280;",
      code: "background:#f3f4f6;padding:1px 5px;border-radius:3px;font-size:0.86em;font-family:monospace;",
      pre: "margin:0 0 12px;padding:12px;background:#f3f4f6;border-radius:6px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 12px;font-size:13px;",
      th: "padding:6px 10px;text-align:left;border:1px solid #d1d5db;background:#f9fafb;font-weight:700;color:#111827;",
      td: "padding:5px 10px;border:1px solid #e5e7eb;color:#374151;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "plain",
  sortOrder: 3
};
