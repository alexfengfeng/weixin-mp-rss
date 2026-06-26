/**
 * 主题注册表与解析
 *
 * 管理内置主题，提供主题解析工具。
 * DB 访问由 templates/service.ts 负责，此文件只处理代码层主题。
 */

import type { ResolvedTheme, ThemeStyles, BaseStyles, ModuleStyles } from "@/server/layout/types";
import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { cleanNewsletterTheme } from "@/server/layout/themes/builtin/clean-newsletter";
import { productReportTheme } from "@/server/layout/themes/builtin/product-report";
import { warmColumnTheme } from "@/server/layout/themes/builtin/warm-column";
import { densePlaybookTheme } from "@/server/layout/themes/builtin/dense-playbook";
import { boldReviewTheme } from "@/server/layout/themes/builtin/bold-review";
import { inkEssayTheme } from "@/server/layout/themes/builtin/ink-essay";
import { techDarkTheme } from "@/server/layout/themes/builtin/tech-dark";
import { minimalMonoTheme } from "@/server/layout/themes/builtin/minimal-mono";
import { freshGreenTheme } from "@/server/layout/themes/builtin/fresh-green";
import { oceanBlueTheme } from "@/server/layout/themes/builtin/ocean-blue";
import { sunsetOrangeTheme } from "@/server/layout/themes/builtin/sunset-orange";
import { purpleDreamTheme } from "@/server/layout/themes/builtin/purple-dream";
import { vintagePaperTheme } from "@/server/layout/themes/builtin/vintage-paper";
import { codeGeekTheme } from "@/server/layout/themes/builtin/code-geek";
import { businessProTheme } from "@/server/layout/themes/builtin/business-pro";
import { youthVibrantTheme } from "@/server/layout/themes/builtin/youth-vibrant";
import { classicElegantTheme } from "@/server/layout/themes/builtin/classic-elegant";
import { modernGradientTheme } from "@/server/layout/themes/builtin/modern-gradient";
import { forestCalmTheme } from "@/server/layout/themes/builtin/forest-calm";
import { roseElegantTheme } from "@/server/layout/themes/builtin/rose-elegant";

/** 所有内置主题（共 20 个） */
export const BUILTIN_THEMES: BuiltinTheme[] = [
  cleanNewsletterTheme,
  productReportTheme,
  warmColumnTheme,
  densePlaybookTheme,
  boldReviewTheme,
  inkEssayTheme,
  techDarkTheme,
  minimalMonoTheme,
  freshGreenTheme,
  oceanBlueTheme,
  sunsetOrangeTheme,
  purpleDreamTheme,
  vintagePaperTheme,
  codeGeekTheme,
  businessProTheme,
  youthVibrantTheme,
  classicElegantTheme,
  modernGradientTheme,
  forestCalmTheme,
  roseElegantTheme
];

/** 获取内置主题 */
export function getBuiltinTheme(id: string): BuiltinTheme | undefined {
  return BUILTIN_THEMES.find((t) => t.id === id);
}

/** 将内置主题转换为 ResolvedTheme */
export function toResolvedTheme(builtin: BuiltinTheme): ResolvedTheme {
  return {
    id: builtin.id,
    name: builtin.name,
    description: builtin.description,
    tokens: builtin.tokens,
    styles: {
      base: builtin.styles.base,
      modules: builtin.styles.modules || {}
    },
    version: builtin.version,
    background: builtin.background
  };
}

/**
 * 从 DB 的 stylesJson 解析 ThemeStyles。
 * 兼容两种格式：
 * - 新格式：{ base: {...}, modules: {...} }
 * - 旧格式：直接是 11 key 的对象（视为 base）
 */
export function parseThemeStyles(stylesJson: string): ThemeStyles {
  try {
    const parsed = JSON.parse(stylesJson);
    if (parsed && typeof parsed === "object" && "base" in parsed) {
      return {
        base: (parsed.base as BaseStyles) || {},
        modules: (parsed.modules as ModuleStyles) || {}
      };
    }
    // 旧格式：直接是 key-value 样式对象
    return { base: parsed as BaseStyles, modules: {} };
  } catch {
    return { base: {}, modules: {} };
  }
}

/** 获取默认主题（clean_newsletter） */
export function getDefaultTheme(): ResolvedTheme {
  return toResolvedTheme(cleanNewsletterTheme);
}

/** 根据 ID 获取 ResolvedTheme（仅内置主题） */
export function resolveBuiltinTheme(id: string): ResolvedTheme | undefined {
  const builtin = getBuiltinTheme(id);
  return builtin ? toResolvedTheme(builtin) : undefined;
}
