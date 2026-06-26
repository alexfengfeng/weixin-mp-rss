/**
 * 批量生成主题文件脚本
 * 基于 tokens 模板生成 28 个新主题，达到 48 个总数。
 */

import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const BUILTIN_DIR = path.join(process.cwd(), "src/server/layout/themes/builtin");

type ThemeSpec = {
  id: string;
  name: string;
  description: string;
  category: string;
  background: "plain" | "warm" | "dark";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    muted: string;
    bg: string;
    surface: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  font: { baseSize: number; scale: number; family: string };
  spacing: { unit: number; scale: number };
  radius: { sm: number; md: number; lg: number };
  sortOrder: number;
};

// 28 个新主题规格（sortOrder 从 20 开始）
const SPECS: ThemeSpec[] = [
  // 红色系（4）
  { id: "crimson_passion", name: "猩红热情", description: "猩红色调、强视觉冲击，适合热点评论和活动推广。", category: "warm", background: "plain", colors: { primary: "#7f1d1d", secondary: "#991b1b", accent: "#dc2626", text: "#1f2937", muted: "#6b7280", bg: "#fff", surface: "#fef2f2", border: "#fecaca", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.5 }, radius: { sm: 4, md: 6, lg: 8 }, sortOrder: 20 },
  { id: "coral_warm", name: "珊瑚暖阳", description: "珊瑚色暖调，适合旅行、美食、生活方式类内容。", category: "warm", background: "warm", colors: { primary: "#9a3412", secondary: "#c2410c", accent: "#f97316", text: "#292524", muted: "#78716c", bg: "#fff7ed", surface: "#ffedd5", border: "#fed7aa", success: "#16a34a", warning: "#ca8a04", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 6, md: 10, lg: 14 }, sortOrder: 21 },
  { id: "brick_earth", name: "砖红大地", description: "砖红色调、厚重质感，适合历史、建筑、传统文化类内容。", category: "warm", background: "warm", colors: { primary: "#7c2d12", secondary: "#9a3412", accent: "#b45309", text: "#292524", muted: "#78716c", bg: "#fef3c7", surface: "#fde68a", border: "#fcd34d", success: "#65a30d", warning: "#ca8a04", danger: "#b91c1c" }, font: { baseSize: 16, scale: 1.25, family: 'Georgia, "Songti SC", serif' }, spacing: { unit: 8, scale: 1.6 }, radius: { sm: 2, md: 4, lg: 6 }, sortOrder: 22 },
  { id: "cherry_blossom", name: "樱花粉", description: "樱花粉色调、温柔少女感，适合美妆、恋爱、治愈系内容。", category: "warm", background: "warm", colors: { primary: "#9d174d", secondary: "#be185d", accent: "#ec4899", text: "#1f2937", muted: "#9ca3af", bg: "#fdf2f8", surface: "#fce7f3", border: "#fbcfe8", success: "#16a34a", warning: "#ea580c", danger: "#be123c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 8, md: 12, lg: 16 }, sortOrder: 23 },

  // 蓝色系（4）
  { id: "deep_navy", name: "深海藏蓝", description: "深藏蓝主调、稳重专业，适合金融、法律、企业号内容。", category: "pro", background: "plain", colors: { primary: "#1e3a8a", secondary: "#1e40af", accent: "#2563eb", text: "#1f2937", muted: "#6b7280", bg: "#fff", surface: "#eff6ff", border: "#bfdbfe", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.5 }, radius: { sm: 2, md: 4, lg: 6 }, sortOrder: 24 },
  { id: "sky_bright", name: "天晴亮蓝", description: "明亮天蓝色调、清爽干净，适合教育、公益、科普类内容。", category: "pro", background: "plain", colors: { primary: "#0369a1", secondary: "#0284c7", accent: "#0ea5e9", text: "#1f2937", muted: "#64748b", bg: "#fff", surface: "#f0f9ff", border: "#bae6fd", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 6, md: 8, lg: 12 }, sortOrder: 25 },
  { id: "denim_casual", name: "牛仔休闲", description: "牛仔蓝色调、休闲随意，适合青年文化、潮流、校园内容。", category: "style", background: "plain", colors: { primary: "#1e40af", secondary: "#3730a3", accent: "#4f46e5", text: "#1f2937", muted: "#6b7280", bg: "#f8fafc", surface: "#eef2ff", border: "#c7d2fe", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.2, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.5 }, radius: { sm: 4, md: 6, lg: 10 }, sortOrder: 26 },
  { id: "teal_fresh", name: "青碧清新", description: "青碧色调、清新明亮，适合健康、运动、户外类内容。", category: "style", background: "plain", colors: { primary: "#0f766e", secondary: "#115e59", accent: "#14b8a6", text: "#1f2937", muted: "#64748b", bg: "#fff", surface: "#f0fdfa", border: "#99f6e4", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 6, md: 10, lg: 14 }, sortOrder: 27 },

  // 绿色系（4）
  { id: "mint_cool", name: "薄荷清凉", description: "薄荷绿色调、清凉舒爽，适合夏日、饮品、健康类内容。", category: "style", background: "plain", colors: { primary: "#166534", secondary: "#15803d", accent: "#22c55e", text: "#1f2937", muted: "#6b7280", bg: "#f0fdf4", surface: "#dcfce7", border: "#bbf7d0", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 6, md: 10, lg: 14 }, sortOrder: 28 },
  { id: "olive_natural", name: "橄榄自然", description: "橄榄绿色调、自然质朴，适合环保、农业、有机生活类内容。", category: "style", background: "warm", colors: { primary: "#365314", secondary: "#4d7c0f", accent: "#65a30d", text: "#292524", muted: "#78716c", bg: "#f7fee7", surface: "#ecfccb", border: "#d9f99d", success: "#65a30d", warning: "#ca8a04", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 4, md: 6, lg: 8 }, sortOrder: 29 },
  { id: "bamboo_zen", name: "竹意禅心", description: "竹绿色调、禅意宁静，适合茶道、冥想、传统文化类内容。", category: "culture", background: "warm", colors: { primary: "#1a2e05", secondary: "#3f6212", accent: "#4d7c0f", text: "#1c1917", muted: "#78716c", bg: "#fefce8", surface: "#fef9c3", border: "#fde68a", success: "#65a30d", warning: "#ca8a04", danger: "#b91c1c" }, font: { baseSize: 16, scale: 1.3, family: 'Georgia, "Songti SC", serif' }, spacing: { unit: 8, scale: 1.7 }, radius: { sm: 2, md: 4, lg: 6 }, sortOrder: 30 },
  { id: "emerald_lux", name: "翡翠奢华", description: "翡翠绿色调、高级奢华感，适合珠宝、奢侈品、高端生活方式。", category: "style", background: "dark", colors: { primary: "#064e3b", secondary: "#065f46", accent: "#10b981", text: "#e5e7eb", muted: "#9ca3af", bg: "#0f172a", surface: "#1e293b", border: "#334155", success: "#10b981", warning: "#f59e0b", danger: "#ef4444" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.5 }, radius: { sm: 6, md: 10, lg: 14 }, sortOrder: 31 },

  // 黄/橙系（3）
  { id: "amber_glow", name: "琥珀暖光", description: "琥珀金黄色调、温暖明亮，适合读书、咖啡、慢生活类内容。", category: "style", background: "warm", colors: { primary: "#78350f", secondary: "#92400e", accent: "#d97706", text: "#292524", muted: "#78716c", bg: "#fffbeb", surface: "#fef3c7", border: "#fde68a", success: "#65a30d", warning: "#ca8a04", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 4, md: 8, lg: 12 }, sortOrder: 32 },
  { id: "lemon_zesty", name: "柠檬活力", description: "柠檬黄色调、活泼明亮，适合创意、设计、灵感类内容。", category: "style", background: "plain", colors: { primary: "#713f12", secondary: "#854d0e", accent: "#eab308", text: "#1f2937", muted: "#6b7280", bg: "#fefce8", surface: "#fef9c3", border: "#fde047", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.2, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.5 }, radius: { sm: 6, md: 10, lg: 14 }, sortOrder: 33 },
  { id: "honey_gold", name: "蜜糖金", description: "蜜糖金色调、甜蜜温暖，适合亲子、美食、烘焙类内容。", category: "warm", background: "warm", colors: { primary: "#7c2d12", secondary: "#9a3412", accent: "#f59e0b", text: "#292524", muted: "#78716c", bg: "#fff7ed", surface: "#ffedd5", border: "#fed7aa", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 8, md: 12, lg: 16 }, sortOrder: 34 },

  // 紫色系（3）
  { id: "lavender_dream", name: "薰衣草梦", description: "薰衣草紫色调、梦幻浪漫，适合情感、文艺、婚礼类内容。", category: "style", background: "warm", colors: { primary: "#581c87", secondary: "#6b21a8", accent: "#9333ea", text: "#1f2937", muted: "#9ca3af", bg: "#faf5ff", surface: "#f3e8ff", border: "#e9d5ff", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 8, md: 12, lg: 16 }, sortOrder: 35 },
  { id: "grape_deep", name: "葡萄深紫", description: "深紫色调、神秘高贵，适合艺术、哲学、深度思考类内容。", category: "style", background: "dark", colors: { primary: "#581c87", secondary: "#6b21a8", accent: "#a855f7", text: "#e5e7eb", muted: "#9ca3af", bg: "#1e1b2e", surface: "#2d2a44", border: "#3d3a5c", success: "#10b981", warning: "#f59e0b", danger: "#ef4444" }, font: { baseSize: 15, scale: 1.25, family: 'Georgia, "Songti SC", serif' }, spacing: { unit: 8, scale: 1.6 }, radius: { sm: 4, md: 6, lg: 8 }, sortOrder: 36 },
  { id: "violet_mist", name: "紫罗兰雾", description: "紫罗兰淡紫色、朦胧柔和，适合诗歌、摄影、美学类内容。", category: "style", background: "plain", colors: { primary: "#5b21b6", secondary: "#6d28d9", accent: "#8b5cf6", text: "#1f2937", muted: "#9ca3af", bg: "#f5f3ff", surface: "#ede9fe", border: "#ddd6fe", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.6 }, radius: { sm: 6, md: 10, lg: 14 }, sortOrder: 37 },

  // 灰/黑系（4）
  { id: "slate_pro", name: "岩灰专业", description: "岩灰色调、冷静专业，适合 B2B、SaaS、企业服务类内容。", category: "pro", background: "plain", colors: { primary: "#0f172a", secondary: "#334155", accent: "#475569", text: "#1e293b", muted: "#64748b", bg: "#f8fafc", surface: "#f1f5f9", border: "#e2e8f0", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 14, scale: 1.2, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.45 }, radius: { sm: 2, md: 4, lg: 6 }, sortOrder: 38 },
  { id: "charcoal_dark", name: "炭黑深邃", description: "炭黑深色背景、白色文字，适合科技、极客、夜间阅读。", category: "pro", background: "dark", colors: { primary: "#e5e7eb", secondary: "#d1d5db", accent: "#60a5fa", text: "#f3f4f6", muted: "#9ca3af", bg: "#111827", surface: "#1f2937", border: "#374151", success: "#34d399", warning: "#fbbf24", danger: "#f87171" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 4, md: 6, lg: 8 }, sortOrder: 39 },
  { id: "graphite_mono", name: "石墨单色", description: "石墨色单色调、极简克制，适合深度长文、行业观察类内容。", category: "style", background: "plain", colors: { primary: "#18181b", secondary: "#27272a", accent: "#52525b", text: "#27272a", muted: "#71717a", bg: "#fafafa", surface: "#f4f4f5", border: "#e4e4e7", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: 'Georgia, "Songti SC", serif' }, spacing: { unit: 8, scale: 1.6 }, radius: { sm: 0, md: 0, lg: 0 }, sortOrder: 40 },
  { id: "pearl_luxe", name: "珍珠奢华", description: "珍珠白+金色点缀、低调奢华，适合高端品牌、奢侈品内容。", category: "culture", background: "warm", colors: { primary: "#44403c", secondary: "#57534e", accent: "#a16207", text: "#292524", muted: "#a8a29e", bg: "#fafaf9", surface: "#f5f5f4", border: "#e7e5e4", success: "#65a30d", warning: "#ca8a04", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: 'Georgia, "Songti SC", serif' }, spacing: { unit: 8, scale: 1.6 }, radius: { sm: 2, md: 4, lg: 6 }, sortOrder: 41 },

  // 多彩/渐变系（3）
  { id: "rainbow_vibrant", name: "彩虹缤纷", description: "多彩配色、活泼有趣，适合亲子、教育、活动推广类内容。", category: "style", background: "plain", colors: { primary: "#7c3aed", secondary: "#2563eb", accent: "#f59e0b", text: "#1f2937", muted: "#6b7280", bg: "#fff", surface: "#fef3c7", border: "#fde68a", success: "#16a34a", warning: "#ea580c", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.2, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.5 }, radius: { sm: 8, md: 12, lg: 16 }, sortOrder: 42 },
  { id: "neon_cyber", name: "霓虹赛博", description: "霓虹荧光色、赛博朋克风，适合科技、AI、Web3 类内容。", category: "pro", background: "dark", colors: { primary: "#22d3ee", secondary: "#a78bfa", accent: "#f472b6", text: "#e5e7eb", muted: "#9ca3af", bg: "#0a0a0f", surface: "#13131f", border: "#1e1e2e", success: "#34d399", warning: "#fbbf24", danger: "#f87171" }, font: { baseSize: 14, scale: 1.2, family: 'ui-monospace, "Cascadia Code", monospace' }, spacing: { unit: 8, scale: 1.5 }, radius: { sm: 0, md: 2, lg: 4 }, sortOrder: 43 },
  { id: "aurora_night", name: "极光夜空", description: "极光渐变色、深色背景，适合天文、科幻、梦想类内容。", category: "style", background: "dark", colors: { primary: "#67e8f9", secondary: "#86efac", accent: "#c4b5fd", text: "#e5e7eb", muted: "#9ca3af", bg: "#0c1929", surface: "#162236", border: "#1e2d44", success: "#34d399", warning: "#fbbf24", danger: "#f87171" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 6, md: 10, lg: 14 }, sortOrder: 44 },

  // 棕/米系（3）
  { id: "coffee_cozy", name: "咖啡温馨", description: "咖啡棕色调、温馨舒适，适合读书、咖啡、慢生活类内容。", category: "warm", background: "warm", colors: { primary: "#451a03", secondary: "#78350f", accent: "#92400e", text: "#292524", muted: "#78716c", bg: "#fdf6e3", surface: "#f5e6c8", border: "#e7d5a0", success: "#65a30d", warning: "#ca8a04", danger: "#b91c1c" }, font: { baseSize: 16, scale: 1.3, family: 'Georgia, "Songti SC", serif' }, spacing: { unit: 8, scale: 1.65 }, radius: { sm: 4, md: 6, lg: 8 }, sortOrder: 45 },
  { id: "sand_desert", name: "沙漠沙金", description: "沙金色调、干燥温暖，适合旅行、探险、自然类内容。", category: "style", background: "warm", colors: { primary: "#78350f", secondary: "#92400e", accent: "#b45309", text: "#292524", muted: "#78716c", bg: "#fef3c7", surface: "#fde68a", border: "#fcd34d", success: "#65a30d", warning: "#ca8a04", danger: "#b91c1c" }, font: { baseSize: 15, scale: 1.25, family: '-apple-system, "PingFang SC", sans-serif' }, spacing: { unit: 8, scale: 1.55 }, radius: { sm: 2, md: 4, lg: 6 }, sortOrder: 46 },
  { id: "wood_craft", name: "原木手作", description: "原木色调、手作质感，适合手工艺、家居、木工类内容。", category: "culture", background: "warm", colors: { primary: "#451a03", secondary: "#78350f", accent: "#a16207", text: "#292524", muted: "#78716c", bg: "#fefce8", surface: "#fef3c7", border: "#fde68a", success: "#65a30d", warning: "#ca8a04", danger: "#b91c1c" }, font: { baseSize: 16, scale: 1.3, family: 'Georgia, "Songti SC", serif' }, spacing: { unit: 8, scale: 1.6 }, radius: { sm: 2, md: 4, lg: 6 }, sortOrder: 47 }
];

function generateThemeFile(spec: ThemeSpec): string {
  const tokensStr = JSON.stringify({ colors: spec.colors, font: spec.font, spacing: spec.spacing, radius: spec.radius }, null, 2);
  const isDark = spec.background === "dark";
  const textColor = isDark ? spec.colors.text : spec.colors.text;
  const headingColor = spec.colors.primary;
  const bgSurface = spec.colors.surface;

  return `/**
 * ${spec.name}主题
 * ${spec.description}
 */

import type { BuiltinTheme } from "@/server/layout/themes/tokens";
import { generateDefaultModuleStyles } from "@/server/layout/themes/tokens";

const tokens = ${tokensStr};

export const ${toCamelCase(spec.id)}Theme: BuiltinTheme = {
  id: "${spec.id}",
  name: "${spec.name}",
  description: "${spec.description}",
  tokens,
  styles: {
    base: {
      h1: "margin:0 0 22px;color:${headingColor};font-size:25px;line-height:1.4;font-weight:700;text-align:center;",
      h2: "margin:28px 0 12px;color:${headingColor};font-size:19px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:${spec.colors.secondary};font-size:16px;line-height:1.55;font-weight:600;",
      p: "margin:0 0 15px;color:${textColor};font-size:${spec.font.baseSize}px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:${textColor};font-size:${spec.font.baseSize}px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:${textColor};font-size:${spec.font.baseSize}px;line-height:1.85;",
      li: "margin:0 0 6px;",
      hr: "margin:28px 0;border:0;border-top:1px solid ${spec.colors.border};",
      img: "max-width:100%;height:auto;border-radius:${spec.radius.md}px;",
      strong: "color:${headingColor};font-weight:700;",
      a: "color:${spec.colors.accent};text-decoration:none;border-bottom:1px solid ${spec.colors.border};",
      blockquote: "margin:0 0 16px;padding:14px 20px;border-left:3px solid ${spec.colors.accent};background:${bgSurface};border-radius:0 ${spec.radius.md}px ${spec.radius.md}px 0;color:${spec.colors.muted};",
      code: "background:${bgSurface};padding:2px 6px;border-radius:${spec.radius.sm}px;font-size:0.88em;color:${spec.colors.secondary};font-family:monospace;",
      pre: "margin:0 0 16px;padding:16px;background:${bgSurface};border-radius:${spec.radius.md}px;overflow-x:auto;",
      table: "width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px;",
      th: "padding:10px 12px;text-align:left;border:1px solid ${spec.colors.border};background:${spec.colors.accent};color:#fff;font-weight:700;",
      td: "padding:8px 12px;border:1px solid ${spec.colors.border};color:${textColor};"
    },
    modules: generateDefaultModuleStyles(tokens)
  },
  version: 1,
  background: "${spec.background}",
  sortOrder: ${spec.sortOrder}
};
`;
}

function toCamelCase(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// 生成文件
mkdirSync(BUILTIN_DIR, { recursive: true });
for (const spec of SPECS) {
  const filename = spec.id.replace(/_/g, "-") + ".ts";
  const filepath = path.join(BUILTIN_DIR, filename);
  writeFileSync(filepath, generateThemeFile(spec), "utf-8");
  console.log(`Generated: ${filename}`);
}
console.log(`\nTotal: ${SPECS.length} themes generated`);
