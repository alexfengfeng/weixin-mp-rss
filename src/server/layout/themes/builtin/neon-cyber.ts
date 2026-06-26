/**
 * 霓虹赛博主题
 * 霓虹荧光色、赛博朋克风，适合科技、AI、Web3 类内容。
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = {
  "colors": {
    "primary": "#22d3ee",
    "secondary": "#a78bfa",
    "accent": "#f472b6",
    "text": "#e5e7eb",
    "muted": "#9ca3af",
    "bg": "#0a0a0f",
    "surface": "#13131f",
    "border": "#1e1e2e",
    "success": "#34d399",
    "warning": "#fbbf24",
    "danger": "#f87171"
  },
  "font": {
    "baseSize": 14,
    "scale": 1.2,
    "family": "ui-monospace, \"Cascadia Code\", monospace"
  },
  "spacing": {
    "unit": 8,
    "scale": 1.5
  },
  "radius": {
    "sm": 0,
    "md": 2,
    "lg": 4
  }
};

export const neon_cyberTheme: BuiltinTheme = {
  id: "neon_cyber",
  name: "霓虹赛博",
  description: "霓虹荧光色、赛博朋克风，适合科技、AI、Web3 类内容。",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:#22d3ee;font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:#22d3ee;font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#a78bfa;font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:#e5e7eb;font-size:14px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#e5e7eb;font-size:14px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#e5e7eb;font-size:14px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #1e1e2e;",
      img: "max-width:100%;height:auto;border-radius:2px;",
      strong: "color:#22d3ee;font-weight:700;",
      a: "color:#f472b6;text-decoration:none;border-bottom:1px solid #1e1e2e;",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid #f472b6;background:#13131f;border-radius:0 2px 2px 0;color:#9ca3af;",
      code: "background:#13131f;padding:2px 6px;border-radius:0px;font-size:0.88em;color:#a78bfa;font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:#13131f;border-radius:2px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid #1e1e2e;background:#f472b6;color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid #1e1e2e;color:#e5e7eb;"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "dark",
  sortOrder: 43
};
