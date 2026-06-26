/**
 * GFM 表格渲染
 *
 * 支持管道符分隔的表格，含对齐行。
 * 例如：
 *   | 列1 | 列2 | 列3 |
 *   |:----|:---:|----:|
 *   | a   | b   | c   |
 */

import type { RenderContext } from "@/server/layout/types";

type Align = "left" | "center" | "right" | null;

/** 判断行是否为表格分隔行（|:---|:---:|） */
export function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;
  return /^\|?[\s:|-]+\|?$/.test(trimmed) && trimmed.includes("-");
}

/** 判断连续行是否构成表格（首行有 |，次行是分隔行） */
export function isTableBlock(lines: string[]): boolean {
  if (lines.length < 2) return false;
  const firstLine = lines[0].trim();
  const secondLine = lines[1].trim();
  if (!firstLine.includes("|")) return false;
  return isTableSeparator(secondLine);
}

/** 解析对齐方式 */
function parseAlign(cell: string): Align {
  const trimmed = cell.trim();
  const left = trimmed.startsWith(":");
  const right = trimmed.endsWith(":");
  if (left && right) return "center";
  if (right) return "right";
  if (left) return "left";
  return null;
}

/** 分割表格行为单元格 */
function splitTableRow(line: string): string[] {
  let trimmed = line.trim();
  // 去除首尾的 |
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  return trimmed.split("|").map((c) => c.trim());
}

/** 渲染表格 */
export function renderTable(lines: string[], ctx: RenderContext): string {
  if (lines.length < 2) return "";

  const headerCells = splitTableRow(lines[0]);
  const aligns = splitTableRow(lines[1]).map(parseAlign);
  const bodyLines = lines.slice(2);

  // 表头
  const ths = headerCells
    .map((cell, i) => {
      const align = aligns[i];
      const alignStyle = align ? `text-align:${align};` : "";
      return `<th${ctx.style("th")}${alignStyle ? ` style="${alignStyle}"` : ""}>${ctx.renderInline(cell)}</th>`;
    })
    .join("");

  // 表体
  const trs = bodyLines
    .filter((line) => line.trim())
    .map((line) => {
      const cells = splitTableRow(line);
      const tds = cells
        .map((cell, i) => {
          const align = aligns[i];
          const alignStyle = align ? `text-align:${align};` : "";
          return `<td${ctx.style("td")}${alignStyle ? ` style="${alignStyle}"` : ""}>${ctx.renderInline(cell)}</td>`;
        })
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("");

  return `<table${ctx.style("table")}><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
}
