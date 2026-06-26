"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleEditor } from "@/app/dashboard/articles/ArticleActions";
import { getDefaultWechatTemplateId, getDefaultWritingStyleId, withGeneratedArticlePreferences } from "@/app/dashboard/articles/article-form-state";

type MpOption = { id: string; name: string };
type WritingStyleOption = { id: string; name: string; description: string | null };
type WechatTemplateOption = { id: string; name: string; description: string | null };
type TopicIdea = {
  title: string;
  coreOpinion: string;
  outline: string[];
  styleId?: string;
  templateId?: string;
  reason?: string;
};

export function AiWorkbench({
  mps,
  writingStyles,
  wechatTemplates
}: {
  mps: MpOption[];
  writingStyles: WritingStyleOption[];
  wechatTemplates: WechatTemplateOption[];
}) {
  const [form, setForm] = useState({
    keyword: "",
    audience: "",
    mpId: "",
    styleId: getDefaultWritingStyleId(writingStyles),
    count: "5"
  });
  const [topics, setTopics] = useState<TopicIdea[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<Record<string, string | null> | undefined>();
  const [openSignal, setOpenSignal] = useState(0);

  function setField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function generateTopics(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("AI 正在生成选题...");
    const response = await fetch("/api/admin/ai/topics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        keyword: form.keyword,
        audience: form.audience || null,
        mpId: form.mpId || null,
        styleId: form.styleId || null,
        count: Number(form.count) || 5
      })
    });
    const json = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setMessage(json?.message || "选题生成失败");
      return;
    }

    setTopics(json.data || []);
    setMessage("选题已生成");
  }

  function adoptTopic(topic: TopicIdea) {
    const article = withGeneratedArticlePreferences(
      {
        mpId: form.mpId || null,
        title: topic.title,
        digest: topic.coreOpinion,
        author: "",
        coverPath: "",
        contentMarkdown: [
          `# ${topic.title}`,
          "",
          topic.coreOpinion,
          "",
          ...topic.outline.map((item) => `## ${item}\n\n请在这里展开论证。`)
        ].join("\n"),
        contentHtml: "",
        sourceUrl: "",
        status: "draft"
      },
      {
        stylePresetId: topic.styleId || form.styleId,
        templateId: topic.templateId || getDefaultWechatTemplateId(wechatTemplates),
        style: ""
      },
      {
        writingStyles,
        wechatTemplates
      }
    );
    setGeneratedArticle(article);
    setOpenSignal((current) => current + 1);
  }

  return (
    <div className="stack">
      <StyleAnalyzerTab />
      <form className="form-grid" onSubmit={generateTopics}>
        <label className="form-full">
          关键词
          <input value={form.keyword} onChange={(event) => setField("keyword", event.target.value)} placeholder="例如：AI 发布台、知识管理、一人团队" required />
        </label>
        <label>
          订阅号
          <select value={form.mpId} onChange={(event) => setField("mpId", event.target.value)}>
            <option value="">未指定</option>
            {mps.map((mp) => <option key={mp.id} value={mp.id}>{mp.name}</option>)}
          </select>
        </label>
        <label>
          写作风格
          <select value={form.styleId} onChange={(event) => setField("styleId", event.target.value)}>
            {writingStyles.map((style) => <option key={style.id} value={style.id}>{style.name}</option>)}
          </select>
        </label>
        <label>
          目标读者
          <input value={form.audience} onChange={(event) => setField("audience", event.target.value)} placeholder="可选：独立开发者、运营负责人等" />
        </label>
        <label>
          数量
          <select value={form.count} onChange={(event) => setField("count", event.target.value)}>
            <option value="3">3 个</option>
            <option value="5">5 个</option>
            <option value="8">8 个</option>
          </select>
        </label>
        <div className="dialog-actions form-full">
          {message ? <span className="muted">{message}</span> : null}
          <Button type="submit" disabled={loading}><Sparkles size={15} />{loading ? "生成中" : "生成选题"}</Button>
        </div>
      </form>

      {topics.length ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>选题</th><th>结构</th><th>推荐</th><th>操作</th></tr></thead>
            <tbody>
              {topics.map((topic, index) => (
                <tr key={`${topic.title}-${index}`}>
                  <td>
                    <strong>{topic.title}</strong>
                    <br />
                    <span className="meta-text">{topic.coreOpinion}</span>
                  </td>
                  <td>{topic.outline.map((item) => <div key={item} className="meta-text">{item}</div>)}</td>
                  <td>
                    <span className="meta-text">{writingStyles.find((style) => style.id === topic.styleId)?.name || topic.styleId || "-"}</span>
                    <br />
                    <span className="meta-text">{wechatTemplates.find((template) => template.id === topic.templateId)?.name || topic.templateId || "-"}</span>
                    {topic.reason ? <><br /><span className="meta-text">{topic.reason}</span></> : null}
                  </td>
                  <td><Button type="button" size="sm" variant="secondary" onClick={() => adoptTopic(topic)}>采用</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {generatedArticle ? (
        <ArticleEditor
          title="新建文章"
          trigger={<span hidden />}
          method="POST"
          url="/api/admin/articles"
          article={generatedArticle}
          mps={mps}
          writingStyles={writingStyles}
          wechatTemplates={wechatTemplates}
          openSignal={openSignal}
        />
      ) : null}
    </div>
  );
}

function StyleAnalyzerTab() {
  const [samples, setSamples] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    features: { sentenceStyle: string; tone: string; structure: string; vocabulary: string; rhythm: string; signatureExpressions: string[]; suitableTopics: string[] };
    stylePrompt: string;
    suggestedName: string;
    description: string;
  } | null>(null);
  const [message, setMessage] = useState("");

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    if (samples.trim().length < 50) {
      setMessage("请提供至少 50 字的参考文章");
      return;
    }
    setLoading(true);
    setMessage("正在分析写作风格...");
    try {
      const res = await fetch("/api/admin/ai/analyze-style", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ samples, authorName: authorName || null })
      });
      const json = await res.json();
      if (json.ok) {
        setResult(json.data);
        setMessage("风格分析完成");
      } else {
        setMessage(json.error || json.message || "分析失败");
      }
    } catch {
      setMessage("网络错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="compact-panel" style={{ marginBottom: 16 }}>
      <div className="form-section-title">写作风格分析器</div>
      <p className="muted" style={{ marginBottom: 8 }}>粘贴 1-3 篇参考文章（用 --- 分隔），AI 将提取写作风格指纹并生成可复用的风格 prompt。</p>
      <form className="form-grid" onSubmit={analyze}>
        <label>
          参考作者名（可选）
          <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="如：连岳、半佛仙人" />
        </label>
        <label className="form-full">
          参考文章
          <textarea value={samples} onChange={(e) => setSamples(e.target.value)} rows={8} placeholder="粘贴参考文章全文，多篇用 --- 分隔。至少 50 字。" required />
        </label>
        <div className="dialog-actions form-full">
          {message ? <span className="muted">{message}</span> : null}
          <Button type="submit" disabled={loading}><Sparkles size={15} />{loading ? "分析中" : "分析风格"}</Button>
        </div>
      </form>

      {result ? (
        <div className="compact-panel" style={{ marginTop: 12, padding: 16 }}>
          <h3 style={{ margin: "0 0 8px" }}>{result.suggestedName}</h3>
          <p className="muted">{result.description}</p>

          <div style={{ marginTop: 12 }}>
            <strong>风格特征</strong>
            <div className="form-grid" style={{ marginTop: 8 }}>
              <div><strong>句式：</strong><span className="meta-text">{result.features.sentenceStyle}</span></div>
              <div><strong>语气：</strong><span className="meta-text">{result.features.tone}</span></div>
              <div><strong>结构：</strong><span className="meta-text">{result.features.structure}</span></div>
              <div><strong>词汇：</strong><span className="meta-text">{result.features.vocabulary}</span></div>
              <div><strong>节奏：</strong><span className="meta-text">{result.features.rhythm}</span></div>
            </div>
          </div>

          {result.features.signatureExpressions.length > 0 ? (
            <div style={{ marginTop: 8 }}>
              <strong>标志性表达：</strong>
              {result.features.signatureExpressions.map((expr, i) => (
                <span key={i} className="badge" style={{ marginLeft: 4, padding: "2px 8px", background: "var(--surface)", borderRadius: 4, fontSize: 12 }}>{expr}</span>
              ))}
            </div>
          ) : null}

          {result.features.suitableTopics.length > 0 ? (
            <div style={{ marginTop: 8 }}>
              <strong>适合题材：</strong>
              {result.features.suitableTopics.map((topic, i) => (
                <span key={i} className="meta-text" style={{ marginLeft: 4 }}>{topic}{i < result.features.suitableTopics.length - 1 ? "、" : ""}</span>
              ))}
            </div>
          ) : null}

          <div style={{ marginTop: 12 }}>
            <strong>风格 Prompt（可复制到「写作风格」设置中）</strong>
            <pre style={{ background: "var(--panel-subtle)", padding: 12, borderRadius: 8, fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.6, marginTop: 4 }}>{result.stylePrompt}</pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
