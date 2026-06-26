/**
 * 行内 Markdown 渲染
 *
 * 从现有 markdown.ts 的 renderInline 抽取并增强。
 * 支持：图片、加粗、链接、行内代码、斜体、删除线。
 *
 * 处理顺序（重要）：先 escape → 行内代码（内容不再解析）→ 图片 → 加粗 → 链接 → 斜体 → 删除线
 */

export interface InlineRenderUtils {
  escapeHtml: (text: string) => string;
  escapeAttr: (text: string) => string;
  /** 获取样式 → ` style="..."` 或空字符串 */
  style: (key: string) => string;
}

export function renderInlineMarkdown(text: string, utils: InlineRenderUtils): string {
  const { escapeHtml, escapeAttr, style } = utils;

  // 1. HTML 转义
  let result = escapeHtml(text);

  // 2. 行内代码 `code`（内容不再解析其他标记）
  const codePlaceholders: string[] = [];
  result = result.replace(/`([^`]+)`/g, (_match, code: string) => {
    const html = `<code${style("code")}>${code}</code>`;
    const placeholder = `\x00CODE${codePlaceholders.length}\x00`;
    codePlaceholders.push(html);
    return placeholder;
  });

  // 3. 图片 ![alt](url)
  result = result.replace(
    /!\[([^\]]*)]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (_match, alt: string, url: string) => {
      return `<img${style("img")} src="${escapeAttr(url)}" alt="${escapeAttr(alt)}" />`;
    }
  );

  // 4. 加粗 **text**
  result = result.replace(/\*\*([^*]+)\*\*/g, `<strong${style("strong")}>$1</strong>`);

  // 5. 链接 [text](url)
  result = result.replace(
    /\[([^\]]+)]\((https?:\/\/[^)\s]+)\)/g,
    `<a${style("a")} href="$2">$1</a>`
  );

  // 6. 斜体 *text* 或 _text_（避免与加粗冲突，要求紧邻非星号字符）
  result = result.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, `$1<em>$2</em>`);
  result = result.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, `$1<em>$2</em>`);

  // 7. 删除线 ~~text~~
  result = result.replace(/~~([^~]+)~~/g, `<del>$1</del>`);

  // 8. 还原行内代码占位符
  for (let i = 0; i < codePlaceholders.length; i++) {
    result = result.replace(`\x00CODE${i}\x00`, codePlaceholders[i]);
  }

  return result;
}
