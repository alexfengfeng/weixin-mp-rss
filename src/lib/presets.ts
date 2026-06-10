export type WritingStylePresetId =
  | "product_insight"
  | "founder_note"
  | "tutorial_playbook"
  | "review_compare"
  | "growth_opinion"
  | "soft_story";

export type WechatStyleTemplateId =
  | "clean_newsletter"
  | "product_report"
  | "warm_column"
  | "dense_playbook"
  | "bold_review";

export type WritingStylePreset = {
  id: WritingStylePresetId;
  label: string;
  description: string;
  prompt: string;
};

export type WechatStyleTemplate = {
  id: WechatStyleTemplateId;
  label: string;
  description: string;
  styles: {
    h1: string;
    h2: string;
    h3: string;
    p: string;
    ul: string;
    ol: string;
    li: string;
    hr: string;
    img: string;
    strong: string;
    a: string;
  };
};

export const WRITING_STYLE_PRESETS: WritingStylePreset[] = [
  {
    id: "product_insight",
    label: "产品洞察型",
    description: "适合工具、SaaS、AI 产品和效率方案分析。",
    prompt: [
      "产品洞察型：请像一位克制的产品分析作者写作，先给清晰判断，再解释原因。",
      "结构建议：开头用一句话点明产品/方法解决的真实问题；正文拆成 3-5 个能力点，每个能力点都说明适用场景、用户收益和限制；结尾给出适合谁、不适合谁、下一步怎么试。",
      "语气要求：专业、稳健、少形容词，多使用可验证的观察和具体例子。",
      "不要写空泛赞美，不要编造数据，不要使用夸张标题党，不要把普通功能包装成颠覆式创新。",
      "输出适合微信公众号草稿箱的 Markdown，标题层级清晰，段落短，列表可执行。"
    ].join("\n")
  },
  {
    id: "founder_note",
    label: "一人团队手记",
    description: "适合个人复盘、独立开发、创业观察和真实经历。",
    prompt: [
      "一人团队手记：请以独立开发者/小团队主理人的视角写作，有真实感，但不要自嗨。",
      "结构建议：用一个具体工作现场开头；写清遇到的矛盾、取舍和做法；中段沉淀为可复用的方法；结尾回到个人判断和下一步计划。",
      "语气要求：坦诚、克制、有人味，可以有轻微自嘲，但不要鸡汤化。",
      "重点写清为什么这样做、代价是什么、普通读者如何借鉴。",
      "避免虚构经历、过度煽情、成功学口吻；输出微信公众号 Markdown，适合个人品牌订阅号发布。"
    ].join("\n")
  },
  {
    id: "tutorial_playbook",
    label: "实操教程型",
    description: "适合步骤、清单、避坑、配置教程和 SOP。",
    prompt: [
      "实操教程型：请把文章写成读者可以照着执行的操作手册。",
      "结构建议：先说明目标和适用前提；列出准备条件；按步骤展开，每一步说明动作、原因和检查点；最后给出常见错误、排查路径和复盘清单。",
      "语气要求：直接、明确、少铺垫，用动词开头，尽量给出可复制的表达。",
      "如果涉及工具或流程，请把复杂概念拆小，不要跳步，不要假设读者已经懂。",
      "避免长篇观点输出、空泛方法论；输出微信公众号 Markdown，列表和小标题要清楚。"
    ].join("\n")
  },
  {
    id: "review_compare",
    label: "评测对比型",
    description: "适合工具横评、方案优缺点、适用人群和购买/采用建议。",
    prompt: [
      "评测对比型：请以中立评测者口吻写作，重点帮助读者做选择。",
      "结构建议：先给结论摘要；再写评测维度；逐项比较优点、缺点、成本、学习曲线和适用场景；最后给出不同人群的推荐方案。",
      "语气要求：具体、冷静、避免广告腔；可以表达偏好，但每个判断都要说明依据。",
      "不要只写优点，不要使用绝对化表述，不要编造价格、数据或未验证功能。",
      "输出微信公众号 Markdown，适合工具评测、AI 产品对比、工作流方案选择。"
    ].join("\n")
  },
  {
    id: "growth_opinion",
    label: "增长观点型",
    description: "适合趋势判断、商业评论、增长方法论和认知类文章。",
    prompt: [
      "增长观点型：请写成一篇有明确立场的观点文章，先抛判断，再展开论证。",
      "结构建议：开头提出一个反常识或高密度判断；正文用 3 个论点展开，每个论点包含现象、原因、反例或边界；结尾给出行动建议或判断框架。",
      "语气要求：鲜明但不武断，有锋芒但不情绪化。",
      "重点写出底层逻辑、适用边界和读者可以采用的决策标准。",
      "避免口号化、泛泛谈趋势、制造焦虑；输出微信公众号 Markdown，适合产品增长和商业观察类订阅号。"
    ].join("\n")
  },
  {
    id: "soft_story",
    label: "故事开场型",
    description: "适合用场景、人物和冲突引出观点的轻叙事文章。",
    prompt: [
      "故事开场型：请用一个具体场景或人物动作开头，再自然引出主题。",
      "结构建议：第一部分写场景和冲突；第二部分解释问题为什么普遍存在；第三部分给出解决路径；结尾回扣开头，让读者获得一个清晰 takeaway。",
      "语气要求：有画面感、节奏柔和、表达自然，但不要写小说，不要过度修辞。",
      "适合把工具、方法、知识管理、效率流程讲得更容易读。",
      "避免虚构过细细节、煽情、金句堆砌；输出微信公众号 Markdown，段落保持短，标题不要浮夸。"
    ].join("\n")
  }
];

export const WECHAT_STYLE_TEMPLATES: WechatStyleTemplate[] = [
  {
    id: "clean_newsletter",
    label: "简洁通讯",
    description: "黑白灰、低装饰，适合稳定更新的知识通讯。",
    styles: {
      h1: "margin:0 0 20px;color:#111827;font-size:24px;line-height:1.38;font-weight:750;",
      h2: "margin:30px 0 12px;color:#111827;font-size:18px;line-height:1.5;font-weight:700;",
      h3: "margin:22px 0 8px;color:#374151;font-size:16px;line-height:1.55;font-weight:700;",
      p: "margin:0 0 15px;color:#374151;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 16px;padding-left:1.2em;color:#374151;font-size:15px;line-height:1.85;",
      ol: "margin:0 0 16px;padding-left:1.35em;color:#374151;font-size:15px;line-height:1.85;",
      li: "margin:0 0 7px;",
      hr: "margin:28px 0;border:0;border-top:1px solid #e5e7eb;",
      img: "max-width:100%;height:auto;border-radius:6px;",
      strong: "color:#111827;font-weight:750;",
      a: "color:#2563eb;text-decoration:none;border-bottom:1px solid #bfdbfe;"
    }
  },
  {
    id: "product_report",
    label: "产品报告",
    description: "蓝灰强调，适合产品分析、效率工具和 AI 产品文章。",
    styles: {
      h1: "margin:0 0 22px;color:#0f172a;font-size:25px;line-height:1.34;font-weight:800;",
      h2: "margin:34px 0 14px;padding:8px 12px;background:#eff6ff;border-left:4px solid #2563eb;color:#1e3a8a;font-size:19px;line-height:1.45;font-weight:800;",
      h3: "margin:24px 0 10px;color:#1d4ed8;font-size:16px;line-height:1.55;font-weight:750;",
      p: "margin:0 0 16px;color:#334155;font-size:15px;line-height:1.92;",
      ul: "margin:0 0 18px;padding-left:1.2em;color:#334155;font-size:15px;line-height:1.88;",
      ol: "margin:0 0 18px;padding-left:1.4em;color:#334155;font-size:15px;line-height:1.88;",
      li: "margin:0 0 8px;",
      hr: "margin:30px 0;border:0;border-top:1px solid #bfdbfe;",
      img: "max-width:100%;height:auto;border-radius:10px;border:1px solid #dbeafe;",
      strong: "color:#1d4ed8;font-weight:800;",
      a: "color:#1d4ed8;text-decoration:none;border-bottom:1px solid #93c5fd;"
    }
  },
  {
    id: "warm_column",
    label: "温和专栏",
    description: "暖色标题和柔和分隔，适合个人表达、复盘和随笔。",
    styles: {
      h1: "margin:0 0 22px;color:#7c2d12;font-size:24px;line-height:1.38;font-weight:760;",
      h2: "margin:32px 0 13px;color:#9a3412;font-size:19px;line-height:1.5;font-weight:740;border-bottom:1px solid #fed7aa;padding-bottom:6px;",
      h3: "margin:22px 0 9px;color:#b45309;font-size:16px;line-height:1.55;font-weight:700;",
      p: "margin:0 0 16px;color:#44403c;font-size:15px;line-height:1.96;",
      ul: "margin:0 0 18px;padding-left:1.2em;color:#44403c;font-size:15px;line-height:1.9;",
      ol: "margin:0 0 18px;padding-left:1.4em;color:#44403c;font-size:15px;line-height:1.9;",
      li: "margin:0 0 8px;",
      hr: "margin:30px 0;border:0;border-top:1px dashed #fdba74;",
      img: "max-width:100%;height:auto;border-radius:12px;",
      strong: "color:#9a3412;font-weight:760;",
      a: "color:#c2410c;text-decoration:none;border-bottom:1px solid #fdba74;"
    }
  },
  {
    id: "dense_playbook",
    label: "紧凑手册",
    description: "高密度、强步骤感，适合教程、清单和 SOP。",
    styles: {
      h1: "margin:0 0 14px;color:#111827;font-size:22px;line-height:1.3;font-weight:800;",
      h2: "margin:22px 0 8px;color:#111827;font-size:17px;line-height:1.4;font-weight:760;",
      h3: "margin:18px 0 6px;color:#374151;font-size:15px;line-height:1.42;font-weight:720;",
      p: "margin:0 0 10px;color:#374151;font-size:14px;line-height:1.72;",
      ul: "margin:0 0 12px;padding-left:1.15em;color:#374151;font-size:14px;line-height:1.7;",
      ol: "margin:0 0 12px;padding-left:1.35em;color:#374151;font-size:14px;line-height:1.7;",
      li: "margin:0 0 4px;",
      hr: "margin:18px 0;border:0;border-top:1px dashed #d1d5db;",
      img: "max-width:100%;height:auto;border-radius:4px;",
      strong: "color:#111827;font-weight:780;background:#fef3c7;padding:0 2px;",
      a: "color:#1d4ed8;text-decoration:none;"
    }
  },
  {
    id: "bold_review",
    label: "评测强调",
    description: "强标题、重点突出，适合工具评测和方案对比。",
    styles: {
      h1: "margin:0 0 24px;color:#020617;font-size:27px;line-height:1.3;font-weight:850;",
      h2: "margin:34px 0 14px;color:#020617;font-size:20px;line-height:1.42;font-weight:820;border-left:5px solid #ef4444;padding-left:10px;",
      h3: "margin:24px 0 10px;color:#991b1b;font-size:17px;line-height:1.5;font-weight:780;",
      p: "margin:0 0 16px;color:#1f2937;font-size:15px;line-height:1.9;",
      ul: "margin:0 0 18px;padding-left:1.2em;color:#1f2937;font-size:15px;line-height:1.86;",
      ol: "margin:0 0 18px;padding-left:1.4em;color:#1f2937;font-size:15px;line-height:1.86;",
      li: "margin:0 0 8px;",
      hr: "margin:32px 0;border:0;border-top:2px solid #fecaca;",
      img: "max-width:100%;height:auto;border-radius:8px;border:1px solid #fee2e2;",
      strong: "color:#b91c1c;font-weight:850;",
      a: "color:#dc2626;text-decoration:none;border-bottom:1px solid #fca5a5;"
    }
  }
];

const WRITING_STYLE_ALIASES: Record<string, WritingStylePresetId> = {
  professional: "product_insight",
  storytelling: "soft_story",
  tutorial: "tutorial_playbook",
  review: "review_compare",
  opinion: "growth_opinion"
};

const WECHAT_STYLE_ALIASES: Record<string, WechatStyleTemplateId> = {
  clean: "clean_newsletter",
  magazine: "warm_column",
  compact: "dense_playbook"
};

export function getWritingStylePreset(id?: string | null) {
  const resolvedId = id ? WRITING_STYLE_ALIASES[id] || id : WRITING_STYLE_PRESETS[0].id;
  return WRITING_STYLE_PRESETS.find((preset) => preset.id === resolvedId) || WRITING_STYLE_PRESETS[0];
}

export function getWechatStyleTemplate(id?: string | null) {
  const resolvedId = id ? WECHAT_STYLE_ALIASES[id] || id : WECHAT_STYLE_TEMPLATES[0].id;
  return WECHAT_STYLE_TEMPLATES.find((template) => template.id === resolvedId) || WECHAT_STYLE_TEMPLATES[0];
}
