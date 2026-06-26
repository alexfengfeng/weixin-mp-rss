import { getWechatStyleTemplate, getWritingStylePreset, WECHAT_STYLE_TEMPLATES, WRITING_STYLE_PRESETS } from "@/lib/presets";
import type { WechatStyleTemplate } from "@/lib/presets";
import { prisma } from "@/server/db/prisma";
import { seedBuiltinTemplates } from "@/server/templates/seed";
import type { ThemeStyles } from "@/server/layout/types";
import { parseThemeStyles } from "@/server/layout/themes";

const STYLE_KEYS = ["h1", "h2", "h3", "p", "ul", "ol", "li", "hr", "img", "strong", "a"] as const;

type StyleKey = typeof STYLE_KEYS[number];
type WechatStyles = Record<StyleKey, string>;

type WritingStyleRow = {
  id: string;
  name: string;
  description: string | null;
  prompt: string;
  status: number;
  isBuiltin: boolean;
  sortOrder: number;
};

type WechatStyleRow = {
  id: string;
  name: string;
  description: string | null;
  stylesJson: string;
  status: number;
  isBuiltin: boolean;
  sortOrder: number;
  version: number;
  background: string;
  themeMetaJson: string | null;
};

export type WritingStyleInput = {
  name: string;
  description?: string | null;
  prompt: string;
  status?: number;
  sortOrder?: number;
};

export type WechatStyleTemplateInput = {
  name: string;
  description?: string | null;
  styles: Partial<WechatStyles>;
  status?: number;
  sortOrder?: number;
};

export type WritingStyleOption = WritingStyleRow;

export type WechatStyleTemplateOption = Omit<WechatStyleRow, "stylesJson" | "themeMetaJson"> & {
  styles: WechatStyles;
  themeStyles: ThemeStyles;
  tokens?: unknown;
};

export function normalizeWritingStyleInput(input: WritingStyleInput) {
  return {
    name: input.name.trim(),
    description: input.description?.trim() || null,
    prompt: input.prompt.trim(),
    status: input.status === 0 ? 0 : 1,
    sortOrder: Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 0
  };
}

export function normalizeWechatStyleTemplateInput(input: WechatStyleTemplateInput) {
  return {
    name: input.name.trim(),
    description: input.description?.trim() || null,
    stylesJson: JSON.stringify(normalizeStyles(input.styles)),
    status: input.status === 0 ? 0 : 1,
    sortOrder: Number.isFinite(input.sortOrder) ? Number(input.sortOrder) : 0
  };
}

export async function listWritingStyles(activeOnly = false): Promise<WritingStyleOption[]> {
  await seedBuiltinTemplates();
  const rows = await prisma.writingStyle.findMany({
    where: activeOnly ? { status: 1 } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });
  if (activeOnly && rows.length === 0) return WRITING_STYLE_PRESETS.map(builtinWritingStyleToOption);
  return rows.map(rowToWritingStyle);
}

export async function listWechatStyleTemplates(activeOnly = false): Promise<WechatStyleTemplateOption[]> {
  await seedBuiltinTemplates();
  const rows = await prisma.wechatStyleTemplate.findMany({
    where: activeOnly ? { status: 1 } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });
  if (activeOnly && rows.length === 0) return WECHAT_STYLE_TEMPLATES.map(builtinWechatStyleToOption);
  return rows.map(rowToWechatStyleTemplate);
}

export async function resolveWritingStyle(id?: string | null): Promise<WritingStyleOption> {
  await seedBuiltinTemplates();
  if (id) {
    const row = await prisma.writingStyle.findUnique({ where: { id } });
    if (row?.status === 1) return rowToWritingStyle(row);
  }
  const rows = await prisma.writingStyle.findMany({
    where: { status: 1 },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    take: 1
  });
  return rows[0] ? rowToWritingStyle(rows[0]) : builtinWritingStyleToOption(getWritingStylePreset("professional"));
}

export async function resolveWechatStyleTemplate(id?: string | null): Promise<WechatStyleTemplateOption> {
  await seedBuiltinTemplates();
  if (id) {
    const row = await prisma.wechatStyleTemplate.findUnique({ where: { id } });
    if (row?.status === 1) return rowToWechatStyleTemplate(row);
  }
  const rows = await prisma.wechatStyleTemplate.findMany({
    where: { status: 1 },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    take: 1
  });
  return rows[0] ? rowToWechatStyleTemplate(rows[0]) : builtinWechatStyleToOption(getWechatStyleTemplate("clean"));
}

export async function createWritingStyle(input: WritingStyleInput) {
  const data = normalizeWritingStyleInput(input);
  return rowToWritingStyle(await prisma.writingStyle.create({ data }));
}

export async function updateWritingStyle(id: string, input: WritingStyleInput) {
  const data = normalizeWritingStyleInput(input);
  if (data.status === 0) await ensureWritingStyleCanBeDisabled(id);
  return rowToWritingStyle(await prisma.writingStyle.update({ where: { id }, data }));
}

export async function deleteWritingStyle(id: string) {
  await ensureWritingStyleCanBeDisabled(id);
  return prisma.writingStyle.delete({ where: { id } });
}

export async function createWechatStyleTemplate(input: WechatStyleTemplateInput) {
  const data = normalizeWechatStyleTemplateInput(input);
  return rowToWechatStyleTemplate(await prisma.wechatStyleTemplate.create({ data }));
}

export async function updateWechatStyleTemplate(id: string, input: WechatStyleTemplateInput) {
  const data = normalizeWechatStyleTemplateInput(input);
  if (data.status === 0) await ensureWechatStyleCanBeDisabled(id);
  return rowToWechatStyleTemplate(await prisma.wechatStyleTemplate.update({ where: { id }, data }));
}

export async function deleteWechatStyleTemplate(id: string) {
  await ensureWechatStyleCanBeDisabled(id);
  return prisma.wechatStyleTemplate.delete({ where: { id } });
}

export function rowToWritingStyle(row: WritingStyleRow): WritingStyleOption {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    prompt: row.prompt,
    status: row.status,
    isBuiltin: row.isBuiltin,
    sortOrder: row.sortOrder
  };
}

export function rowToWechatStyleTemplate(row: WechatStyleRow): WechatStyleTemplateOption {
  const themeStyles = parseThemeStyles(row.stylesJson);
  const styles = normalizeStyles(themeStyles.base);
  let tokens: unknown = undefined;
  if (row.themeMetaJson) {
    try {
      tokens = JSON.parse(row.themeMetaJson);
    } catch {
      /* ignore parse error */
    }
  }
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    styles,
    themeStyles,
    tokens,
    status: row.status,
    isBuiltin: row.isBuiltin,
    sortOrder: row.sortOrder,
    version: row.version,
    background: row.background
  };
}

export function parseStylesJson(value: string): WechatStyles {
  const themeStyles = parseThemeStyles(value);
  return normalizeStyles(themeStyles.base);
}

function normalizeStyles(styles: Partial<Record<StyleKey, unknown>>): WechatStyles {
  const fallback = getWechatStyleTemplate("clean").styles;
  const normalized = { ...fallback };
  for (const key of STYLE_KEYS) {
    const value = styles[key];
    if (typeof value === "string" && value.trim()) normalized[key] = value.trim();
  }
  return normalized;
}

function builtinWritingStyleToOption(preset: ReturnType<typeof getWritingStylePreset>): WritingStyleOption {
  return {
    id: preset.id,
    name: preset.label,
    description: preset.description,
    prompt: preset.prompt,
    status: 1,
    isBuiltin: true,
    sortOrder: WRITING_STYLE_PRESETS.findIndex((item) => item.id === preset.id)
  };
}

function builtinWechatStyleToOption(template: WechatStyleTemplate): WechatStyleTemplateOption {
  return {
    id: template.id,
    name: template.label,
    description: template.description,
    styles: template.styles,
    themeStyles: { base: template.styles, modules: {} },
    status: 1,
    isBuiltin: true,
    sortOrder: WECHAT_STYLE_TEMPLATES.findIndex((item) => item.id === template.id),
    version: 1,
    background: "plain"
  };
}

async function ensureWritingStyleCanBeDisabled(id: string) {
  const row = await prisma.writingStyle.findUnique({ where: { id } });
  if (row?.status !== 1) return;
  const activeCount = await prisma.writingStyle.count({ where: { status: 1 } });
  if (activeCount <= 1) throw new Error("至少保留一个启用的写作风格");
}

async function ensureWechatStyleCanBeDisabled(id: string) {
  const row = await prisma.wechatStyleTemplate.findUnique({ where: { id } });
  if (row?.status !== 1) return;
  const activeCount = await prisma.wechatStyleTemplate.count({ where: { status: 1 } });
  if (activeCount <= 1) throw new Error("至少保留一个启用的排版模板");
}
