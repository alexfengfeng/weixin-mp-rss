---
name: wedraft-layout
description: |
  WeDraft 高级排版系统 Skill。当用户需要创建或排版微信公众号文章内容时使用。
  支持 :::module 高级排版语法（39 个模块）、6+ 主题、发布就绪检查。
  通过 Discovery API 与 WeDraft 服务交互，实现 AI Agent 自动化排版与发布。
  触发词：公众号排版、微信排版、WeDraft、:::module、排版模块、主题选择、文章就绪检查、discovery
---

# WeDraft 高级排版系统

## 概述

WeDraft 是一个微信公众号草稿箱发布台，支持高级排版系统：
- **39 个 :::module 模块**（6 大类：opening/infographic/judgment/evidence/conversion/brand/sprint4）
- **6+ 主题**（简洁通讯、产品报告、温和专栏、紧凑手册、评测强调、墨韵随笔）
- **发布就绪检查**（inspect：标题/摘要/封面/图片/模块/字数）
- **Agent Discovery API**（JSON 契约，供 AI Agent 自动化调用）

## 前置条件

1. WeDraft 服务已部署并运行
2. Discovery API 已启用（`discovery_enabled = "true"`）
3. 已配置 API token（`discovery_api_token`）

## 使用流程

### 1. 发现能力

```
GET /api/discovery/capabilities
Authorization: Bearer <token>
```

返回服务能力清单，包括可用端点、模块数量、主题数量等。

### 2. 获取可用主题

```
GET /api/discovery/themes
Authorization: Bearer <token>
```

### 3. 获取可用模块

```
GET /api/discovery/layout
Authorization: Bearer <token>
```

返回所有模块的名称、分类、body 格式、示例。

### 4. 查看模块详情

```
GET /api/discovery/layout/<module-name>
Authorization: Bearer <token>
```

返回模块的字段定义、变体、示例等。

### 5. 生成带模块的 Markdown

根据用户意图，使用 :::module 语法编写文章：

```markdown
:::hero
eyebrow: 深度观察
title: AI 时代的公众号写作
subtitle: 为什么读者愿意继续读下去
:::

正文段落...

:::callout tip
这是一条提示信息
:::

:::steps
操作步骤
1 | 第一步 | 说明
2 | 第二步 | 说明
:::

:::summary
本期要点
第一条要点
第二条要点
:::
```

### 6. 验证模块语法

```
POST /api/discovery/layout/validate
Authorization: Bearer <token>
Content-Type: application/json

{ "markdown": ":::callout tip\n提示\n:::" }
```

返回验证结果，包括模块是否注册、是否有解析错误。

### 7. 检查发布就绪

```
GET /api/discovery/inspect?articleId=<article-id>
Authorization: Bearer <token>
```

返回就绪检查报告（标题/摘要/封面/图片/模块/字数）。

## 模块语法

### 基本结构

```
:::模块名 [变体] [可选标题]
body 内容
:::
```

### 三种 body 格式

1. **fields**（键值对）：
```
:::hero
eyebrow: 标签
title: 标题
:::
```

2. **rows**（管道符分隔，可带标题）：
```
:::steps
步骤列表
1 | 步骤一 | 说明
2 | 步骤二 | 说明
:::
```

3. **json_object / json_array**：
```
:::definition
{"term":"RAG","def":"检索增强生成"}
:::
```

### 常用模块速查

| 模块 | 分类 | body 格式 | 用途 |
|------|------|-----------|------|
| hero | opening | fields | 封面头图 |
| toc | opening | rows | 目录 |
| callout | sprint4 | text | 提示框（info/tip/warning/success/danger） |
| quote | evidence | text | 引用卡片 |
| steps | infographic | rows | 步骤列表 |
| cta | conversion | fields | 行动号召 |
| faq | conversion | rows | 常见问答 |
| checklist | conversion | rows | 清单（done/todo/na） |
| summary | conversion | rows | 摘要 |
| notice | conversion | fields | 通知 |
| cards | opening | rows | 卡片列表 |
| metrics | infographic | rows | 指标展示 |
| compare | infographic | rows | 对比 |
| timeline | infographic | rows | 时间线 |
| verdict | judgment | fields | 结论 |
| author-card | brand | fields | 作者卡片 |
| subscribe | brand | fields | 订阅引导 |
| definition | sprint4 | json_object | 术语定义 |
| quote-card | sprint4 | json_object | 精美引用 |
| tweet | sprint4 | json_object | 推文卡片 |
| stat-row | sprint4 | json_array | 统计行 |
| question | sprint4 | json_array | 问答对 |
| resource-list | sprint4 | json_array | 资源列表 |
| comparison-table | sprint4 | json_object | 对比表 |
| changelog | sprint4 | json_object | 更新日志 |

## 注意事项

- 所有渲染输出为纯 inline CSS（微信公众号要求）
- 主题样式通过 `style="..."` 属性内联，无 class、无外部样式表
- 未注册的 :::module 会被保留为原文（不报错）
- 模块 body 中的富文本支持基础 Markdown（加粗、链接、图片、行内代码）
