/**
 * rows 格式 body 解析器
 *
 * 解析管道符分隔的多行文本。
 * 例如：
 *   序号 | 章节名 | 说明
 *   1 | 开篇 | 为什么要做这件事
 *   2 | 实践 | 具体怎么做
 */

import type { Row } from "@/server/layout/types";

export function parseRowsBody(bodyText: string, hasTitle = false): { title?: string; rows: Row[] } {
  const lines = bodyText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) return { rows: [] };

  let title: string | undefined;
  let rowLines = lines;

  if (hasTitle) {
    // 第一行作为标题（不含管道符或单列）
    title = lines[0];
    rowLines = lines.slice(1);
  }

  const rows: Row[] = [];
  for (const line of rowLines) {
    // 按管道符分隔，去除首尾空白
    const cells = line.split("|").map((c) => c.trim());
    // 过滤掉空行（管道符分隔后全为空）
    if (cells.some((c) => c.length > 0)) {
      rows.push({ cells });
    }
  }

  return { title, rows };
}
