"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Edit, ImagePlus, Plus, Send, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDelete } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  type ArticleEditorPreferenceFields,
  getArticleEditorPreferences,
  getDefaultWechatTemplateId,
  getDefaultWritingStyleId,
  withGeneratedArticlePreferences
} from "./article-form-state";

type MpOption = { id: string; name: string };
type WritingStyleOption = { id: string; name: string; description: string | null };
type WechatTemplateOption = { id: string; name: string; description: string | null };
type ArticleToolAction = "outline" | "title" | "digest" | "rewrite" | "expand" | "shorten" | "coverPrompt";

type ArticleRow = {
  id: string;
  mpId: string | null;
  title: string;
  digest: string | null;
  author: string | null;
  coverPath: string | null;
  contentMarkdown: string;
  contentHtml: string | null;
  sourceUrl: string | null;
  status: string;
};

type ArticleFormValue = Partial<Omit<ArticleRow, "id">> & { id?: string } & ArticleEditorPreferenceFields;
type JobStatus = {
  id: string;
  status: string;
  progress: number;
  result: string | null;
  error: string | null;
  logs?: Array<{ message: string; level: string }>;
};
type AiToolResult = {
  action: string;
  title?: string;
  digest?: string;
  contentMarkdown?: string;
  coverPrompt?: string;
  rationale?: string;
};
type PublishCheckResult = {
  level: "pass" | "warn" | "block";
  summary: string;
  recommendedTemplateId?: string;
  templateReason?: string;
  issues: Array<{ severity: "info" | "warning" | "block"; message: string; suggestion?: string }>;
};
type GeneratedImageResult = {
  path: string;
  storagePath: string;
  size: string;
  prompt: string;
  mode: "text" | "edit";
  references: string[];
};

export function ArticleStatusBadge({ status }: { status: string }) {
  const tone = status === "pushed" ? "success" : status === "archived" ? "neutral" : "info";
  const label = status === "pushed" ? "已推送" : status === "archived" ? "已归档" : "草稿";
  return <Badge tone={tone}>{label}</Badge>;
}

export function AddArticleDialog({
  mps,
  writingStyles,
  wechatTemplates
}: {
  mps: MpOption[];
  writingStyles: WritingStyleOption[];
  wechatTemplates: WechatTemplateOption[];
}) {
  const [generatedArticle, setGeneratedArticle] = useState<ArticleFormValue | undefined>();
  const [openSignal, setOpenSignal] = useState(0);

  function useGeneratedArticle(article: ArticleFormValue) {
    setGeneratedArticle(article);
    setOpenSignal((current) => current + 1);
  }

  return (
    <div className="actions">
      <GenerateArticleDialog
        mps={mps}
        writingStyles={writingStyles}
        wechatTemplates={wechatTemplates}
        onGenerated={useGeneratedArticle}
      />
      <ArticleEditor
        title="新建文章"
        trigger={<Button size="sm" variant="secondary"><Plus size={15} />新建文章</Button>}
        method="POST"
        url="/api/admin/articles"
        mps={mps}
        writingStyles={writingStyles}
        wechatTemplates={wechatTemplates}
      />
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

export function ArticleActions({
  article,
  mps,
  writingStyles,
  wechatTemplates
}: {
  article: ArticleRow;
  mps: MpOption[];
  writingStyles: WritingStyleOption[];
  wechatTemplates: WechatTemplateOption[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function remove() {
    const response = await fetch(`/api/admin/articles/${encodeURIComponent(article.id)}`, { method: "DELETE" });
    const json = await response.json().catch(() => null);
    setMessage(json?.message || (response.ok ? "已删除" : "删除失败"));
    if (response.ok) router.refresh();
  }

  return (
    <div className="stack">
      <div className="actions nowrap">
        <PublishArticleButton articleId={article.id} wechatTemplates={wechatTemplates} />
        <ArticleEditor
          title="编辑文章"
          trigger={<Button variant="secondary" size="icon" title="编辑" aria-label="编辑"><Edit size={14} /></Button>}
          method="PUT"
          url={`/api/admin/articles/${encodeURIComponent(article.id)}`}
          article={article}
          mps={mps}
          writingStyles={writingStyles}
          wechatTemplates={wechatTemplates}
        />
        <ConfirmDelete
          title="删除文章"
          description={`确认删除《${article.title}》？已推送到微信草稿箱的内容不会被自动删除。`}
          onConfirm={remove}
          trigger={<Button variant="danger" size="sm"><Trash2 size={15} />删除</Button>}
        />
      </div>
      {message ? <span className="muted">{message}</span> : null}
    </div>
  );
}

export function ArticleEditor({
  title,
  trigger,
  method,
  url,
  article,
  mps,
  writingStyles,
  wechatTemplates,
  openSignal
}: {
  title: string;
  trigger: ReactNode;
  method: "POST" | "PUT";
  url: string;
  article?: ArticleFormValue;
  mps: MpOption[];
  writingStyles: WritingStyleOption[];
  wechatTemplates: WechatTemplateOption[];
  openSignal?: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(article?.contentHtml || "");
  const [form, setForm] = useState(() => articleToForm(article));
  const initialPreferences = getArticleEditorPreferences(article, writingStyles, wechatTemplates);
  const [stylePresetId, setStylePresetId] = useState(initialPreferences.stylePresetId);
  const [style, setStyle] = useState(initialPreferences.style);
  const [templateId, setTemplateId] = useState(initialPreferences.templateId);
  const [generationPoints, setGenerationPoints] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiAction, setAiAction] = useState<ArticleToolAction>("outline");
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiToolResult | null>(null);
  const [imageLoading, setImageLoading] = useState<"cover" | "illustration" | "">("");
  const [generatedImage, setGeneratedImage] = useState<(GeneratedImageResult & { type: "cover" | "illustration" }) | null>(null);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  useEffect(() => {
    if (!openSignal) return;
    setForm(articleToForm(article));
    setPreview(article?.contentHtml || "");
    const preferences = getArticleEditorPreferences(article, writingStyles, wechatTemplates);
    setStylePresetId(preferences.stylePresetId);
    setStyle(preferences.style);
    setTemplateId(preferences.templateId);
    setMessage("Kimi 已生成草稿，请检查后保存");
    setOpen(true);
  }, [article, openSignal, writingStyles, wechatTemplates]);

  function setField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function upload(file: File, target: "cover" | "body" | "reference") {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/uploads", { method: "POST", body });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      setMessage(json?.message || "上传失败");
      return;
    }
    const uploadedPath = json.data.path as string;
    if (target === "cover") setField("coverPath", uploadedPath);
    else if (target === "body") setField("contentMarkdown", `${form.contentMarkdown}\n\n![图片](${uploadedPath})`);
    else setReferenceImages((current) => [...current, uploadedPath].slice(0, 16));
    setMessage(target === "reference" ? "参考图已上传，生成图片时将自动使用图生图" : "图片已上传");
  }

  async function generateIntoEditor() {
    const topic = form.title.trim() || form.digest.trim();
    if (!topic) {
      setMessage("请先填写标题或摘要，再生成正文");
      return;
    }

    setGenerating(true);
    setMessage("正在调用 Kimi 生成正文...");
    const response = await fetch("/api/admin/articles/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        topic,
        points: generationPoints.trim() || form.digest.trim() || null,
        stylePresetId,
        style,
        mpId: form.mpId || null,
        author: form.author || null,
        length: "1000 字左右"
      })
    });
    const json = await response.json().catch(() => null);
    setGenerating(false);

    if (!response.ok) {
      setMessage(json?.message || "生成失败");
      return;
    }

    setForm((current) => ({
      ...current,
      title: json.data.title || current.title,
      digest: json.data.digest || current.digest,
      author: json.data.author || current.author,
      contentMarkdown: json.data.contentMarkdown || current.contentMarkdown
    }));
    setPreview("");
    setMessage("Kimi 已生成正文，请检查后保存");
  }

  async function runAiTool() {
    setAiLoading(true);
    setMessage("AI 正在生成建议...");
    const response = await fetch("/api/admin/ai/article-tools", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: aiAction,
        title: form.title,
        digest: form.digest,
        contentMarkdown: form.contentMarkdown,
        instruction: aiInstruction,
        mpId: form.mpId || null,
        styleId: stylePresetId
      })
    });
    const json = await response.json().catch(() => null);
    setAiLoading(false);

    if (!response.ok) {
      setMessage(json?.message || "AI 建议生成失败");
      return;
    }

    setAiResult(json.data);
    setMessage("AI 建议已生成，确认后再应用");
  }

  function applyAiResult(target: "title" | "digest" | "contentMarkdown") {
    if (!aiResult?.[target]) return;
    setField(target, aiResult[target] || "");
    if (target === "contentMarkdown") setPreview("");
    setMessage("AI 建议已应用，请检查后保存");
  }

  async function generateImage(type: "cover" | "illustration") {
    const topic = form.title.trim() || form.digest.trim() || form.contentMarkdown.slice(0, 80).trim();
    if (!topic) {
      setMessage("请先填写标题、摘要或正文，再生成图片");
      return;
    }

    setImageLoading(type);
    const usingReferences = referenceImages.length > 0;
    setMessage(usingReferences
      ? (type === "cover" ? "正在基于参考图生成封面..." : "正在基于参考图生成插图...")
      : (type === "cover" ? "正在生成封面..." : "正在生成插图..."));
    const response = await fetch("/api/admin/ai/images", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type,
        title: form.title,
        digest: form.digest,
        contentMarkdown: form.contentMarkdown,
        styleHint: `${writingStyles.find((item) => item.id === stylePresetId)?.name || ""} ${style}`.trim() || null,
        referenceImages
      })
    });
    const json = await response.json().catch(() => null);
    setImageLoading("");

    if (!response.ok) {
      setMessage(json?.message || "图片生成失败");
      return;
    }

    setGeneratedImage({ ...json.data, type });
    setMessage(type === "cover"
      ? `${json.data.mode === "edit" ? "图生图封面" : "封面"}已生成，确认后可应用`
      : `${json.data.mode === "edit" ? "图生图插图" : "插图"}已生成（${json.data.size}），确认后可插入正文`);
  }

  function applyGeneratedImage() {
    if (!generatedImage) return;
    if (generatedImage.type === "cover") {
      setField("coverPath", generatedImage.path);
      setMessage("封面已应用，请保存文章");
      return;
    }

    setField("contentMarkdown", `${form.contentMarkdown.trim()}\n\n![插图](${generatedImage.path})`.trim());
    setPreview("");
    setMessage("插图已插入正文，请保存文章");
  }

  function removeReferenceImage(image: string) {
    setReferenceImages((current) => current.filter((item) => item !== image));
    setMessage("参考图已移除");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await save(false);
  }

  async function save(publishAfterSave: boolean) {
    const response = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...form, mpId: form.mpId || null })
    });
    const json = await response.json().catch(() => null);
    setMessage(json?.message || (response.ok ? "已保存" : "保存失败"));
    if (response.ok) {
      if (publishAfterSave && article?.id) {
        await publishArticle(article.id, setMessage, templateId);
        router.refresh();
        return;
      }
      setOpen(false);
      router.refresh();
    }
  }

  async function renderPreview() {
    const response = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...form, mpId: form.mpId || null })
    });
    const json = await response.json().catch(() => null);
    if (response.ok) {
      setPreview(json.data.contentHtml || "");
      setMessage("预览已更新");
      router.refresh();
    } else {
      setMessage(json?.message || "预览失败");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title={title}>
        <form className="form-grid" onSubmit={submit}>
          <label className="form-full">标题<input value={form.title} onChange={(e) => setField("title", e.target.value)} required /></label>
          <label>订阅号<select value={form.mpId} onChange={(e) => setField("mpId", e.target.value)}><option value="">未指定</option>{mps.map((mp) => <option key={mp.id} value={mp.id}>{mp.name}</option>)}</select></label>
          <label>作者<input value={form.author} onChange={(e) => setField("author", e.target.value)} /></label>
          <label>状态<select value={form.status} onChange={(e) => setField("status", e.target.value)}><option value="draft">草稿</option><option value="pushed">已推送</option><option value="archived">已归档</option></select></label>
          <label>原文链接<input value={form.sourceUrl} onChange={(e) => setField("sourceUrl", e.target.value)} /></label>
          <label className="form-full">封面路径<input value={form.coverPath} onChange={(e) => setField("coverPath", e.target.value)} placeholder="/uploads/cover.png" /></label>
          <label className="form-full">
            上传封面
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "cover")} />
          </label>
          <label className="form-full">摘要<textarea value={form.digest} onChange={(e) => setField("digest", e.target.value)} rows={2} /></label>
          <WritingStyleFields
            writingStyles={writingStyles}
            stylePresetId={stylePresetId}
            style={style}
            onStylePresetChange={setStylePresetId}
            onStyleChange={setStyle}
          />
          <label className="form-full">生成要点<textarea value={generationPoints} onChange={(e) => setGenerationPoints(e.target.value)} rows={3} placeholder="可选：给 Kimi 的写作要求或要点，不会保存到文章。" /></label>
          <TemplateSelect templates={wechatTemplates} templateId={templateId} onTemplateChange={setTemplateId} />
          <div className="form-section form-full">
            <div className="form-section-title">AI 编辑工具</div>
            <div className="form-grid">
              <label>
                动作
                <select value={aiAction} onChange={(event) => setAiAction(event.target.value as ArticleToolAction)}>
                  <option value="outline">生成提纲</option>
                  <option value="title">生成标题</option>
                  <option value="digest">压缩摘要</option>
                  <option value="rewrite">重写正文</option>
                  <option value="expand">扩写正文</option>
                  <option value="shorten">缩短正文</option>
                  <option value="coverPrompt">生成封面提示词</option>
                </select>
              </label>
              <label>
                补充要求
                <input value={aiInstruction} onChange={(event) => setAiInstruction(event.target.value)} placeholder="可选：更尖锐、保留结构、面向新手等" />
              </label>
              <label>
                参考图
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "reference")} />
              </label>
              <div className="dialog-actions form-full">
                <Button type="button" variant="secondary" disabled={aiLoading} onClick={runAiTool}>
                  <Sparkles size={15} />{aiLoading ? "生成中" : "生成 AI 建议"}
                </Button>
                <Button type="button" variant="secondary" disabled={Boolean(imageLoading)} onClick={() => generateImage("cover")}>
                  <ImagePlus size={15} />{imageLoading === "cover" ? "生成中" : "生成封面"}
                </Button>
                <Button type="button" variant="secondary" disabled={Boolean(imageLoading)} onClick={() => generateImage("illustration")}>
                  <ImagePlus size={15} />{imageLoading === "illustration" ? "生成中" : "生成插图"}
                </Button>
              </div>
            </div>
            {referenceImages.length ? (
              <div className="panel" style={{ marginBottom: 0 }}>
                <div className="row-title">
                  <div className="row-main">
                    <strong>图生图参考图</strong>
                    <br />
                    <span className="meta-text">生成封面或插图时会自动使用这些参考图，最多 16 张。</span>
                  </div>
                </div>
                <div className="actions" style={{ marginTop: 10 }}>
                  {referenceImages.map((image) => (
                    <span key={image} className="chip">
                      <img className="avatar" src={image} alt="" />
                      <span className="meta-text">{image}</span>
                      <button type="button" onClick={() => removeReferenceImage(image)}>移除</button>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {aiResult ? (
              <div className="panel" style={{ marginBottom: 0 }}>
                {aiResult.rationale ? <p className="muted">{aiResult.rationale}</p> : null}
                {aiResult.title ? <p><strong>标题：</strong>{aiResult.title}</p> : null}
                {aiResult.digest ? <p><strong>摘要：</strong>{aiResult.digest}</p> : null}
                {aiResult.coverPrompt ? <p><strong>封面提示词：</strong>{aiResult.coverPrompt}</p> : null}
                {aiResult.contentMarkdown ? <pre style={{ whiteSpace: "pre-wrap" }}>{aiResult.contentMarkdown}</pre> : null}
                <div className="actions">
                  {aiResult.title ? <Button type="button" variant="secondary" size="sm" onClick={() => applyAiResult("title")}>应用标题</Button> : null}
                  {aiResult.digest ? <Button type="button" variant="secondary" size="sm" onClick={() => applyAiResult("digest")}>应用摘要</Button> : null}
                  {aiResult.contentMarkdown ? <Button type="button" variant="secondary" size="sm" onClick={() => applyAiResult("contentMarkdown")}>应用正文</Button> : null}
                </div>
              </div>
            ) : null}
            {generatedImage ? (
              <div className="panel" style={{ marginBottom: 0 }}>
                <div className="row-title">
                  <img className="avatar" src={generatedImage.path} alt="" />
                  <div className="row-main">
                    <strong>{generatedImage.type === "cover" ? "封面图" : "正文插图"} · {generatedImage.size} · {generatedImage.mode === "edit" ? "图生图" : "文生图"}</strong>
                    <br />
                    <span className="meta-text">{generatedImage.path}</span>
                  </div>
                </div>
                <img src={generatedImage.path} alt="" style={{ display: "block", width: "100%", maxWidth: 420, marginTop: 10, borderRadius: 8 }} />
                <p className="muted">{generatedImage.prompt}</p>
                <div className="actions">
                  <Button type="button" variant="secondary" size="sm" onClick={applyGeneratedImage}>
                    {generatedImage.type === "cover" ? "应用为封面" : "插入正文"}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
          <label className="form-full">Markdown 正文<textarea value={form.contentMarkdown} onChange={(e) => setField("contentMarkdown", e.target.value)} rows={10} /></label>
          <label className="form-full">
            上传正文图片
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "body")} />
          </label>
          {preview ? <div className="form-section"><div className="form-section-title">HTML 预览</div><div dangerouslySetInnerHTML={{ __html: preview }} /></div> : null}
          <div className="dialog-actions form-full">
            {message ? <span className="muted">{message}</span> : null}
            <Button type="button" variant="secondary" disabled={generating} onClick={generateIntoEditor}><Sparkles size={15} />{generating ? "生成中" : "一键生成正文"}</Button>
            {method === "PUT" ? <Button type="button" variant="secondary" onClick={renderPreview}><ImagePlus size={15} />保存并预览</Button> : null}
            {method === "PUT" && article?.id ? <Button type="button" variant="secondary" onClick={() => save(true)}><Send size={15} />保存并推送</Button> : null}
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function WritingStyleFields({
  writingStyles,
  stylePresetId,
  style,
  onStylePresetChange,
  onStyleChange
}: {
  writingStyles: WritingStyleOption[];
  stylePresetId: string;
  style: string;
  onStylePresetChange: (value: string) => void;
  onStyleChange: (value: string) => void;
}) {
  return (
    <>
      <label>
        写作风格
        <select value={stylePresetId} onChange={(event) => onStylePresetChange(event.target.value)}>
          {writingStyles.map((preset) => (
            <option key={preset.id} value={preset.id}>{preset.name}</option>
          ))}
        </select>
      </label>
      <label>
        风格补充
        <input value={style} onChange={(event) => onStyleChange(event.target.value)} placeholder="可选：更口语化、少用排比等" />
      </label>
      <div className="form-section form-full">
        <div className="form-section-title">风格说明</div>
        <p className="muted">{writingStyles.find((preset) => preset.id === stylePresetId)?.description}</p>
      </div>
    </>
  );
}

function TemplateSelect({
  templates,
  templateId,
  onTemplateChange
}: {
  templates: WechatTemplateOption[];
  templateId: string;
  onTemplateChange: (value: string) => void;
}) {
  return (
    <>
      <label className="form-full">
        排版模板
        <select value={templateId} onChange={(event) => onTemplateChange(event.target.value)}>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </label>
      <div className="form-section form-full">
        <div className="form-section-title">模板说明</div>
        <p className="muted">{templates.find((template) => template.id === templateId)?.description}</p>
      </div>
    </>
  );
}

function PublishArticleButton({ articleId, wechatTemplates }: { articleId: string; wechatTemplates: WechatTemplateOption[] }) {
  const router = useRouter();
  const [jobId, setJobId] = useState("");
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState(getDefaultWechatTemplateId(wechatTemplates));
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<PublishCheckResult | null>(null);

  useEffect(() => {
    if (!jobId) return;
    let stopped = false;

    async function poll() {
      const response = await fetch(`/api/admin/jobs/${encodeURIComponent(jobId)}`);
      const json = await response.json().catch(() => null);
      if (!response.ok || stopped) return;

      const job = json.data as JobStatus;
      if (job.status === "completed") {
        const result = parseJobResult(job.result);
        setMessage(result?.mediaId ? `已创建草稿 ${result.mediaId}` : "已创建草稿");
        setRunning(false);
        router.refresh();
        return;
      }
      if (job.status === "failed") {
        setMessage(job.error || "推送失败");
        setRunning(false);
        router.refresh();
        return;
      }

      const latestLog = job.logs?.[job.logs.length - 1]?.message;
      setMessage(`${job.status === "pending" ? "排队中" : "推送中"} ${job.progress}%${latestLog ? ` · ${latestLog}` : ""}`);
      window.setTimeout(poll, 2000);
    }

    poll();
    return () => {
      stopped = true;
    };
  }, [jobId, router]);

  async function publish() {
    setRunning(true);
    setMessage("正在创建推送任务...");
    const result = await publishArticle(articleId, setMessage, templateId);
    setRunning(false);
    if (result?.jobId) {
      setRunning(true);
      setJobId(result.jobId);
      setOpen(false);
    }
  }

  async function runPublishCheck() {
    setChecking(true);
    setMessage("AI 正在检查发布准备度...");
    const response = await fetch(`/api/admin/articles/${encodeURIComponent(articleId)}/ai-check`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ templateId })
    });
    const json = await response.json().catch(() => null);
    setChecking(false);

    if (!response.ok) {
      setMessage(json?.message || "发布检查失败");
      return;
    }

    setCheckResult(json.data);
    setMessage("发布检查已完成");
  }

  return (
    <div className="stack">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="secondary" size="sm" disabled={running}><Send size={15} />推送草稿箱</Button>
        </DialogTrigger>
        <DialogContent title="推送到草稿箱">
          <div className="form-grid">
            <TemplateSelect templates={wechatTemplates} templateId={templateId} onTemplateChange={setTemplateId} />
            <div className="form-section form-full">
              <div className="form-section-title">AI 发布检查</div>
              <div className="dialog-actions">
                <Button type="button" variant="secondary" disabled={checking} onClick={runPublishCheck}>
                  <CheckCircle2 size={15} />{checking ? "检查中" : "运行发布检查"}
                </Button>
                {checkResult?.recommendedTemplateId && checkResult.recommendedTemplateId !== templateId ? (
                  <Button type="button" variant="secondary" onClick={() => setTemplateId(checkResult.recommendedTemplateId || templateId)}>
                    应用推荐模板
                  </Button>
                ) : null}
              </div>
              {checkResult ? (
                <div className="panel" style={{ marginBottom: 0 }}>
                  <p><strong>{checkResult.level === "pass" ? "可发布" : checkResult.level === "block" ? "有阻塞项" : "建议修改"}</strong>：{checkResult.summary}</p>
                  {checkResult.templateReason ? <p className="muted">{checkResult.templateReason}</p> : null}
                  {checkResult.issues.length ? (
                    <ul>
                      {checkResult.issues.map((issue, index) => (
                        <li key={`${issue.message}-${index}`}>
                          <Badge tone={issue.severity === "block" ? "danger" : issue.severity === "warning" ? "warning" : "info"}>{issue.severity}</Badge>{" "}
                          {issue.message}{issue.suggestion ? `：${issue.suggestion}` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : <p className="muted">没有发现明显问题。</p>}
                </div>
              ) : null}
            </div>
            <div className="dialog-actions form-full">
              {message ? <span className="muted">{message}</span> : null}
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>取消</Button>
              <Button type="button" disabled={running} onClick={publish}><Send size={15} />确认推送</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {message ? <span className="muted">{message}</span> : null}
    </div>
  );
}

async function publishArticle(articleId: string, setMessage: (message: string) => void, templateId = "clean") {
  const response = await fetch(`/api/admin/articles/${encodeURIComponent(articleId)}/publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ templateId })
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    setMessage(json?.message || "推送任务创建失败");
    return null;
  }

  const jobId = json?.data?.job?.id as string | undefined;
  setMessage(jobId ? `任务 ${jobId}` : json?.message || "草稿推送任务已创建");
  return { jobId };
}

function parseJobResult(result: string | null): { mediaId?: string } | null {
  if (!result) return null;
  try {
    return JSON.parse(result) as { mediaId?: string };
  } catch {
    return null;
  }
}

function articleToForm(article?: ArticleFormValue) {
  return {
    mpId: article?.mpId || "",
    title: article?.title || "",
    digest: article?.digest || "",
    author: article?.author || "",
    coverPath: article?.coverPath || "",
    contentMarkdown: article?.contentMarkdown || "",
    sourceUrl: article?.sourceUrl || "",
    status: article?.status || "draft"
  };
}

function GenerateArticleDialog({
  mps,
  writingStyles,
  wechatTemplates,
  onGenerated
}: {
  mps: MpOption[];
  writingStyles: WritingStyleOption[];
  wechatTemplates: WechatTemplateOption[];
  onGenerated: (article: ArticleFormValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    topic: "",
    points: "",
    stylePresetId: getDefaultWritingStyleId(writingStyles),
    style: "",
    templateId: getDefaultWechatTemplateId(wechatTemplates),
    length: "1000 字左右",
    mpId: "",
    author: ""
  });

  function setField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function generate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("正在调用 Kimi 生成文章...");
    const { templateId: _templateId, ...generationForm } = form;
    const response = await fetch("/api/admin/articles/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...generationForm, mpId: form.mpId || null })
    });
    const json = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setMessage(json?.message || "生成失败");
      return;
    }

    onGenerated(withGeneratedArticlePreferences(
      {
        mpId: form.mpId || null,
        title: json.data.title,
        digest: json.data.digest,
        author: json.data.author || form.author,
        coverPath: "",
        contentMarkdown: json.data.contentMarkdown,
        contentHtml: "",
        sourceUrl: "",
        status: "draft"
      },
      {
        stylePresetId: form.stylePresetId,
        style: form.style,
        templateId: form.templateId
      },
      {
        writingStyles,
        wechatTemplates
      }
    ));
    setMessage("文章已生成");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Sparkles size={15} />一键成文</Button>
      </DialogTrigger>
      <DialogContent title="Kimi 一键成文">
        <form className="form-grid" onSubmit={generate}>
          <label className="form-full">主题<input value={form.topic} onChange={(e) => setField("topic", e.target.value)} placeholder="例如：独立开发者如何稳定运营订阅号" required /></label>
          <label>订阅号<select value={form.mpId} onChange={(e) => setField("mpId", e.target.value)}><option value="">未指定</option>{mps.map((mp) => <option key={mp.id} value={mp.id}>{mp.name}</option>)}</select></label>
          <label>作者<input value={form.author} onChange={(e) => setField("author", e.target.value)} placeholder="可选" /></label>
          <label>篇幅<select value={form.length} onChange={(e) => setField("length", e.target.value)}><option value="800 字左右">800 字左右</option><option value="1000 字左右">1000 字左右</option><option value="1500 字左右">1500 字左右</option><option value="2000 字左右">2000 字左右</option></select></label>
          <WritingStyleFields
            writingStyles={writingStyles}
            stylePresetId={form.stylePresetId}
            style={form.style}
            onStylePresetChange={(value) => setField("stylePresetId", value)}
            onStyleChange={(value) => setField("style", value)}
          />
          <TemplateSelect
            templates={wechatTemplates}
            templateId={form.templateId}
            onTemplateChange={(value) => setField("templateId", value)}
          />
          <label className="form-full">要点<textarea value={form.points} onChange={(e) => setField("points", e.target.value)} rows={5} placeholder="可选：每行一个要点，Kimi 会据此组织文章结构。" /></label>
          <div className="dialog-actions form-full">
            {message ? <span className="muted">{message}</span> : null}
            <Button type="submit" disabled={loading}><Sparkles size={15} />{loading ? "生成中" : "生成草稿"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
