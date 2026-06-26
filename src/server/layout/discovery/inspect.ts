/**
 * 文章就绪检查（inspect）
 *
 * 检查文章的标题、摘要、封面、图片、模块使用等，输出 readiness 报告。
 * 增强：字数/阅读时间、标题摘要长度上限、外部图片警告、模块分类统计、CTA 建议。
 */

import { prisma } from "@/server/db/prisma";
import { parseDocument } from "@/server/layout/parser/document";
import { builtinModuleResolver, ensureModulesRegistered } from "@/server/layout/modules";
import type { InspectResult, InspectCheck } from "@/server/layout/types";

// 微信公众号官方限制
const WX_TITLE_MAX = 64;
const WX_DIGEST_MAX = 120;
const WX_COVER_RATIO = 2.35; // 900x383 推荐比例
const READ_SPEED_CPM = 400; // 每分钟字数
const MIN_ARTICLE_CHARS = 100;
const MAX_ARTICLE_CHARS = 8000; // 长文警告阈值

export async function inspectArticle(articleId: string): Promise<InspectResult | null> {
  ensureModulesRegistered();
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) return null;

  const checks: InspectCheck[] = [];

  // ===== 标题 =====
  const title = article.title?.trim() || "";
  const titleLen = title.length;
  let titleOk = titleLen > 0;
  let titleMsg: string | undefined;
  if (titleLen === 0) titleMsg = "标题为空";
  else if (titleLen > WX_TITLE_MAX) {
    titleOk = false;
    titleMsg = `标题长度 ${titleLen} 超过微信限制 ${WX_TITLE_MAX} 字`;
  }
  checks.push({ key: "title", ok: titleOk, value: title, count: titleLen, message: titleMsg });

  // ===== 摘要 =====
  const digest = article.digest?.trim() || "";
  const digestLen = digest.length;
  let digestOk = digestLen > 0;
  let digestMsg: string | undefined;
  if (digestLen === 0) digestMsg = "摘要为空（微信草稿箱建议填写摘要）";
  else if (digestLen > WX_DIGEST_MAX) {
    digestOk = false;
    digestMsg = `摘要长度 ${digestLen} 超过微信限制 ${WX_DIGEST_MAX} 字`;
  }
  checks.push({ key: "digest", ok: digestOk, value: digest, count: digestLen, message: digestMsg });

  // ===== 封面 =====
  const hasCover = !!article.coverPath?.trim();
  checks.push({
    key: "cover",
    ok: hasCover,
    value: article.coverPath || undefined,
    message: hasCover ? undefined : "缺少封面图（微信草稿箱必需，建议 900x383 像素）"
  });

  // ===== 内容存在性 =====
  const markdown = article.contentMarkdown || "";
  const hasContent = !!markdown.trim();
  checks.push({
    key: "content",
    ok: hasContent,
    message: hasContent ? undefined : "内容为空"
  });

  // ===== 字数 / 阅读时间 =====
  const charCount = markdown.replace(/\s/g, "").length;
  const readTimeMin = Math.max(1, Math.ceil(charCount / READ_SPEED_CPM));
  let wordCountOk = charCount >= MIN_ARTICLE_CHARS;
  let wordCountMsg = `约 ${charCount} 字，预计阅读 ${readTimeMin} 分钟`;
  if (charCount > 0 && charCount < MIN_ARTICLE_CHARS) {
    wordCountMsg += `（内容偏短，建议至少 ${MIN_ARTICLE_CHARS} 字）`;
  } else if (charCount > MAX_ARTICLE_CHARS) {
    wordCountMsg += `（内容较长，移动端阅读疲劳，建议拆分为系列）`;
  }
  checks.push({ key: "wordCount", ok: wordCountOk, count: charCount, message: wordCountMsg });

  // ===== 图片 =====
  const imageRegex = /!\[[^\]]*]\(([^)]+)\)/g;
  const imageUrls: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = imageRegex.exec(markdown)) !== null) {
    imageUrls.push(m[1]);
  }
  const externalImages = imageUrls.filter((u) => !u.startsWith("mmbiz.qpic.cn") && /^https?:\/\//.test(u));
  let imagesMsg: string | undefined;
  if (imageUrls.length === 0) imagesMsg = "正文中无图片（微信文章建议至少 1 张配图）";
  else if (externalImages.length > 0) {
    imagesMsg = `${externalImages.length} 张图片为外部 URL，推送时需上传到微信图库（共 ${imageUrls.length} 张）`;
  }
  checks.push({
    key: "images",
    ok: externalImages.length === 0,
    count: imageUrls.length,
    message: imagesMsg
  });

  // ===== 模块使用 =====
  const blocks = parseDocument(markdown, { resolver: builtinModuleResolver });
  const moduleBlocks = blocks.filter((b) => b.type === "module");
  const usedModules = moduleBlocks.map((b) => (b.type === "module" ? b.module.name : ""));
  const unknownModules = moduleBlocks
    .filter((b) => b.type === "module" && b.module.unknown)
    .map((b) => (b.type === "module" ? b.module.name : ""));
  const parseErrors = moduleBlocks
    .filter((b) => b.type === "module" && b.module.parseError)
    .map((b) => (b.type === "module" ? { name: b.module.name, error: b.module.parseError! } : null))
    .filter(Boolean) as { name: string; error: string }[];

  let modulesMsg: string | undefined;
  if (unknownModules.length > 0) {
    modulesMsg = `存在 ${unknownModules.length} 个未注册模块: ${unknownModules.join(", ")}`;
  } else if (parseErrors.length > 0) {
    modulesMsg = `${parseErrors.length} 个模块解析失败: ${parseErrors.map((p) => p.name).join(", ")}`;
  } else if (usedModules.length === 0) {
    modulesMsg = "未使用任何高级排版模块（可使用 :::hero、:::callout 等增强排版）";
  }
  checks.push({
    key: "modules",
    ok: unknownModules.length === 0 && parseErrors.length === 0,
    used: usedModules,
    unknown: unknownModules,
    count: usedModules.length,
    message: modulesMsg
  });

  // ===== CTA 建议（不强制）=====
  const hasCTA = usedModules.some((n) => ["cta", "subscribe", "author-card"].includes(n));
  checks.push({
    key: "cta",
    ok: true, // 建议项，不影响 ready
    message: hasCTA ? undefined : "建议文末添加 :::cta 或 :::subscribe 模块，提升转化"
  });

  // ===== 链接检查 =====
  const linkRegex = /\[[^\]]+]\(([^)]+)\)/g;
  const links: string[] = [];
  while ((m = linkRegex.exec(markdown)) !== null) {
    if (!m[0].startsWith("!")) links.push(m[1]);
  }
  const externalLinks = links.filter((u) => /^https?:\/\//.test(u) && !u.startsWith("mmbiz.qpic.cn"));
  checks.push({
    key: "links",
    ok: true,
    count: links.length,
    message:
      externalLinks.length === 0
        ? undefined
        : `${externalLinks.length} 个外部链接（微信公众号正文外链不可点击，仅小程序链接可跳转）`
  });

  // ===== 就绪判定 =====
  const requiredKeys = ["title", "digest", "cover", "content"];
  const ready = checks.filter((c) => requiredKeys.includes(c.key)).every((c) => c.ok);

  return { ready, checks };
}
