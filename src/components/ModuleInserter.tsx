"use client";

import { useRef, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ChevronDown, ChevronRight } from "lucide-react";

/** 单个排版模块的描述 */
export type ModuleDescriptor = {
  name: string;
  label: string;
  category: string;
  description: string;
  bodyFormat: "fields" | "rows" | "json_object" | "json_array" | "text";
  hasTitle: boolean;
  variants?: string[];
  example: string;
};

/** 39 个内置模块清单（与后端 registry 保持一致） */
export const MODULE_CATALOG: ModuleDescriptor[] = [
  // opening
  { name: "hero", label: "文章开头", category: "opening", description: "文章顶部引导块，含标题、副标题、作者、日期", bodyFormat: "fields", hasTitle: false, example: ":::hero\n标题: 文章标题\n副标题: 一句话概括\n作者: 作者名\n日期: 2025-01-01\n:::" },
  { name: "toc", label: "目录", category: "opening", description: "自动生成文章目录锚点链接", bodyFormat: "text", hasTitle: false, example: ":::toc\n# 第一章\n## 第一节\n### 小标题\n# 第二章\n:::" },
  { name: "cards", label: "卡片组", category: "opening", description: "并排卡片，每卡含标题、正文、链接", bodyFormat: "rows", hasTitle: true, example: ":::cards 推荐阅读\n标题 | 正文 | 链接\n卡片一 | 摘要文字 | https://...\n卡片二 | 摘要文字 | https://...\n:::" },
  { name: "part", label: "章节分隔", category: "opening", description: "章节起始标记，含小标签和标题", bodyFormat: "fields", hasTitle: false, example: ":::part\neyebrow: 第三章\n标题: 核心方法论\n正文: 本章介绍...\n:::" },
  { name: "label-title", label: "标签标题", category: "opening", description: "带彩色标签的标题块", bodyFormat: "fields", hasTitle: false, example: ":::label-title\n标签: 新功能\n标题: 这个功能改变了一切\n:::" },

  // infographic
  { name: "steps", label: "步骤", category: "infographic", description: "带有序号的多步骤说明", bodyFormat: "rows", hasTitle: true, example: ":::steps\n序号 | 标题 | 说明\n1 | 第一步 | 说明文字\n2 | 第二步 | 说明文字\n:::" },
  { name: "metrics", label: "数据指标", category: "infographic", description: "大数字指标展示（支持暗色变体）", bodyFormat: "rows", hasTitle: false, variants: ["", "dark"], example: ":::metrics\ndark\n标题 | 数值 | 单位 | 说明\n月活 | 120 | 万 | 同比增长 30%\n付费 | 8.5 | 万 | 转化率 7%\n:::" },
  { name: "compare", label: "对比表", category: "infographic", description: "多列对比表格", bodyFormat: "rows", hasTitle: true, example: ":::compare\n维度 | 本产品 | 竞品 A | 竞品 B\n价格 | 免费 | ¥99/月 | ¥199/月\n功能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐\n:::" },
  { name: "timeline", label: "时间线", category: "infographic", description: "按时间顺序展示事件节点", bodyFormat: "rows", hasTitle: false, example: ":::timeline\n时间 | 事件\n2023.Q1 | 项目启动\n2023.Q3 | 第一个版本上线\n2024.Q1 | 用户突破 10 万\n:::" },
  { name: "infographic", label: "信息图", category: "infographic", description: "通用信息图容器，支持 Bar/Donut/StackedBar", bodyFormat: "json_object", hasTitle: false, example: ':::infographic\n{"type":"Bar","title":"季度营收","data":[{"label":"Q1","value":120,"unit":"万"}],"caption":"图：季度营收趋势"}\n:::' },

  // judgment
  { name: "verdict", label: "结论", category: "judgment", description: "突出显示核心结论或推荐", bodyFormat: "fields", hasTitle: false, example: ":::verdict\n结论: 强烈推荐\n理由: 性价比最高，功能覆盖 90% 场景\n评分: ⭐⭐⭐⭐⭐\n:::" },
  { name: "audience-fit", label: "适用人群", category: "judgment", description: "列出适合/不适合的人群", bodyFormat: "fields", hasTitle: false, example: ":::audience-fit\n适合: 独立开发者、小程序运营\n不适合: 需要私有化部署的大型企业\n:::" },
  { name: "myth-fact", label: "误区澄清", category: "judgment", description: "误区 vs 事实对照", bodyFormat: "rows", hasTitle: false, example: ":::myth-fact\n误区 | 事实\nAI 会替代程序员 | AI 是辅助工具，核心决策仍需人工\n:::" },
  { name: "manifesto", label: "原则宣言", category: "judgment", description: "列出核心原则列表", bodyFormat: "rows", hasTitle: false, example: ":::manifesto\n原则 | 说明\n最小化 | 能少则少\n可测试 | 每个功能都有单测\n:::" },
  { name: "bridge", label: "过渡段", category: "judgment", description: "承上启下的过渡段落", bodyFormat: "text", hasTitle: false, example: ":::bridge\n上文介绍了核心概念，接下来我们看看如何在实际项目中应用这些模式。\n:::" },

  // evidence
  { name: "quote", label: "引用块", category: "evidence", description: "突出引用文字，可选署名和来源", bodyFormat: "fields", hasTitle: false, example: ":::quote\n引用: 好的设计是尽可能少的设计。\n署名: Dieter Rams\n来源: 《设计准则》\n:::" },
  { name: "image-annotate", label: "图片标注", category: "evidence", description: "图片 + 标注文字 + 可选箭头标记", bodyFormat: "fields", hasTitle: false, example: ":::image-annotate\n图片: https://.../screen.png\n标注: 红框处为新增按钮\n箭头: 120,80 => 200,80\n:::" },
  { name: "image-compare", label: "图片对比", category: "evidence", description: "并排对比两张图片", bodyFormat: "fields", hasTitle: false, example: ":::image-compare\n前: https://.../before.png\n后: https://.../after.png\n说明前: 优化前\n说明后: 优化后\n:::" },
  { name: "image-steps", label: "图片步骤", category: "evidence", description: "图片 + 步骤说明的组合", bodyFormat: "rows", hasTitle: false, example: ":::image-steps\n图片 | 步骤\nhttps://.../s1.png | 第一步：安装依赖\nhttps://.../s2.png | 第二步：配置账号\n:::" },
  { name: "image-text", label: "图文混排", category: "evidence", description: "图片与文字交替排列", bodyFormat: "rows", hasTitle: false, variants: ["left", "right"], example: ":::image-text left\n图片 | 文字\nhttps://.../icon.png | 这里是说明文字，可以有多行。\n:::" },

  // conversion
  { name: "cta", label: "行动号召", category: "conversion", description: "引导用户点击的按钮区域", bodyFormat: "fields", hasTitle: false, example: ":::cta\n标题: 立即下载\n按钮文字: 免费获取\n链接: https://...\n说明: 限时优惠，仅剩 3 天\n:::" },
  { name: "faq", label: "常见问题", category: "conversion", description: "Q&A 折叠列表", bodyFormat: "rows", hasTitle: false, example: ":::faq\n问题 | 回答\n需要付费吗？ | 核心功能永久免费。\n支持小程序吗？ | 支持微信小程序。\n:::" },
  { name: "checklist", label: "检查清单", category: "conversion", description: "带勾选状态的事项列表", bodyFormat: "rows", hasTitle: true, example: ":::checklist 发布前检查\n描述 | 状态\n封面图已上传 | done\n摘要已填写 | done\n正文无错别字 | todo\n:::" },
  { name: "cases", label: "案例展示", category: "conversion", description: "客户/用户案例卡片", bodyFormat: "rows", hasTitle: false, example: ":::cases\n名称 | 简介 | 链接\n某公司 | 使用后效率提升 3 倍 | https://...\n:::" },
  { name: "summary", label: "要点总结", category: "conversion", description: "文章结尾的要点回顾", bodyFormat: "text", hasTitle: false, example: ":::summary\n本文介绍了三个核心方法：\n1. 方法 A：适用于...\n2. 方法 B：适用于...\n:::" },
  { name: "notice", label: "注意事项", category: "conversion", description: "警告/提示/信息框", bodyFormat: "text", hasTitle: false, variants: ["warning", "info", "danger"], example: ":::notice warning\n⚠️ 此功能需要管理员权限，请勿随意操作。\n:::" },

  // brand
  { name: "author-card", label: "作者名片", category: "brand", description: "文末作者介绍卡片", bodyFormat: "fields", hasTitle: false, example: ":::author-card\n头像: https://.../avatar.png\n名称: 张三\n简介: 独立开发者，专注 AI 工具\n微信: zhangsan123\n:::" },
  { name: "subscribe", label: "关注引导", category: "brand", description: "引导用户关注订阅号", bodyFormat: "fields", hasTitle: false, example: ":::subscribe\n二维码: https://.../qrcode.png\n引导语: 关注公众号，获取更多干货\n:::" },
  { name: "people", label: "团队成员", category: "brand", description: "团队成员介绍", bodyFormat: "rows", hasTitle: false, example: ":::people\n头像 | 姓名 | 角色\nhttps://.../a.png | 张三 | 前端开发\nhttps://.../b.png | 李四 | 后端开发\n:::" },
  { name: "series", label: "系列文章", category: "brand", description: "本系列其他文章链接", bodyFormat: "rows", hasTitle: false, example: ":::series\n标题 | 链接\n第一篇：入门 | https://...\n第二篇：进阶 | https://...\n:::" },

  // sprint4
  { name: "callout", label: "提示框", category: "sprint4", description: "高亮提示/警告/信息框（支持 tip/info/warning/danger）", bodyFormat: "text", hasTitle: false, variants: ["tip", "info", "warning", "danger"], example: ":::callout tip\n💡 小技巧：使用快捷键 Ctrl+D 可以快速收藏。\n:::" },
  { name: "definition", label: "术语解释", category: "sprint4", description: "术语名词解释块", bodyFormat: "json_object", hasTitle: false, example: ':::definition\n{"term":"RAG","full":"Retrieval-Augmented Generation","meaning":"检索增强生成，结合检索与生成的 AI 架构","scenario":"适用于需要引用知识库的 AI 应用"}\n:::' },
  { name: "quote-card", label: "引言卡片", category: "sprint4", description: "视觉突出的引言展示", bodyFormat: "fields", hasTitle: false, example: ":::quote-card\n引言: 代码是写给人看的，顺便让机器运行。\n署名: Harold Abelson\n:::" },
  { name: "tweet", label: "推文卡片", category: "sprint4", description: "模拟社交媒体卡片", bodyFormat: "fields", hasTitle: false, example: ":::tweet\n作者: @username\n内容: 刚刚发布了一个新功能，欢迎试用！\n时间: 2 小时前\n:::" },
  { name: "stat-row", label: "数据横排", category: "sprint4", description: "一行多列数据展示", bodyFormat: "rows", hasTitle: false, example: ":::stat-row\n标签 | 数值 | 趋势\n用户 | 12 万 | ↗ 12%\n付费率 | 7.2% | ↗ 0.8%\n:::" },
  { name: "question", label: "问答", category: "sprint4", description: "一个问题配一个答案", bodyFormat: "fields", hasTitle: false, example: ":::question\n问题: 如何获取 API Key？\n回答: 登录后台，在「设置 - API」中创建即可。\n:::" },
  { name: "resource-list", label: "资源列表", category: "sprint4", description: "链接资源清单", bodyFormat: "rows", hasTitle: false, example: ":::resource-list\n标题 | 链接 | 类型\nAPI 文档 | https://... | 文档\n示例代码 | https://... | GitHub\n:::" },
  { name: "comparison-table", label: "对比表（简）", category: "sprint4", description: "精简版对比表格", bodyFormat: "rows", hasTitle: true, example: ":::comparison-table 方案对比\n功能 | 免费版 | 专业版\n人数上限 | 5 人 | 不限\n存储空间 | 1GB | 100GB\n:::" },
  { name: "changelog", label: "更新日志", category: "sprint4", description: "版本更新记录", bodyFormat: "json_array", hasTitle: false, example: ':::changelog\n[{"version":"v2.0","date":"2025-01-01","changes":["新增xx功能","修复xx问题"]}]\n:::' },
];

const CATEGORY_LABELS: Record<string, string> = {
  opening: "开头类",
  infographic: "信息图类",
  judgment: "判断类",
  evidence: "证据类",
  conversion: "转化类",
  brand: "品牌类",
  sprint4: "进阶类",
};

/** 模块插入器：对话框形式，按分类展示所有模块，点击后插入 textarea */
export function ModuleInserter({
  onInsert
}: {
  onInsert: (template: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("opening");
  const [search, setSearch] = useState("");

  function handleClick(template: string) {
    onInsert(template);
    setOpen(false);
  }

  const filtered = search.trim()
    ? MODULE_CATALOG.filter(
        (m) =>
          m.name.includes(search) ||
          m.label.includes(search) ||
          m.description.includes(search) ||
          m.category.includes(search)
      )
    : MODULE_CATALOG;

  const categories = Array.from(new Set(filtered.map((m) => m.category)));

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="secondary" size="sm" title="插入排版模块">
            <LayoutDashboard size={14} />
            插入模块
          </Button>
        </DialogTrigger>
        <DialogContent title="排版模块" style={{ maxWidth: 720, width: "90vw" }}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder="搜索模块..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid var(--line)", fontSize: 13 }}
            />
          </div>
          <div style={{ display: "flex", gap: 16, maxHeight: "60vh", overflow: "auto" }}>
            {/* 左侧分类导航 */}
            <div style={{ minWidth: 110, borderRight: "1px solid var(--line)", paddingRight: 12 }}>
              {categories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: expandedCategory === cat ? 600 : 400,
                    background: expandedCategory === cat ? "var(--panel-subtle)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}
                >
                  {expandedCategory === cat ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  {CATEGORY_LABELS[cat] || cat}
                </div>
              ))}
            </div>
            {/* 右侧模块列表 */}
            <div style={{ flex: 1, overflow: "auto" }}>
              {categories
                .filter((cat) => expandedCategory === null || cat === expandedCategory)
                .map((cat) => (
                  <div key={cat} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase" }}>
                      {CATEGORY_LABELS[cat] || cat}
                    </div>
                    {filtered
                      .filter((m) => m.category === cat)
                      .map((m) => (
                        <ModuleCard key={m.name} module={m} onInsert={handleClick} />
                      ))}
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ModuleCard({ module, onInsert }: { module: ModuleDescriptor; onInsert: (template: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        cursor: "pointer"
      }}
      onClick={() => onInsert(module.example)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong style={{ fontSize: 13 }}>{module.label}</strong>
          <span style={{ fontSize: 11, color: "var(--muted-2)", marginLeft: 6 }}>`:::{module.name}`</span>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} style={{ fontSize: 11 }}>
          {expanded ? "收起" : "预览"}
        </Button>
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 0" }}>{module.description}</p>
      {module.variants && module.variants.filter(Boolean).length > 0 ? (
        <div style={{ marginTop: 4, fontSize: 11, color: "var(--muted-2)" }}>
          变体：{module.variants.filter(Boolean).join(" / ")}
        </div>
      ) : null}
      {expanded ? (
        <pre
          style={{
            fontSize: 11,
            background: "var(--panel-subtle)",
            padding: 8,
            borderRadius: 6,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            marginTop: 6,
            lineHeight: 1.5
          }}
        >
          {module.example}
        </pre>
      ) : null}
    </div>
  );
}
