/**
 * 主题样式生成器
 *
 * 从 ThemeTokens 生成 baseStyles。
 * 主要用于自定义主题（用户通过 tokens 创建），内置主题使用硬编码样式以保证视觉一致性。
 */

import type { ThemeTokens, BaseStyles } from "@/server/layout/types";
import { withAlpha } from "@/server/layout/themes/tokens";

/** 从 ThemeTokens 生成基础元素样式 */
export function generateBaseStyles(tokens: ThemeTokens): BaseStyles {
  const { colors, font, radius } = tokens;
  const h2Size = Math.round(font.baseSize * font.scale * 1.2);
  const h3Size = Math.round(font.baseSize * font.scale * 0.9);

  return {
    h1: `margin:0 0 20px;color:${colors.primary};font-size:${Math.round(font.baseSize * font.scale * 1.6)}px;line-height:1.38;font-weight:750;`,
    h2: `margin:30px 0 12px;color:${colors.primary};font-size:${h2Size}px;line-height:1.5;font-weight:700;`,
    h3: `margin:22px 0 8px;color:${colors.secondary};font-size:${h3Size}px;line-height:1.55;font-weight:700;`,
    p: `margin:0 0 15px;color:${colors.text};font-size:${font.baseSize}px;line-height:1.9;`,
    ul: `margin:0 0 16px;padding-left:1.2em;color:${colors.text};font-size:${font.baseSize}px;line-height:1.85;`,
    ol: `margin:0 0 16px;padding-left:1.35em;color:${colors.text};font-size:${font.baseSize}px;line-height:1.85;`,
    li: `margin:0 0 7px;`,
    hr: `margin:28px 0;border:0;border-top:1px solid ${colors.border};`,
    img: `max-width:100%;height:auto;border-radius:${radius.sm}px;`,
    strong: `color:${colors.primary};font-weight:750;`,
    a: `color:${colors.accent};text-decoration:none;border-bottom:1px solid ${withAlpha(colors.accent, 0.3)};`,
    blockquote: `margin:0 0 16px;padding:12px 16px;border-left:4px solid ${colors.border};background:${colors.surface};border-radius:0 ${radius.sm}px ${radius.sm}px 0;color:${colors.muted};`,
    code: `background:${colors.surface};padding:2px 6px;border-radius:${radius.sm}px;font-size:0.88em;font-family:"SF Mono",Monaco,Consolas,monospace;`,
    pre: `margin:0 0 16px;padding:16px;background:${colors.surface};border-radius:${radius.md}px;overflow-x:auto;`,
    table: `width:100%;border-collapse:collapse;margin:0 0 16px;font-size:${font.baseSize - 1}px;`,
    th: `padding:10px 12px;text-align:left;border:1px solid ${colors.border};background:${colors.surface};font-weight:700;color:${colors.primary};`,
    td: `padding:8px 12px;border:1px solid ${colors.border};color:${colors.text};`
  };
}
