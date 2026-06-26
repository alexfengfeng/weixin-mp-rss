/**
 * fields 格式 body 解析器
 *
 * 解析 key: value 格式的多行文本。
 * 例如：
 *   eyebrow: 深度观察
 *   title: AI 时代的公众号写作
 */

import type { Field } from "@/server/layout/types";

const FIELD_RE = /^([^:\n]+?):\s*(.*)$/;

export function parseFieldsBody(bodyText: string): Field[] {
  const fields: Field[] = [];
  for (const line of bodyText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(FIELD_RE);
    if (match) {
      fields.push({ key: match[1].trim(), value: match[2].trim() });
    }
  }
  return fields;
}

/** 从 fields 中获取字段值，支持精确匹配和忽略大小写 */
export function getField(fields: Field[] | undefined, key: string, ignoreCase = true): string | undefined {
  if (!fields) return undefined;
  const target = ignoreCase ? key.toLowerCase() : key;
  for (const field of fields) {
    const fieldKey = ignoreCase ? field.key.toLowerCase() : field.key;
    if (fieldKey === target) return field.value;
  }
  return undefined;
}

/** 获取同名的所有字段值（用于重复字段如 point） */
export function getFieldAll(fields: Field[] | undefined, key: string, ignoreCase = true): string[] {
  if (!fields) return [];
  const target = ignoreCase ? key.toLowerCase() : key;
  const values: string[] = [];
  for (const field of fields) {
    const fieldKey = ignoreCase ? field.key.toLowerCase() : field.key;
    if (fieldKey === target) values.push(field.value);
  }
  return values;
}
