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
