/**
 * JSON 格式 body 解析器
 *
 * 解析 json_object 和 json_array 格式。
 */

export function parseJsonBody(bodyText: string): { json?: unknown; error?: string } {
  const trimmed = bodyText.trim();
  if (!trimmed) return { error: "JSON body 为空" };
  try {
    const json = JSON.parse(trimmed);
    return { json };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "JSON 解析失败" };
  }
}
