/**
 * 主题设计令牌
 *
 * ThemeTokens 类型已在 types.ts 中定义。
 * 此文件提供默认令牌和颜色/排版辅助函数。
 */

import type { ThemeTokens, ModuleStyles } from "@/server/layout/types";

/** 默认设计令牌（简洁通讯风格） */
export const DEFAULT_TOKENS: ThemeTokens = {
  colors: {
    primary: "#111827",
    secondary: "#374151",
    accent: "#2563eb",
    text: "#374151",
    muted: "#9ca3af",
    bg: "#ffffff",
    surface: "#f8fafc",
    border: "#e5e7eb",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444"
  },
  font: {
    baseSize: 15,
    scale: 1.25,
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif'
  },
  spacing: {
    unit: 8,
    scale: 1.5
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12
  }
};

/** 内置主题定义（代码层） */
export interface BuiltinTheme {
  id: string;
  name: string;
  description: string;
  tokens?: ThemeTokens;
  styles: {
    base: Record<string, string>;
    modules?: ModuleStyles;
  };
  version: number;
  background: string;
  sortOrder: number;
}

/** 颜色透明度辅助（hex + alpha） */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return `${hex}${a}`;
}

/** 从 tokens 生成默认的模块样式（当主题未自定义模块样式时使用） */
export function generateDefaultModuleStyles(tokens: ThemeTokens): ModuleStyles {
  const { colors, radius } = tokens;

  return {
    callout: {
      info: `background:${withAlpha(colors.accent, 0.08)};border-left:4px solid ${colors.accent};border-radius:0 ${radius.md}px ${radius.md}px 0;padding:14px 18px;margin:0 0 16px;`,
      tip: `background:${withAlpha(colors.success, 0.08)};border-left:4px solid ${colors.success};border-radius:0 ${radius.md}px ${radius.md}px 0;padding:14px 18px;margin:0 0 16px;`,
      warning: `background:${withAlpha(colors.warning, 0.08)};border-left:4px solid ${colors.warning};border-radius:0 ${radius.md}px ${radius.md}px 0;padding:14px 18px;margin:0 0 16px;`,
      success: `background:${withAlpha(colors.success, 0.08)};border-left:4px solid ${colors.success};border-radius:0 ${radius.md}px ${radius.md}px 0;padding:14px 18px;margin:0 0 16px;`,
      danger: `background:${withAlpha(colors.danger, 0.08)};border-left:4px solid ${colors.danger};border-radius:0 ${radius.md}px ${radius.md}px 0;padding:14px 18px;margin:0 0 16px;`,
      label: `font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;`
    },
    hero: {
      wrap: `background:linear-gradient(135deg,${colors.surface} 0%,${withAlpha(colors.accent, 0.05)} 100%);border-radius:${radius.lg}px;padding:32px 24px;margin:0 0 24px;text-align:center;`,
      eyebrow: `display:inline-block;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${colors.accent};font-weight:600;margin:0 0 8px;`,
      title: `margin:0 0 8px;font-size:24px;font-weight:800;color:${colors.primary};line-height:1.35;`,
      subtitle: `margin:0 0 16px;font-size:15px;color:${colors.muted};line-height:1.7;`,
      cta: `display:inline-block;font-size:14px;font-weight:600;color:${colors.accent};border:1px solid ${withAlpha(colors.accent, 0.3)};border-radius:${radius.sm}px;padding:6px 16px;`
    },
    quote: {
      wrap: `background:${colors.surface};border-left:4px solid ${colors.border};border-radius:0 ${radius.md}px ${radius.md}px 0;padding:20px 24px;margin:0 0 16px;`,
      text: `margin:0 0 8px;font-size:16px;color:${colors.text};line-height:1.8;font-style:italic;`,
      source: `font-size:13px;color:${colors.muted};text-align:right;`
    }
  };
}
