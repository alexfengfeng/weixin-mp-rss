/**
 * 内置主题 Seed
 *
 * 将内置主题 upsert 到 DB，含新字段 version/background/themeMetaJson。
 * stylesJson 使用新格式 { base, modules }。
 */

import { BUILTIN_THEMES } from "@/server/layout/themes/index";
import { prisma } from "@/server/db/prisma";

let themeSeeded = false;

export async function seedBuiltinThemes(options: { force?: boolean } = {}): Promise<void> {
  if (themeSeeded && !options.force) return;

  // 清理不再存在的内置主题
  const builtinIds = BUILTIN_THEMES.map((t) => t.id);
  await prisma.wechatStyleTemplate.deleteMany({
    where: {
      isBuiltin: true,
      id: { notIn: builtinIds }
    }
  });

  for (const theme of BUILTIN_THEMES) {
    const stylesJson = JSON.stringify({
      base: theme.styles.base,
      modules: theme.styles.modules || {}
    });
    const themeMetaJson = theme.tokens ? JSON.stringify(theme.tokens) : null;

    await prisma.wechatStyleTemplate.upsert({
      where: { id: theme.id },
      update: {
        name: theme.name,
        description: theme.description,
        stylesJson,
        status: 1,
        isBuiltin: true,
        sortOrder: theme.sortOrder,
        version: theme.version,
        background: theme.background,
        themeMetaJson
      },
      create: {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        stylesJson,
        status: 1,
        isBuiltin: true,
        sortOrder: theme.sortOrder,
        version: theme.version,
        background: theme.background,
        themeMetaJson
      }
    });
  }

  themeSeeded = true;
}

/** 重置 seed 状态（仅用于测试） */
export function resetThemeSeedState(): void {
  themeSeeded = false;
}
