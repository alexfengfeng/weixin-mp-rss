/**
 * 文档级解析器
 *
 * 将 Markdown 文档解析为 Block[]，混合切分 :::module 块和普通文本块。
 *
 * 解析流程：
 * 1. 按行扫描
 * 2. 遇到 :::name 起始行 → 扫描完整模块块 → 查询模块定义 → 按 bodyFormat 解析 body
 * 3. 遇到普通文本 → 收集连续文本行
 * 4. 输出 Block[]
 */

import type { Block, BodyFormat, LayoutModuleDef, ParsedBody, ParsedModule } from "@/server/layout/types";
import { scanModuleBlock } from "@/server/layout/parser/module-block";
import type { RawModuleBlock } from "@/server/layout/parser/module-block";
import { parseFieldsBody } from "@/server/layout/parser/body-fields";
import { parseRowsBody } from "@/server/layout/parser/body-rows";
import { parseJsonBody } from "@/server/layout/parser/body-json";

/** 模块查询接口（由上层注入，避免 parser 直接依赖 registry） */
export interface ModuleResolver {
  hasModule(name: string): boolean;
  getModuleDef(name: string): LayoutModuleDef | undefined;
}

export interface ParseOptions {
  resolver?: ModuleResolver;
}

/**
 * 解析 Markdown 文档为 Block[]。
 *
 * @param markdown 原始 Markdown 文本
 * @param options 解析选项，含模块查询器
 * @returns Block 数组（text 块和 module 块交替）
 */
export function parseDocument(markdown: string, options: ParseOptions = {}): Block[] {
  const normalized = markdown.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n");
  const blocks: Block[] = [];
  const resolver = options.resolver;

  let i = 0;
  let textBuffer: string[] = [];

  function flushText() {
    if (textBuffer.length === 0) return;
    blocks.push({ type: "text", lines: textBuffer });
    textBuffer = [];
  }

  while (i < lines.length) {
    const line = lines[i];

    // 尝试匹配 :::name 模块起始行
    const scanResult = scanModuleBlock(lines, i);
    if (scanResult) {
      flushText();
      const { block: raw, nextIdx } = scanResult;
      const parsedModule = resolveParsedModule(raw, resolver);
      blocks.push({ type: "module", module: parsedModule });
      i = nextIdx;
      continue;
    }

    // 普通文本行
    textBuffer.push(line);
    i++;
  }

  flushText();
  return blocks;
}

/** 将原始模块块转换为解析后的模块（含 body 解析） */
function resolveParsedModule(
  raw: RawModuleBlock,
  resolver?: ModuleResolver
): ParsedModule {
  const { name, variant, title, bodyText, startLine, endLine, unclosed } = raw;
  const rawText = `:::${name}${variant ? ` ${variant}` : ""}${title ? ` ${title}` : ""}\n${bodyText}\n:::`;

  const def = resolver?.getModuleDef(name);

  // 未注册模块
  if (!def || !resolver?.hasModule(name)) {
    return {
      name,
      variant,
      title,
      body: { format: "text" as BodyFormat, text: bodyText },
      raw: rawText,
      startLine,
      endLine,
      unknown: true
    };
  }

  // 按模块定义的 bodyFormat 解析 body
  const body = parseBodyByFormat(bodyText, def.bodyFormat, def.hasTitle);

  // 验证变体
  let parseError: string | undefined;
  if (unclosed) {
    parseError = "模块块未闭合（缺少 ::: 结束标记）";
  } else if (variant && def.variants && !def.variants.includes(variant)) {
    parseError = `未知变体 "${variant}"，支持的变体: ${def.variants.join(", ")}`;
  }

  return {
    name,
    variant: variant || def.defaultVariant,
    title,
    body,
    raw: rawText,
    startLine,
    endLine,
    parseError
  };
}

/** 根据 bodyFormat 解析 body 文本 */
function parseBodyByFormat(bodyText: string, format: BodyFormat, hasTitle?: boolean): ParsedBody {
  switch (format) {
    case "fields": {
      const fields = parseFieldsBody(bodyText);
      return { format, fields };
    }
    case "rows": {
      const { title, rows } = parseRowsBody(bodyText, hasTitle);
      return { format, rows, title };
    }
    case "json_object":
    case "json_array": {
      const { json, error } = parseJsonBody(bodyText);
      return { format, json, text: error ? bodyText : undefined };
    }
    case "text":
    default: {
      return { format: "text", text: bodyText };
    }
  }
}
