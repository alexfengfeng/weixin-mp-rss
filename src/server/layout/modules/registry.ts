/**
 * 模块注册表
 *
 * 采用注册表模式管理所有 :::module 模块。
 * 每个模块提供 def（定义）和 render（渲染函数），由 modules/index.ts 统一注册。
 */

import type { LayoutModuleDef, ModuleRenderer, ModuleSummary, RegisteredModule } from "@/server/layout/types";

const REGISTRY = new Map<string, RegisteredModule>();

/** 注册一个模块 */
export function registerModule(def: LayoutModuleDef, render: ModuleRenderer): void {
  REGISTRY.set(def.id, { def, render });
}

/** 获取已注册模块 */
export function getModule(name: string): RegisteredModule | undefined {
  return REGISTRY.get(name);
}

/** 判断模块是否已注册 */
export function hasModule(name: string): boolean {
  return REGISTRY.has(name);
}

/** 列出所有已注册模块 */
export function listModules(): RegisteredModule[] {
  return [...REGISTRY.values()];
}

/** 获取模块定义 */
export function getModuleDef(name: string): LayoutModuleDef | undefined {
  return REGISTRY.get(name)?.def;
}

/** 列出所有模块定义 */
export function listModuleDefs(): LayoutModuleDef[] {
  return [...REGISTRY.values()].map((m) => m.def);
}

/** 获取模块摘要（用于 discovery API） */
export function listModuleSummaries(): ModuleSummary[] {
  return listModuleDefs().map((def) => ({
    name: def.id,
    category: def.category,
    label: def.label,
    description: def.description,
    bodyFormat: def.bodyFormat,
    hasTitle: def.hasTitle,
    variants: def.variants,
    example: def.examples?.[0]
  }));
}

/** 清空注册表（仅用于测试） */
export function clearRegistry(): void {
  REGISTRY.clear();
}
