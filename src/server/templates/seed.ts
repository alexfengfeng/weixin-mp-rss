import { WRITING_STYLE_PRESETS } from "@/lib/presets";
import { BUILTIN_THEMES } from "@/server/layout/themes";
import { prisma } from "@/server/db/prisma";

let seeded = false;

export async function seedBuiltinTemplates(options: { force?: boolean } = {}) {
  if (seeded && !options.force) return;

  await prisma.writingStyle.deleteMany({
    where: {
      isBuiltin: true,
      id: { notIn: WRITING_STYLE_PRESETS.map((preset) => preset.id) }
    }
  });
  await prisma.wechatStyleTemplate.deleteMany({
    where: {
      isBuiltin: true,
      id: { notIn: BUILTIN_THEMES.map((theme) => theme.id) }
    }
  });

  for (const [index, preset] of WRITING_STYLE_PRESETS.entries()) {
    const data = {
      name: preset.label,
      description: preset.description,
      prompt: preset.prompt,
      status: 1,
      isBuiltin: true,
      sortOrder: index
    };
    await prisma.writingStyle.upsert({
      where: { id: preset.id },
      update: data,
      create: { id: preset.id, ...data }
    });
  }

  for (const theme of BUILTIN_THEMES) {
    const stylesJson = JSON.stringify({
      base: theme.styles.base,
      modules: theme.styles.modules || {}
    });
    const themeMetaJson = theme.tokens ? JSON.stringify(theme.tokens) : null;
    const data = {
      name: theme.name,
      description: theme.description,
      stylesJson,
      status: 1,
      isBuiltin: true,
      sortOrder: theme.sortOrder,
      version: theme.version,
      background: theme.background,
      themeMetaJson
    };
    await prisma.wechatStyleTemplate.upsert({
      where: { id: theme.id },
      update: data,
      create: { id: theme.id, ...data }
    });
  }

  seeded = true;
}
