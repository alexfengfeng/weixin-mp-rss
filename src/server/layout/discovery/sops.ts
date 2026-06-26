/**
 * Agent SOP（标准操作流程）
 *
 * 内置的 Agent 使用指南，供 AI Agent 了解如何使用 WeDraft 的完整流程。
 */

export type AgentSop = {
  id: string;
  name: string;
  description: string;
  /** 触发场景 */
  triggers: string[];
  /** 操作步骤 */
  steps: Array<{
    step: number;
    action: string;
    endpoint?: string;
    method?: string;
    description: string;
  }>;
  /** 输出格式 */
  output: string;
};

export const BUILTIN_SOPS: AgentSop[] = [
  {
    id: "md2wechat",
    name: "Markdown 转微信公众号文章",
    description: "从 Markdown 文本生成微信排版 HTML 并推送到草稿箱的完整流程。",
    triggers: ["公众号排版", "微信排版", "Markdown 转微信", "推送草稿", "发布文章"],
    steps: [
      { step: 1, action: "发现能力", endpoint: "/api/discovery/capabilities", method: "GET", description: "获取 WeDraft 支持的所有能力" },
      { step: 2, action: "选择主题", endpoint: "/api/discovery/themes", method: "GET", description: "从 48 个主题中选择适合文章风格的主题" },
      { step: 3, action: "浏览模块", endpoint: "/api/discovery/layout", method: "GET", description: "查看 43 个 :::module 排版模块，选择合适的模块增强排版" },
      { step: 4, action: "渲染预览", endpoint: "/api/admin/render", method: "POST", description: "将 Markdown + 主题渲染为微信兼容 HTML 预览" },
      { step: 5, action: "验证模块", endpoint: "/api/discovery/layout/validate", method: "POST", description: "验证 :::module 语法是否正确" },
      { step: 6, action: "就绪检查", endpoint: "/api/discovery/inspect", method: "GET", description: "检查文章标题/摘要/封面/图片等发布就绪状态" }
    ],
    output: "微信草稿箱中的文章草稿，可直接在公众号后台编辑发布"
  },
  {
    id: "ai-write",
    name: "AI 写作全流程",
    description: "从想法到成文的完整 AI 写作流程，含去痕和品牌注入。",
    triggers: ["写文章", "AI 写作", "生成文章", "从想法生成", "humanize", "去 AI 味"],
    steps: [
      { step: 1, action: "配置品牌档案", endpoint: "/api/admin/brand", method: "GET", description: "读取品牌档案，了解品牌人设和写作偏好" },
      { step: 2, action: "执行写作流程", endpoint: "/api/admin/ai/write", method: "POST", description: "从想法生成提纲 → 初稿 → 去痕（可指定 steps 参数控制流程）" },
      { step: 3, action: "去 AI 痕迹", endpoint: "/api/admin/ai/humanize", method: "POST", description: "对已有文章进行去痕处理，支持 light/authentic/aggressive 三种强度" },
      { step: 4, action: "风格分析", endpoint: "/api/admin/ai/analyze-style", method: "POST", description: "分析参考文章风格，生成可复用的 stylePrompt" },
      { step: 5, action: "渲染排版", endpoint: "/api/admin/render", method: "POST", description: "选择主题渲染 Markdown 为微信 HTML" },
      { step: 6, action: "就绪检查", endpoint: "/api/discovery/inspect", method: "GET", description: "检查发布就绪状态" }
    ],
    output: "去 AI 痕迹的公众号文章，可直接推送到草稿箱"
  },
  {
    id: "image-plan",
    name: "图片生成计划",
    description: "为文章生成封面图和信息图的创作计划，交由宿主 Agent 执行。",
    triggers: ["封面图", "信息图", "infographic", "cover plan", "图片计划"],
    steps: [
      { step: 1, action: "查询图片 Provider", endpoint: "/api/discovery/providers", method: "GET", description: "了解当前可用的图片生成服务" },
      { step: 2, action: "生成封面图计划", endpoint: "/api/admin/ai/cover-plan", method: "POST", description: "生成封面图的 prompt + 风格 + 尺寸 + 配色计划" },
      { step: 3, action: "生成信息图计划", endpoint: "/api/admin/ai/infographic", method: "POST", description: "生成信息图的 prompt + 布局 + 数据点（支持 5 种预设模板）" },
      { step: 4, action: "上传图片到微信", endpoint: "/api/admin/upload-image", method: "POST", description: "将生成图片上传到微信素材库，获取微信可访问 URL" }
    ],
    output: "封面图和信息图创作计划 JSON，包含可直接使用的英文 prompt"
  },
  {
    id: "brand-setup",
    name: "品牌档案配置",
    description: "配置品牌人设和写作偏好，实现跨会话风格一致性。",
    triggers: ["品牌档案", "brand profile", "品牌人设", "写作偏好", "风格一致性"],
    steps: [
      { step: 1, action: "读取品牌档案", endpoint: "/api/admin/brand", method: "GET", description: "获取当前品牌档案配置" },
      { step: 2, action: "保存品牌档案", endpoint: "/api/admin/brand", method: "POST", description: "配置品牌名/slogan/署名/人设/封面风格/写作偏好/禁用词" },
      { step: 3, action: "验证注入", endpoint: "/api/admin/ai/write", method: "POST", description: "生成文章时自动注入品牌档案，验证风格一致性" }
    ],
    output: "品牌档案已保存，后续 AI 写作/去痕/质检会自动注入"
  }
];

export function listSops(): AgentSop[] {
  return BUILTIN_SOPS;
}

export function getSop(id: string): AgentSop | undefined {
  return BUILTIN_SOPS.find((s) => s.id === id);
}
