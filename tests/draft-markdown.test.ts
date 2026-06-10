import { describe, expect, test } from "vitest";
import { extractMarkdownImageUrls, markdownToWechatHtml, replaceImageUrlsInHtml } from "@/server/drafts/markdown";

describe("draft markdown rendering", () => {
  test("renders common markdown to wechat friendly html", () => {
    const html = markdownToWechatHtml("# 标题\n\n正文 **加粗**\n\n[链接](https://example.com)");

    expect(html).toContain("<h1>标题</h1>");
    expect(html).toContain("<p>正文 <strong>加粗</strong></p>");
    expect(html).toContain('<a href="https://example.com">链接</a>');
  });

  test("extracts and replaces markdown image urls", () => {
    const markdown = "![封面](/uploads/a.png)\n\n![远程](https://example.com/b.jpg)";
    const urls = extractMarkdownImageUrls(markdown);
    const html = markdownToWechatHtml(markdown);

    expect(urls).toEqual(["/uploads/a.png", "https://example.com/b.jpg"]);
    expect(replaceImageUrlsInHtml(html, new Map([["/uploads/a.png", "https://mmbiz/a.png"]]))).toContain(
      'src="https://mmbiz/a.png"'
    );
  });

  test("renders separators and ordered lists for wechat drafts", () => {
    const html = markdownToWechatHtml("前言\n\n---\n\n1. 第一步\n2. 第二步\n3. 第三步");

    expect(html).toContain("<hr />");
    expect(html).not.toContain("<p>---</p>");
    expect(html).toContain("<ol><li>第一步</li><li>第二步</li><li>第三步</li></ol>");
  });

  test("normalizes pasted html breaks before rendering lists", () => {
    const html = markdownToWechatHtml("1. WorkBuddy 捕捉碎片<br />2. IMA 自动归类关联<br />3. WorkBuddy 随时调用");

    expect(html).toContain("<ol>");
    expect(html).toContain("<li>WorkBuddy 捕捉碎片</li>");
    expect(html).not.toContain("&lt;br");
  });

  test("renders mixed paragraph and ordered list blocks", () => {
    const html = markdownToWechatHtml("这对组合的威力体现在一条自动化链路上：\n1. 捕捉碎片\n2. 自动归类\n3. 随时调用");

    expect(html).toContain("<p>这对组合的威力体现在一条自动化链路上：</p>");
    expect(html).toContain("<ol><li>捕捉碎片</li><li>自动归类</li><li>随时调用</li></ol>");
  });

  test("applies wechat style templates when template id is provided", () => {
    const clean = markdownToWechatHtml("# 标题\n\n正文\n\n1. 第一步\n2. 第二步\n\n---", "clean");
    const magazine = markdownToWechatHtml("# 标题\n\n正文\n\n1. 第一步\n2. 第二步\n\n---", "magazine");
    const compact = markdownToWechatHtml("# 标题\n\n正文\n\n1. 第一步\n2. 第二步\n\n---", "compact");

    expect(clean).toContain('<h1 style="');
    expect(clean).toContain('<p style="');
    expect(clean).toContain('<ol style="');
    expect(clean).toContain('<hr style="');
    expect(magazine).not.toBe(clean);
    expect(compact).not.toBe(clean);
  });

  test("falls back to clean style template for unknown ids", () => {
    expect(markdownToWechatHtml("# 标题", "missing")).toBe(markdownToWechatHtml("# 标题", "clean"));
  });
});
