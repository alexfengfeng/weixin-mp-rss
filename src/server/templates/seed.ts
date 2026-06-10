import { WECHAT_STYLE_TEMPLATES, WRITING_STYLE_PRESETS } from "@/lib/presets";
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
      id: { notIn: WECHAT_STYLE_TEMPLATES.map((template) => template.id) }
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

  for (const [index, template] of WECHAT_STYLE_TEMPLATES.entries()) {
    const data = {
      name: template.label,
      description: template.description,
      stylesJson: JSON.stringify(template.styles),
      status: 1,
      isBuiltin: true,
      sortOrder: index
    };
    await prisma.wechatStyleTemplate.upsert({
      where: { id: template.id },
      update: data,
      create: { id: template.id, ...data }
    });
  }

  seeded = true;
}
