import { describe, it, expect } from "vitest";
import { renderMarkdown } from "@/server/layout";
import { renderMarkdownWithTheme } from "@/server/layout";
import { getDefaultTheme } from "@/server/layout/themes";
import { ensureModulesRegistered } from "@/server/layout/modules";

ensureModulesRegistered();

describe("基础 Markdown 渲染", () => {
  it("渲染标题 h1-h3", () => {
    const html = renderMarkdown("# 大标题\n## 中标题\n### 小标题");
    expect(html).toContain("<h1");
    expect(html).toContain("<h2");
    expect(html).toContain("<h3");
    expect(html).toContain("大标题");
    expect(html).toContain("中标题");
    expect(html).toContain("小标题");
  });

  it("渲染段落", () => {
    const html = renderMarkdown("这是一个段落。");
    expect(html).toContain("<p");
    expect(html).toContain("这是一个段落。");
  });

  it("渲染加粗", () => {
    const html = renderMarkdown("这是**加粗**文本");
    expect(html).toContain("<strong");
    expect(html).toContain("加粗");
  });

  it("渲染链接", () => {
    const html = renderMarkdown("[点击这里](https://example.com)");
    expect(html).toContain("<a");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain("点击这里");
  });

  it("渲染图片", () => {
    const html = renderMarkdown("![描述](https://example.com/img.png)");
    expect(html).toContain("<img");
    expect(html).toContain('src="https://example.com/img.png"');
    expect(html).toContain('alt="描述"');
  });

  it("渲染无序列表", () => {
    const html = renderMarkdown("- 项目一\n- 项目二\n- 项目三");
    expect(html).toContain("<ul");
    expect(html).toContain("<li");
    expect(html).toContain("项目一");
    expect(html).toContain("项目三");
  });

  it("渲染有序列表", () => {
    const html = renderMarkdown("1. 第一\n2. 第二\n3. 第三");
    expect(html).toContain("<ol");
    expect(html).toContain("第一");
    expect(html).toContain("第三");
  });

  it("渲染分隔线", () => {
    const html = renderMarkdown("---");
    expect(html).toContain("<hr");
  });
});

describe("增强 Markdown 渲染", () => {
  it("渲染表格", () => {
    const md = "| 列1 | 列2 |\n|-----|-----|\n| a   | b   |";
    const html = renderMarkdown(md);
    expect(html).toContain("<table");
    expect(html).toContain("<thead");
    expect(html).toContain("<th");
    expect(html).toContain("列1");
    expect(html).toContain("列2");
  });

  it("渲染引用块", () => {
    const html = renderMarkdown("> 这是一段引用");
    expect(html).toContain("<blockquote");
    expect(html).toContain("这是一段引用");
  });

  it("渲染代码块", () => {
    const html = renderMarkdown("```\nconst x = 1;\n```");
    expect(html).toContain("<pre");
    expect(html).toContain("<code");
    expect(html).toContain("const x = 1;");
  });

  it("渲染行内代码", () => {
    const html = renderMarkdown("使用 `npm install` 安装依赖");
    expect(html).toContain("<code");
    expect(html).toContain("npm install");
  });

  it("渲染删除线", () => {
    const html = renderMarkdown("~~删除文本~~");
    expect(html).toContain("<del");
    expect(html).toContain("删除文本");
  });
});

describe("模块渲染", () => {
  it("渲染 callout 模块（默认 info 变体）", () => {
    const html = renderMarkdown(":::callout\n这是一条信息\n:::");
    expect(html).toContain("<section");
    expect(html).toContain("这是一条信息");
    expect(html).toContain("信息");
  });

  it("渲染 callout tip 变体", () => {
    const html = renderMarkdown(":::callout tip\n提示内容\n:::");
    expect(html).toContain("提示");
    expect(html).toContain("提示内容");
  });

  it("渲染 callout warning 变体", () => {
    const html = renderMarkdown(":::callout warning\n注意\n:::");
    expect(html).toContain("注意");
  });

  it("渲染 hero 模块", () => {
    const html = renderMarkdown(":::hero\neyebrow: 深度观察\ntitle: 主标题\nsubtitle: 副标题\n:::");
    expect(html).toContain("深度观察");
    expect(html).toContain("主标题");
    expect(html).toContain("副标题");
  });

  it("渲染 toc 模块", () => {
    const html = renderMarkdown(":::toc\n序号 | 章节名 | 说明\n1 | 开篇 | 为什么\n2 | 实践 | 怎么做\n:::");
    expect(html).toContain("开篇");
    expect(html).toContain("实践");
  });

  it("渲染 quote 模块（带来源）", () => {
    const html = renderMarkdown(":::quote\n引用内容\n来源 | 作者\n:::");
    expect(html).toContain("引用内容");
    expect(html).toContain("来源");
    expect(html).toContain("作者");
  });

  it("渲染 steps 模块", () => {
    const html = renderMarkdown(":::steps\n1 | 准备 | 安装依赖\n2 | 编码 | 写代码\n:::");
    expect(html).toContain("准备");
    expect(html).toContain("编码");
  });

  it("渲染 cta 模块", () => {
    const html = renderMarkdown(":::cta\ntitle: 开始体验\nnote: 点击按钮\n:::");
    expect(html).toContain("开始体验");
    expect(html).toContain("点击按钮");
  });

  it("渲染 faq 模块", () => {
    const html = renderMarkdown(":::faq\n问题一 | 回答一\n问题二 | 回答二\n:::");
    expect(html).toContain("问题一");
    expect(html).toContain("回答一");
  });

  it("渲染 checklist 模块", () => {
    const html = renderMarkdown(":::checklist\n完成任务一 | done\n未完成任务 | todo\n:::");
    expect(html).toContain("完成任务一");
    expect(html).toContain("未完成任务");
  });

  it("渲染 summary 模块", () => {
    const html = renderMarkdown(":::summary\n要点一\n要点二\n:::");
    expect(html).toContain("要点一");
    expect(html).toContain("要点二");
  });

  it("渲染 notice 模块", () => {
    const html = renderMarkdown(":::notice\ntitle: 通知标题\nbody: 通知内容\n:::");
    expect(html).toContain("通知标题");
    expect(html).toContain("通知内容");
  });
});

describe("混合文档渲染", () => {
  it("文本与模块交替渲染", () => {
    const md = [
      "# 文章标题",
      "",
      "开篇段落内容。",
      "",
      ":::callout tip",
      "这是一个提示。",
      ":::",
      "",
      "中间段落。",
      "",
      ":::hero",
      "eyebrow: 重点",
      "title: 核心观点",
      ":::",
      "",
      "结尾段落。"
    ].join("\n");

    const html = renderMarkdown(md);
    expect(html).toContain("<h1");
    expect(html).toContain("文章标题");
    expect(html).toContain("开篇段落内容。");
    expect(html).toContain("这是一个提示。");
    expect(html).toContain("核心观点");
    expect(html).toContain("结尾段落。");
  });

  it("未注册模块保留原文", () => {
    const html = renderMarkdown(":::unknownmodule\n内容\n:::");
    expect(html).toContain(":::unknownmodule");
    expect(html).toContain("内容");
  });
});

describe("主题渲染", () => {
  it("默认主题包含 inline CSS", () => {
    const html = renderMarkdown("段落内容");
    expect(html).toContain("style=");
  });

  it("不同主题产生不同样式", () => {
    const clean = renderMarkdown("# 标题", "clean_newsletter");
    const bold = renderMarkdown("# 标题", "bold_review");
    expect(clean).not.toEqual(bold);
    expect(clean).toContain("style=");
    expect(bold).toContain("style=");
  });

  it("使用 ResolvedTheme 渲染", () => {
    const theme = getDefaultTheme();
    const html = renderMarkdownWithTheme("段落", theme);
    expect(html).toContain("<p");
    expect(html).toContain("style=");
  });
});
