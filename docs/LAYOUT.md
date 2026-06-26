# WeDraft 高级排版系统使用文档

WeDraft 集成了完整的 Markdown → 微信公众号草稿箱高级排版能力，支持 **20 个主题** + **39 个排版模块** + **Agent Discovery API**。

## 目录

- [快速开始](#快速开始)
- [20 个内置主题](#20-个内置主题)
- [39 个排版模块](#39-个排版模块)
- [`:::module` 语法详解](#module-语法详解)
- [Agent Discovery API](#agent-discovery-api)
- [WorkBuddy Skill 集成](#workbuddy-skill-集成)
- [FAQ](#faq)

---

## 快速开始

### 在 Web 界面使用

1. 打开 `/dashboard/articles`，点击「新建文章」或编辑已有文章
2. 在 Markdown 正文区域上方，可见工具栏：
   - `B / I / <>` — 加粗 / 斜体 / 行内代码
   - `H1 / H2 / H3` — 标题
   - `• / 1. / > / <>` — 列表 / 引用 / 代码块
   - `🔗 / 🖼` — 链接 / 图片
   - **`📊 插入模块`** — 打开 39 个排版模块选择对话框
3. 选择「排版模板」下拉，可切换 20 个内置主题
4. 点击「保存并预览」查看渲染效果
5. 点击「保存并推送」将渲染后的 HTML 推送到微信草稿箱

### 在 Markdown 中直接使用模块

在 Markdown 正文中写入 `:::模块名` 语法：

```markdown
# 我的文章

:::hero
标题: 用 AI 重构公众号排版工作流
副标题: 从 Markdown 到微信草稿箱，3 分钟搞定
作者: Alex
日期: 2025-06-26
:::

正文内容...

:::callout tip
💡 小技巧：使用 :::module 语法可以插入高级排版模块。
:::

:::steps
序号 | 标题 | 说明
1 | 编写 Markdown | 用熟悉的 Markdown 写作
2 | 选择主题 | 20 个主题任选
3 | 推送草稿 | 一键同步到微信
:::
```

---

## 20 个内置主题

按风格和场景分类：

### 通用类（6 个）
| ID | 名称 | 适用场景 |
|---|---|---|
| `clean_newsletter` | 简洁通讯 | 知识通讯、稳定更新 |
| `product_report` | 产品报告 | 产品更新、版本发布 |
| `warm_column` | 温和专栏 | 个人专栏、深度文章 |
| `dense_playbook` | 紧凑手册 | 教程、操作手册 |
| `bold_review` | 评测强调 | 产品评测、对比 |
| `ink_essay` | 墨韵随笔 | 文学、随笔、散文 |

### 专业类（4 个）
| ID | 名称 | 适用场景 |
|---|---|---|
| `business_pro` | 商务专业 | 企业号、B2B、财经 |
| `code_geek` | 极客代码 | 技术教程、开源项目 |
| `ocean_blue` | 海洋蓝调 | 教育、科技、出海 |
| `tech_dark` | 科技深色 | AI、极客、深色风 |

### 风格类（6 个）
| ID | 名称 | 适用场景 |
|---|---|---|
| `minimal_mono` | 极简黑白 | 深度长文、行业观察 |
| `modern_gradient` | 现代渐变 | SaaS、互联网产品 |
| `fresh_green` | 清新绿意 | 健康、生活、自然 |
| `forest_calm` | 森林宁静 | 户外、环保、冥想 |
| `sunset_orange` | 暖橙日落 | 生活、亲子、美食 |
| `purple_dream` | 紫色梦幻 | 创意、设计、艺术 |

### 文化类（4 个）
| ID | 名称 | 适用场景 |
|---|---|---|
| `vintage_paper` | 复古纸张 | 历史、人文、读书 |
| `classic_elegant` | 古典优雅 | 传统文化、艺术评论 |
| `youth_vibrant` | 青春活力 | 青年文化、潮流、校园 |
| `rose_elegant` | 玫瑰优雅 | 美妆、时尚、女性向 |

每个主题都支持 4 种背景类型：`plain`（纯白）、`warm`（暖色）、`dark`（深色）、自定义。

---

## 39 个排版模块

按 7 大分类组织：

### 1. 开头类（opening，5 个）
- `:::hero` — 文章顶部引导块（标题/副标题/作者/日期）
- `:::toc` — 自动目录
- `:::cards` — 并排卡片组
- `:::part` — 章节分隔
- `:::label-title` — 带标签的标题

### 2. 信息图类（infographic，5 个）
- `:::steps` — 有序步骤
- `:::metrics` — 大数字指标（支持 dark 变体）
- `:::compare` — 多列对比表
- `:::timeline` — 时间线
- `:::infographic` — 通用信息图（Bar/Donut/StackedBar，JSON 格式）

### 3. 判断类（judgment，5 个）
- `:::verdict` — 结论/推荐
- `:::audience-fit` — 适用人群
- `:::myth-fact` — 误区 vs 事实
- `:::manifesto` — 原则宣言
- `:::bridge` — 过渡段

### 4. 证据类（evidence，5 个）
- `:::quote` — 引用块（含署名/来源）
- `:::image-annotate` — 图片标注
- `:::image-compare` — 图片对比
- `:::image-steps` — 图片步骤
- `:::image-text` — 图文混排（left/right 变体）

### 5. 转化类（conversion，6 个）
- `:::cta` — 行动号召按钮
- `:::faq` — 常见问题
- `:::checklist` — 检查清单（done/todo 状态）
- `:::cases` — 案例展示
- `:::summary` — 要点总结
- `:::notice` — 注意事项（warning/info/danger 变体）

### 6. 品牌类（brand，4 个）
- `:::author-card` — 作者名片
- `:::subscribe` — 关注引导
- `:::people` — 团队成员
- `:::series` — 系列文章

### 7. 进阶类（sprint4，9 个）
- `:::callout` — 提示框（tip/info/warning/danger 变体）
- `:::definition` — 术语解释（JSON 格式）
- `:::quote-card` — 引言卡片
- `:::tweet` — 推文卡片
- `:::stat-row` — 数据横排
- `:::question` — 问答
- `:::resource-list` — 资源列表
- `:::comparison-table` — 精简对比表
- `:::changelog` — 更新日志（JSON 数组）

---

## `:::module` 语法详解

### 基本结构

```
:::模块名[变体] [可选标题]
内容体
:::
```

### 三种 body 格式

#### 1. fields（键值对）

```
:::hero
标题: 文章标题
副标题: 一句话概括
作者: 作者名
:::
```

#### 2. rows（管道符分隔表格，首行为表头）

```
:::steps
序号 | 标题 | 说明
1 | 第一步 | 说明文字
2 | 第二步 | 说明文字
:::
```

带标题的 rows：

```
:::cards 推荐阅读
标题 | 正文 | 链接
卡片一 | 摘要 | https://...
:::
```

#### 3. json_object / json_array（JSON 格式）

```
:::infographic
{"type":"Bar","title":"季度营收","data":[{"label":"Q1","value":120}]}
:::

:::changelog
[{"version":"v2.0","date":"2025-01-01","changes":["新增功能","修复问题"]}]
:::
```

### 变体（variant）

部分模块支持变体，写在模块名后：

```
:::callout tip        ← tip 变体
:::callout warning    ← warning 变体
:::notice danger      ← danger 变体
:::metrics dark       ← dark 变体
:::image-text left    ← left 变体
```

### 完整示例

```markdown
:::hero
标题: 用 AI 重构公众号排版工作流
副标题: 从 Markdown 到微信草稿箱，3 分钟搞定
作者: Alex
日期: 2025-06-26
:::

# 引言

正文段落...

:::callout tip
💡 小技巧：使用工具栏的「插入模块」按钮可以快速插入模板。
:::

## 实现步骤

:::steps
序号 | 标题 | 说明
1 | 编写 Markdown | 用熟悉的 Markdown 写作
2 | 选择主题 | 20 个主题任选
3 | 推送草稿 | 一键同步到微信
:::

## 数据对比

:::compare
维度 | 本方案 | 传统方案
耗时 | 3 分钟 | 30 分钟
样式 | 20 主题 | 手动调 CSS
模块 | 39 个 | 0 个
:::

:::verdict
结论: 强烈推荐
理由: 效率提升 10 倍
评分: ⭐⭐⭐⭐⭐
:::

:::summary
本文介绍了 WeDraft 高级排版系统的三大能力：
1. 20 个内置主题，覆盖主流场景
2. 39 个排版模块，告别单调排版
3. Agent Discovery API，支持 AI 自动化
:::

:::cta
标题: 立即试用
按钮文字: 免费获取
链接: https://example.com
:::
```

---

## Agent Discovery API

提供 JSON API 端点，便于 AI Agent 自动化调用。

### 鉴权

双轨鉴权：
1. **Bearer Token**：在 Setting 中配置 `discovery.apiToken`，请求头 `Authorization: Bearer <token>`
2. **JWT Cookie**：复用 Web 端登录态（仅限同源请求）

### 端点清单

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/discovery/capabilities` | 能力清单（支持的功能/主题/模块概览） |
| GET | `/api/discovery/themes` | 主题列表 |
| GET | `/api/discovery/layout` | 模块列表 |
| GET | `/api/discovery/layout/[name]` | 单个模块详情（含 schema/示例） |
| POST | `/api/discovery/layout/validate` | 验证 `:::module` 语法 |
| GET | `/api/discovery/inspect?articleId=xxx` | 文章发布就绪检查 |
| POST | `/api/admin/render` | 通用 Markdown 渲染预览 |

### 使用示例

```bash
# 获取能力清单
curl http://localhost:3000/api/discovery/capabilities \
  -H "Authorization: Bearer YOUR_TOKEN"

# 获取主题列表
curl http://localhost:3000/api/discovery/themes

# 验证模块语法
curl -X POST http://localhost:3000/api/discovery/layout/validate \
  -H "Content-Type: application/json" \
  -d '{"markdown":":::hero\n标题: 测试\n:::"}'

# 文章就绪检查
curl http://localhost:3000/api/discovery/inspect?articleId=ARTICLE_ID

# 渲染预览
curl -X POST http://localhost:3000/api/admin/render \
  -H "Content-Type: application/json" \
  -d '{"markdown":"# Hello\n\n:::callout tip\n提示\n:::","themeId":"clean_newsletter"}'
```

### Inspect 检查项

`/api/discovery/inspect` 返回的就绪检查包含以下项目：

| key | 说明 | 是否必需 |
|---|---|---|
| `title` | 标题非空且 ≤ 64 字 | ✅ |
| `digest` | 摘要非空且 ≤ 120 字 | ✅ |
| `cover` | 封面图存在 | ✅ |
| `content` | 正文非空 | ✅ |
| `wordCount` | 字数 100~8000 | 建议 |
| `images` | 图片无外部 URL 警告 | 建议 |
| `modules` | 模块全部已注册、无解析错误 | 建议 |
| `cta` | 建议文末有 CTA 模块 | 建议 |
| `links` | 外部链接不可点击提醒 | 提示 |

`ready` 字段为 `true` 表示前 4 项必需检查全部通过。

---

## WorkBuddy Skill 集成

项目内置 `skills/wedraft-layout/SKILL.md`，AI Agent 加载此 skill 后可：

1. 自动调用 Discovery API 列出主题/模块
2. 根据「写一篇关于 X 的公众号文章」需求，选择合适主题 + 模块组合
3. 生成带 `:::module` 语法的 Markdown
4. 调用 `/api/admin/render` 渲染预览
5. 调用 `/api/discovery/inspect` 检查就绪状态
6. 推送至微信草稿箱

---

## FAQ

### Q: 为什么推送后微信端样式丢失？

A: 微信公众号正文仅支持 inline CSS，所有样式必须写在元素的 `style` 属性上。WeDraft 的渲染引擎已确保所有输出为 inline CSS，但如果你在 Markdown 中插入了外部 CSS 类名（如 `<div class="xxx">`），这些样式不会生效。

### Q: 可以自定义主题吗？

A: 可以。在 `/dashboard/wechat-styles` 页面点击「新建」，输入主题名称和 11 个基础元素的 inline CSS。新主题会保存到数据库，立即可用。

### Q: 模块支持嵌套吗？

A: 当前版本不支持 `:::module` 嵌套。每个 `:::module` 块是独立的，遇到 `:::` 闭合标记即结束。

### Q: JSON 格式的模块如何写？

A: `:::infographic`、`:::definition`、`:::changelog` 使用 JSON body。注意 JSON 必须在单行内，或用 `\n` 分隔但不能有空行：

```
:::definition
{"term":"RAG","meaning":"检索增强生成"}
:::
```

### Q: 如何调试模块渲染问题？

A: 使用 `/api/discovery/layout/validate` 端点验证语法，或调用 `/api/admin/render` 渲染预览查看 HTML 输出。

### Q: 主题的 tokens 是什么？

A: tokens 是主题的设计令牌（颜色/字体/间距/圆角），存储在 `themeMetaJson` 字段。模块渲染器会读取 tokens 生成模块样式，确保模块视觉与主题一致。

---

## 相关文件

| 文件 | 说明 |
|---|---|
| `src/server/layout/` | 排版引擎核心（parser/renderer/modules/themes） |
| `src/server/layout/discovery/` | Agent Discovery 服务 |
| `src/app/api/discovery/` | Discovery API 路由 |
| `src/app/api/admin/render/route.ts` | 通用渲染预览端点 |
| `src/components/EditorToolbar.tsx` | 编辑器工具栏 |
| `src/components/ModuleInserter.tsx` | 模块插入器对话框 |
| `skills/wedraft-layout/SKILL.md` | WorkBuddy Skill 定义 |
| `src/app/dashboard/wechat-styles/page.tsx` | 主题管理页面 |
