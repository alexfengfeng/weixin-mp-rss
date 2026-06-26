/**
 * 主题注册表与解析
 *
 * 管理内置主题，提供主题解析工具。
 * DB 访问由 templates/service.ts 负责，此文件只处理代码层主题。
 * 自动生成：共 48 个内置主题。
 */

import type { ResolvedTheme, ThemeStyles, BaseStyles, ModuleStyles } from "@/server/layout/types";
import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { amber_glowTheme } from "@/server/layout/themes/builtin/amber-glow";
import { aurora_nightTheme } from "@/server/layout/themes/builtin/aurora-night";
import { bamboo_zenTheme } from "@/server/layout/themes/builtin/bamboo-zen";
import { boldReviewTheme } from "@/server/layout/themes/builtin/bold-review";
import { brick_earthTheme } from "@/server/layout/themes/builtin/brick-earth";
import { businessProTheme } from "@/server/layout/themes/builtin/business-pro";
import { charcoal_darkTheme } from "@/server/layout/themes/builtin/charcoal-dark";
import { cherry_blossomTheme } from "@/server/layout/themes/builtin/cherry-blossom";
import { classicElegantTheme } from "@/server/layout/themes/builtin/classic-elegant";
import { cleanNewsletterTheme } from "@/server/layout/themes/builtin/clean-newsletter";
import { codeGeekTheme } from "@/server/layout/themes/builtin/code-geek";
import { coffee_cozyTheme } from "@/server/layout/themes/builtin/coffee-cozy";
import { coral_warmTheme } from "@/server/layout/themes/builtin/coral-warm";
import { crimson_passionTheme } from "@/server/layout/themes/builtin/crimson-passion";
import { deep_navyTheme } from "@/server/layout/themes/builtin/deep-navy";
import { denim_casualTheme } from "@/server/layout/themes/builtin/denim-casual";
import { densePlaybookTheme } from "@/server/layout/themes/builtin/dense-playbook";
import { emerald_luxTheme } from "@/server/layout/themes/builtin/emerald-lux";
import { forestCalmTheme } from "@/server/layout/themes/builtin/forest-calm";
import { freshGreenTheme } from "@/server/layout/themes/builtin/fresh-green";
import { grape_deepTheme } from "@/server/layout/themes/builtin/grape-deep";
import { graphite_monoTheme } from "@/server/layout/themes/builtin/graphite-mono";
import { honey_goldTheme } from "@/server/layout/themes/builtin/honey-gold";
import { inkEssayTheme } from "@/server/layout/themes/builtin/ink-essay";
import { lavender_dreamTheme } from "@/server/layout/themes/builtin/lavender-dream";
import { lemon_zestyTheme } from "@/server/layout/themes/builtin/lemon-zesty";
import { minimalMonoTheme } from "@/server/layout/themes/builtin/minimal-mono";
import { mint_coolTheme } from "@/server/layout/themes/builtin/mint-cool";
import { modernGradientTheme } from "@/server/layout/themes/builtin/modern-gradient";
import { neon_cyberTheme } from "@/server/layout/themes/builtin/neon-cyber";
import { oceanBlueTheme } from "@/server/layout/themes/builtin/ocean-blue";
import { olive_naturalTheme } from "@/server/layout/themes/builtin/olive-natural";
import { pearl_luxeTheme } from "@/server/layout/themes/builtin/pearl-luxe";
import { productReportTheme } from "@/server/layout/themes/builtin/product-report";
import { purpleDreamTheme } from "@/server/layout/themes/builtin/purple-dream";
import { rainbow_vibrantTheme } from "@/server/layout/themes/builtin/rainbow-vibrant";
import { roseElegantTheme } from "@/server/layout/themes/builtin/rose-elegant";
import { sand_desertTheme } from "@/server/layout/themes/builtin/sand-desert";
import { sky_brightTheme } from "@/server/layout/themes/builtin/sky-bright";
import { slate_proTheme } from "@/server/layout/themes/builtin/slate-pro";
import { sunsetOrangeTheme } from "@/server/layout/themes/builtin/sunset-orange";
import { teal_freshTheme } from "@/server/layout/themes/builtin/teal-fresh";
import { techDarkTheme } from "@/server/layout/themes/builtin/tech-dark";
import { vintagePaperTheme } from "@/server/layout/themes/builtin/vintage-paper";
import { violet_mistTheme } from "@/server/layout/themes/builtin/violet-mist";
import { warmColumnTheme } from "@/server/layout/themes/builtin/warm-column";
import { wood_craftTheme } from "@/server/layout/themes/builtin/wood-craft";
import { youthVibrantTheme } from "@/server/layout/themes/builtin/youth-vibrant";

/** 所有内置主题（共 48 个） */
export const BUILTIN_THEMES: BuiltinTheme[] = [
  amber_glowTheme,
  aurora_nightTheme,
  bamboo_zenTheme,
  boldReviewTheme,
  brick_earthTheme,
  businessProTheme,
  charcoal_darkTheme,
  cherry_blossomTheme,
  classicElegantTheme,
  cleanNewsletterTheme,
  codeGeekTheme,
  coffee_cozyTheme,
  coral_warmTheme,
  crimson_passionTheme,
  deep_navyTheme,
  denim_casualTheme,
  densePlaybookTheme,
  emerald_luxTheme,
  forestCalmTheme,
  freshGreenTheme,
  grape_deepTheme,
  graphite_monoTheme,
  honey_goldTheme,
  inkEssayTheme,
  lavender_dreamTheme,
  lemon_zestyTheme,
  minimalMonoTheme,
  mint_coolTheme,
  modernGradientTheme,
  neon_cyberTheme,
  oceanBlueTheme,
  olive_naturalTheme,
  pearl_luxeTheme,
  productReportTheme,
  purpleDreamTheme,
  rainbow_vibrantTheme,
  roseElegantTheme,
  sand_desertTheme,
  sky_brightTheme,
  slate_proTheme,
  sunsetOrangeTheme,
  teal_freshTheme,
  techDarkTheme,
  vintagePaperTheme,
  violet_mistTheme,
  warmColumnTheme,
  wood_craftTheme,
  youthVibrantTheme,
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
