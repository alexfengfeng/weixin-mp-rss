/**
 * 高级排版系统共享类型定义
 *
 * 所有 :::module 解析、渲染、主题、discovery 相关的共享类型集中在此文件。
 */

/* ========================================
 * Body 格式与解析结果
 * ======================================== */

export type BodyFormat = "fields" | "rows" | "json_object" | "json_array" | "text";

/** fields 格式的单个字段（key: value） */
export interface Field {
  key: string;
  value: string;
}

/** rows 格式的单行（管道符分隔） */
export interface Row {
  cells: string[];
}

/** 解析后的 body 内容 */
export interface ParsedBody {
  format: BodyFormat;
  /** fields 格式的字段列表 */
  fields?: Field[];
  /** rows 格式的行列表（不含标题） */
  rows?: Row[];
  /** rows 格式的标题（由模块定义 hasTitle 决定） */
  title?: string;
  /** json_object / json_array 格式的解析结果 */
  json?: unknown;
  /** text 格式的原始文本 */
  text?: string;
}

/* ========================================
 * 模块解析结果
 * ======================================== */

/** 解析后的 :::module 块 */
export interface ParsedModule {
  /** 模块名，如 "hero"、"callout" */
  name: string;
  /** 变体，如 callout 的 "tip"、"warning" */
  variant?: string;
  /** 可选标题（:::name 后面的文本，非 fields 的 title 字段） */
  title?: string;
  /** 解析后的 body */
  body: ParsedBody;
  /** 原始文本（含 :::name 和 :::） */
  raw: string;
  /** 起始行号（0-based） */
  startLine: number;
  /** 结束行号（0-based，::: 行） */
  endLine: number;
  /** 是否为未注册模块 */
  unknown?: boolean;
  /** 解析错误信息 */
  parseError?: string;
}

/* ========================================
 * 文档块
 * ======================================== */

export type Block =
  | { type: "text"; lines: string[] }
  | { type: "module"; module: ParsedModule };

/* ========================================
 * 模块定义
 * ======================================== */

export interface FieldDef {
  name: string;
  required: boolean;
  description?: string;
}

export interface LayoutModuleDef {
  /** 模块唯一标识，如 "hero" */
  id: string;
  /** 分类，如 "opening"、"infographic" */
  category: ModuleCategory;
  /** 显示名称 */
  label: string;
  /** 描述 */
  description: string;
  /** body 格式 */
  bodyFormat: BodyFormat;
  /** rows 格式是否支持标题行 */
  hasTitle?: boolean;
  /** fields 格式的字段定义 */
  fields?: FieldDef[];
  /** rows 格式的列定义 */
  columns?: string[];
  /** 支持的变体列表，如 callout 的 ["info","tip","warning","success","danger"] */
  variants?: string[];
  /** 默认变体 */
  defaultVariant?: string;
  /** 示例 */
  examples?: string[];
  /** 引入版本 */
  since?: string;
}

export type ModuleCategory =
  | "opening"
  | "infographic"
  | "judgment"
  | "evidence"
  | "conversion"
  | "brand"
  | "sprint4";

/* ========================================
 * 模块渲染器
 * ======================================== */

export type ModuleRenderer = (module: ParsedModule, ctx: RenderContext) => string;

export interface RegisteredModule {
  def: LayoutModuleDef;
  render: ModuleRenderer;
}

/* ========================================
 * 主题系统
 * ======================================== */

export interface ThemeTokens {
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
  font: {
    baseSize: number;
    scale: number;
    family: string;
  };
  spacing: {
    unit: number;
    scale: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
}

/** 基础元素样式键 */
export type BaseStyleKey =
  | "h1"
  | "h2"
  | "h3"
  | "p"
  | "ul"
  | "ol"
  | "li"
  | "hr"
  | "img"
  | "strong"
  | "a"
  | "blockquote"
  | "code"
  | "pre"
  | "table"
  | "th"
  | "td";

export type BaseStyles = Partial<Record<BaseStyleKey, string>>;

/** 模块专用样式：moduleName -> styleKey -> css */
export type ModuleStyles = Record<string, Record<string, string>>;

export interface ThemeStyles {
  /** 基础元素样式 */
  base: BaseStyles;
  /** 模块专用样式 */
  modules: ModuleStyles;
}

export interface ResolvedTheme {
  id: string;
  name: string;
  description?: string;
  tokens?: ThemeTokens;
  styles: ThemeStyles;
  version: number;
  background: string;
}

/* ========================================
 * 渲染上下文
 * ======================================== */

export interface RenderContext {
  theme: ResolvedTheme;
  /** 渲染行内 markdown（**粗体**、链接、图片、`行内代码`） */
  renderInline(text: string): string;
  /** 渲染模块内富文本（支持基础块：段落、列表等） */
  renderMarkdown(text: string): string;
  /** HTML 转义 */
  escapeHtml(text: string): string;
  /** HTML 属性转义 */
  escapeAttr(text: string): string;
  /** 获取基础样式 → ` style="..."` 或空字符串 */
  style(key: BaseStyleKey): string;
  /** 获取模块样式 → ` style="..."` 或空字符串 */
  moduleStyle(moduleName: string, key: string): string;
}

/* ========================================
 * Discovery 相关
 * ======================================== */

export interface ModuleSummary {
  name: string;
  category: ModuleCategory;
  label: string;
  description: string;
  bodyFormat: BodyFormat;
  hasTitle?: boolean;
  variants?: string[];
  example?: string;
}

export interface ThemeSummary {
  id: string;
  name: string;
  description?: string;
  version: number;
  background: string;
  isBuiltin: boolean;
}

export interface InspectCheck {
  key: string;
  ok: boolean;
  value?: string;
  message?: string;
  count?: number;
  used?: string[];
  unknown?: string[];
}

export interface InspectResult {
  ready: boolean;
  checks: InspectCheck[];
}
