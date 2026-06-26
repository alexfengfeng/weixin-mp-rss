/**
 * 重新生成 themes/index.ts，自动导入并注册所有 builtin 主题文件。
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const BUILTIN_DIR = path.join(process.cwd(), "src/server/layout/themes/builtin");
const INDEX_FILE = path.join(process.cwd(), "src/server/layout/themes/index.ts");

const files = readdirSync(BUILTIN_DIR).filter(f => f.endsWith(".ts")).sort();

// 解析每个文件的导出名（如 cleanNewsletterTheme）
const imports: string[] = [];
const registrations: string[] = [];

for (const file of files) {
  const content = readFileSync(path.join(BUILTIN_DIR, file), "utf-8");
  // 匹配 export const xxxTheme: BuiltinTheme
  const match = content.match(/export const (\w+Theme):\s+BuiltinTheme/);
  if (!match) {
    console.error(`Cannot find theme export in ${file}`);
    process.exit(1);
  }
  const exportName = match[1];
  const modulePath = `@/server/layout/themes/builtin/${file.replace(/\.ts$/, "")}`;
  imports.push(`import { ${exportName} } from "${modulePath}";`);
  registrations.push(`  ${exportName},`);
}

const indexContent = `/**
 * 主题注册表与解析
 *
 * 管理内置主题，提供主题解析工具。
 * DB 访问由 templates/service.ts 负责，此文件只处理代码层主题。
 * 自动生成：共 ${files.length} 个内置主题。
 */

import type { ResolvedTheme, ThemeStyles, BaseStyles, ModuleStyles } from "@/server/layout/types";
import type { BuiltinTheme } from "@/server/layout/themes/tokens";
${imports.join("\n")}

/** 所有内置主题（共 ${files.length} 个） */
export const BUILTIN_THEMES: BuiltinTheme[] = [
${registrations.join("\n")}
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
`;

writeFileSync(INDEX_FILE, indexContent, "utf-8");
console.log(`Generated index.ts with ${files.length} themes`);
