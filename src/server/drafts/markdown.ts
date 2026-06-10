const IMAGE_RE = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

export function extractMarkdownImageUrls(markdown: string): string[] {
  const urls: string[] = [];
  for (const match of markdown.matchAll(IMAGE_RE)) {
    if (match[1] && !urls.includes(match[1])) urls.push(match[1]);
  }
  return urls;
}

export function replaceImageUrlsInHtml(html: string, replacements: Map<string, string>): string {
  let next = html;
  for (const [from, to] of replacements) {
    next = next.split(escapeHtmlAttribute(from)).join(escapeHtmlAttribute(to));
  }
  return next;
}

export function markdownToWechatHtml(markdown: string): string {
  const blocks = normalizeMarkdown(markdown).split(/\n{2,}/);
  return blocks
    .map((block) => renderBlock(block.trim()))
    .filter(Boolean)
    .join("\n");
}

function normalizeMarkdown(markdown: string) {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n");
}

function renderBlock(block: string) {
  if (!block) return "";

  if (/^[-*_]{3,}$/.test(block)) {
    return "<hr />";
  }

  const heading = block.match(/^(#{1,3})\s+(.+)$/);
  if (heading) {
    const level = heading[1].length;
    return `<h${level}>${renderInline(heading[2])}</h${level}>`;
  }

  const image = block.match(/^!\[([^\]]*)]\(([^)\s]+)(?:\s+"[^"]*")?\)$/);
  if (image) {
    return `<p><img src="${escapeHtmlAttribute(image[2])}" alt="${escapeHtmlAttribute(image[1])}" /></p>`;
  }

  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.every((line) => /^[-*]\s+/.test(line))) {
    return `<ul>${lines.map((line) => `<li>${renderInline(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
  }

  if (lines.every((line) => /^\d+[.)、]\s+/.test(line))) {
    return `<ol>${lines.map((line) => `<li>${renderInline(line.replace(/^\d+[.)、]\s+/, ""))}</li>`).join("")}</ol>`;
  }

  if (lines.some((line) => /^[-*]\s+/.test(line) || /^\d+[.)、]\s+/.test(line))) {
    return renderMixedLines(lines);
  }

  return `<p>${renderInline(lines.join("<br />"))}</p>`;
}

function renderMixedLines(lines: string[]) {
  const parts: string[] = [];
  let paragraph: string[] = [];
  let unordered: string[] = [];
  let ordered: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) return;
    parts.push(`<p>${renderInline(paragraph.join("<br />"))}</p>`);
    paragraph = [];
  }

  function flushUnordered() {
    if (unordered.length === 0) return;
    parts.push(`<ul>${unordered.map((line) => `<li>${renderInline(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`);
    unordered = [];
  }

  function flushOrdered() {
    if (ordered.length === 0) return;
    parts.push(`<ol>${ordered.map((line) => `<li>${renderInline(line.replace(/^\d+[.)、]\s+/, ""))}</li>`).join("")}</ol>`);
    ordered = [];
  }

  for (const line of lines) {
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      flushOrdered();
      unordered.push(line);
      continue;
    }
    if (/^\d+[.)、]\s+/.test(line)) {
      flushParagraph();
      flushUnordered();
      ordered.push(line);
      continue;
    }
    flushUnordered();
    flushOrdered();
    paragraph.push(line);
  }

  flushParagraph();
  flushUnordered();
  flushOrdered();
  return parts.join("\n");
}

function renderInline(value: string) {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_match, alt: string, url: string) => {
      return `<img src="${escapeHtmlAttribute(url)}" alt="${escapeHtmlAttribute(alt)}" />`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtmlAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
