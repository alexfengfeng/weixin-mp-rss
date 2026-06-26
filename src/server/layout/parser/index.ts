/**
 * 解析器统一入口
 */

export { parseDocument } from "@/server/layout/parser/document";
export type { ParseOptions, ModuleResolver } from "@/server/layout/parser/document";
export { matchModuleStart, isModuleEnd, scanModuleBlock } from "@/server/layout/parser/module-block";
export type { RawModuleBlock, ModuleStartMatch } from "@/server/layout/parser/module-block";
export { parseFieldsBody, getField, getFieldAll } from "@/server/layout/parser/body-fields";
export { parseRowsBody } from "@/server/layout/parser/body-rows";
export { parseJsonBody } from "@/server/layout/parser/body-json";
