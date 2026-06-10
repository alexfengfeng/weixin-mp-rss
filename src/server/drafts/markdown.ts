import { getWechatStyleTemplate } from "@/lib/presets";
import type { WechatStyleTemplate } from "@/lib/presets";
import type { WechatStyleTemplateOption } from "@/server/templates/service";

const IMAGE_RE = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
type RenderTemplate = Pick<WechatStyleTemplate, "styles"> | null;

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

export function markdownToWechatHtml(markdown: string, template?: string | WechatStyleTemplateOption): string {
  const renderTemplate = resolveRenderTemplate(template);
  const blocks = normalizeMarkdown(markdown).split(/\n{2,}/);
  return blocks
    .map((block) => renderBlock(block.trim(), renderTemplate))
    .filter(Boolean)
    .join("\n");
}

function resolveRenderTemplate(template?: string | WechatStyleTemplateOption): RenderTemplate {
  if (!template) return null;
  if (typeof template === "string") return getWechatStyleTemplate(template);
  return { styles: template.styles };
}

function normalizeMarkdown(markdown: string) {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n");
}

function renderBlock(block: string, template: RenderTemplate) {
  if (!block) return "";

  if (/^[-*_]{3,}$/.test(block)) {
    return `<hr${styleAttr(template, "hr")} />`;
  }

  const heading = block.match(/^(#{1,3})\s+(.+)$/);
  if (heading) {
    const level = heading[1].length;
    const key = `h${level}` as "h1" | "h2" | "h3";
    return `<h${level}${styleAttr(template, key)}>${renderInline(heading[2], template)}</h${level}>`;
  }

  const image = block.match(/^!\[([^\]]*)]\(([^)\s]+)(?:\s+"[^"]*")?\)$/);
  if (image) {
    return `<p${styleAttr(template, "p")}><img${styleAttr(template, "img")} src="${escapeHtmlAttribute(image[2])}" alt="${escapeHtmlAttribute(image[1])}" /></p>`;
  }

  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.every((line) => /^[-*]\s+/.test(line))) {
    return `<ul${styleAttr(template, "ul")}>${lines.map((line) => `<li${styleAttr(template, "li")}>${renderInline(line.replace(/^[-*]\s+/, ""), template)}</li>`).join("")}</ul>`;
  }

  if (lines.every((line) => /^\d+[.)、]\s+/.test(line))) {
    return `<ol${styleAttr(template, "ol")}>${lines.map((line) => `<li${styleAttr(template, "li")}>${renderInline(line.replace(/^\d+[.)、]\s+/, ""), template)}</li>`).join("")}</ol>`;
  }

  if (lines.some((line) => /^[-*]\s+/.test(line) || /^\d+[.)、]\s+/.test(line))) {
    return renderMixedLines(lines, template);
  }

  return `<p${styleAttr(template, "p")}>${renderInline(lines.join("<br />"), template)}</p>`;
}

function renderMixedLines(lines: string[], template: RenderTemplate) {
  const parts: string[] = [];
  let paragraph: string[] = [];
  let unordered: string[] = [];
  let ordered: string[] = [];

  function flushParagraph() {
    if (paragraph.length === 0) return;
    parts.push(`<p${styleAttr(template, "p")}>${renderInline(paragraph.join("<br />"), template)}</p>`);
    paragraph = [];
  }

  function flushUnordered() {
    if (unordered.length === 0) return;
    parts.push(`<ul${styleAttr(template, "ul")}>${unordered.map((line) => `<li${styleAttr(template, "li")}>${renderInline(line.replace(/^[-*]\s+/, ""), template)}</li>`).join("")}</ul>`);
    unordered = [];
  }

  function flushOrdered() {
    if (ordered.length === 0) return;
    parts.push(`<ol${styleAttr(template, "ol")}>${ordered.map((line) => `<li${styleAttr(template, "li")}>${renderInline(line.replace(/^\d+[.)、]\s+/, ""), template)}</li>`).join("")}</ol>`);
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

function renderInline(value: string, template: RenderTemplate) {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_match, alt: string, url: string) => {
      return `<img${styleAttr(template, "img")} src="${escapeHtmlAttribute(url)}" alt="${escapeHtmlAttribute(alt)}" />`;
    })
    .replace(/\*\*([^*]+)\*\*/g, `<strong${styleAttr(template, "strong")}>$1</strong>`)
    .replace(/\[([^\]]+)]\((https?:\/\/[^)\s]+)\)/g, `<a${styleAttr(template, "a")} href="$2">$1</a>`);
}

function styleAttr(template: RenderTemplate, key: keyof WechatStyleTemplate["styles"]) {
  return template ? ` style="${escapeHtmlAttribute(template.styles[key])}"` : "";
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
