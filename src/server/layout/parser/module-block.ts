/**
 * :::module 块识别器
 *
 * 识别 :::name [variant] [title] ... ::: 结构。
 */

export interface RawModuleBlock {
  /** 模块名 */
  name: string;
  /** 变体（如 callout 的 tip） */
  variant?: string;
  /** 标题（:::name 后面非变体的文本） */
  title?: string;
  /** body 原始文本（不含 :::name 行和 ::: 结束行） */
  bodyText: string;
  /** 起始行号（0-based，:::name 行） */
  startLine: number;
  /** 结束行号（0-based，::: 结束行，若未闭合则为 -1） */
  endLine: number;
  /** 是否未闭合 */
  unclosed: boolean;
}

/** :::name [variant] [title] 起始行正则 */
const MODULE_START_RE = /^:::([a-z][a-z0-9-]*)(?:\s+([a-z][a-z0-9-]*))?(?:\s+(.*))?$/;
/** ::: 结束行正则 */
const MODULE_END_RE = /^:::\s*$/;

export interface ModuleStartMatch {
  name: string;
  variant?: string;
  title?: string;
}

/** 尝试匹配 :::name 起始行 */
export function matchModuleStart(line: string): ModuleStartMatch | null {
  const trimmed = line.trim();
  const match = trimmed.match(MODULE_START_RE);
  if (!match) return null;
  const name = match[1];
  const variant = match[2] || undefined;
  const title = match[3]?.trim() || undefined;

  // 变体只允许小写字母+数字+连字符；如果第二段看起来像标题（含中文等），则当作标题
  // 正则已限制 [a-z][a-z0-9-]*，所以 match[2] 若匹配则一定是变体格式
  return { name, variant, title };
}

/** 判断是否为 ::: 结束行 */
export function isModuleEnd(line: string): boolean {
  return MODULE_END_RE.test(line.trim());
}

/**
 * 从指定行开始扫描，提取一个完整的 :::module 块。
 *
 * @param lines 文档所有行
 * @param startIdx 起始行索引（:::name 行）
 * @returns { block, nextIdx } 或 null（如果不是模块起始行）
 */
export function scanModuleBlock(
  lines: string[],
  startIdx: number
): { block: RawModuleBlock; nextIdx: number } | null {
  const startMatch = matchModuleStart(lines[startIdx]);
  if (!startMatch) return null;

  const bodyLines: string[] = [];
  let endIdx = -1;

  for (let i = startIdx + 1; i < lines.length; i++) {
    if (isModuleEnd(lines[i])) {
      endIdx = i;
      break;
    }
    bodyLines.push(lines[i]);
  }

  const unclosed = endIdx === -1;
  const block: RawModuleBlock = {
    name: startMatch.name,
    variant: startMatch.variant,
    title: startMatch.title,
    bodyText: bodyLines.join("\n"),
    startLine: startIdx,
    endLine: endIdx,
    unclosed
  };

  // 下一个待处理行：闭合则跳过 ::: 行，未闭合则到文档末尾
  const nextIdx = unclosed ? lines.length : endIdx + 1;
  return { block, nextIdx };
}
