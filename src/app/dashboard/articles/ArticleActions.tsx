"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Edit, ImagePlus, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDelete } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type MpOption = { id: string; name: string };

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

type ArticleFormValue = Partial<Omit<ArticleRow, "id">> & { id?: string };

export function ArticleStatusBadge({ status }: { status: string }) {
  const tone = status === "pushed" ? "success" : status === "archived" ? "neutral" : "info";
  const label = status === "pushed" ? "已推送" : status === "archived" ? "已归档" : "草稿";
  return <Badge tone={tone}>{label}</Badge>;
}

export function AddArticleDialog({ mps }: { mps: MpOption[] }) {
  const [generatedArticle, setGeneratedArticle] = useState<ArticleFormValue | undefined>();
  const [openSignal, setOpenSignal] = useState(0);

  function useGeneratedArticle(article: ArticleFormValue) {
    setGeneratedArticle(article);
    setOpenSignal((current) => current + 1);
  }

  return (
    <div className="actions">
      <GenerateArticleDialog mps={mps} onGenerated={useGeneratedArticle} />
      <ArticleEditor
        title="新建文章"
        trigger={<Button size="sm" variant="secondary"><Plus size={15} />新建文章</Button>}
        method="POST"
        url="/api/admin/articles"
        mps={mps}
      />
      {generatedArticle ? (
        <ArticleEditor
          title="新建文章"
          trigger={<span hidden />}
          method="POST"
          url="/api/admin/articles"
          article={generatedArticle}
          mps={mps}
          openSignal={openSignal}
        />
      ) : null}
    </div>
  );
}

export function ArticleActions({ article, mps }: { article: ArticleRow; mps: MpOption[] }) {
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
        <ArticleEditor
          title="编辑文章"
          trigger={<Button variant="secondary" size="icon" title="编辑" aria-label="编辑"><Edit size={14} /></Button>}
          method="PUT"
          url={`/api/admin/articles/${encodeURIComponent(article.id)}`}
          article={article}
          mps={mps}
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

function ArticleEditor({
  title,
  trigger,
  method,
  url,
  article,
  mps,
  openSignal
}: {
  title: string;
  trigger: ReactNode;
  method: "POST" | "PUT";
  url: string;
  article?: ArticleFormValue;
  mps: MpOption[];
  openSignal?: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(article?.contentHtml || "");
  const [form, setForm] = useState(() => articleToForm(article));

  useEffect(() => {
    if (!openSignal) return;
    setForm(articleToForm(article));
    setPreview(article?.contentHtml || "");
    setMessage("Kimi 已生成草稿，请检查后保存");
    setOpen(true);
  }, [article, openSignal]);

  function setField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function upload(file: File, target: "cover" | "body") {
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
    else setField("contentMarkdown", `${form.contentMarkdown}\n\n![图片](${uploadedPath})`);
    setMessage("图片已上传");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...form, mpId: form.mpId || null })
    });
    const json = await response.json().catch(() => null);
    setMessage(json?.message || (response.ok ? "已保存" : "保存失败"));
    if (response.ok) {
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
          <label className="form-full">Markdown 正文<textarea value={form.contentMarkdown} onChange={(e) => setField("contentMarkdown", e.target.value)} rows={10} /></label>
          <label className="form-full">
            上传正文图片
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "body")} />
          </label>
          {preview ? <div className="form-section"><div className="form-section-title">HTML 预览</div><div dangerouslySetInnerHTML={{ __html: preview }} /></div> : null}
          <div className="dialog-actions form-full">
            {message ? <span className="muted">{message}</span> : null}
            {method === "PUT" ? <Button type="button" variant="secondary" onClick={renderPreview}><ImagePlus size={15} />保存并预览</Button> : null}
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
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
  onGenerated
}: {
  mps: MpOption[];
  onGenerated: (article: ArticleFormValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    topic: "",
    points: "",
    style: "清晰、克制、适合公众号阅读",
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
    const response = await fetch("/api/admin/articles/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...form, mpId: form.mpId || null })
    });
    const json = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setMessage(json?.message || "生成失败");
      return;
    }

    onGenerated({
      mpId: form.mpId || null,
      title: json.data.title,
      digest: json.data.digest,
      author: json.data.author || form.author,
      coverPath: "",
      contentMarkdown: json.data.contentMarkdown,
      contentHtml: "",
      sourceUrl: "",
      status: "draft"
    });
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
          <label>风格<input value={form.style} onChange={(e) => setField("style", e.target.value)} /></label>
          <label>篇幅<select value={form.length} onChange={(e) => setField("length", e.target.value)}><option value="800 字左右">800 字左右</option><option value="1000 字左右">1000 字左右</option><option value="1500 字左右">1500 字左右</option><option value="2000 字左右">2000 字左右</option></select></label>
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
