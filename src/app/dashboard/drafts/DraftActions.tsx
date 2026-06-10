"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type MpOption = { id: string; name: string };
type ArticleOption = { id: string; title: string; mpId: string | null };

export function CreateDraftDialog({ mps, articles }: { mps: MpOption[]; articles: ArticleOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ title: "", mpId: mps[0]?.id || "", articleIds: [] as string[] });

  function toggleArticle(articleId: string) {
    setForm((current) => ({
      ...current,
      articleIds: current.articleIds.includes(articleId)
        ? current.articleIds.filter((id) => id !== articleId)
        : [...current.articleIds, articleId]
    }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/drafts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form)
    });
    const json = await response.json().catch(() => null);
    setMessage(json?.message || (response.ok ? "已创建" : "创建失败"));
    if (response.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  const filteredArticles = form.mpId ? articles.filter((article) => !article.mpId || article.mpId === form.mpId) : articles;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus size={15} />创建草稿批次</Button></DialogTrigger>
      <DialogContent title="创建草稿批次">
        <form className="form-grid" onSubmit={submit}>
          <label className="form-full">批次标题<input value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} required /></label>
          <label className="form-full">目标订阅号<select value={form.mpId} onChange={(e) => setForm((current) => ({ ...current, mpId: e.target.value, articleIds: [] }))} required>{mps.map((mp) => <option key={mp.id} value={mp.id}>{mp.name}</option>)}</select></label>
          <div className="form-section">
            <div className="form-section-title">选择文章，勾选顺序即多图文顺序，最多 8 篇</div>
            {filteredArticles.map((article) => (
              <label key={article.id}>
                <input
                  type="checkbox"
                  checked={form.articleIds.includes(article.id)}
                  disabled={!form.articleIds.includes(article.id) && form.articleIds.length >= 8}
                  onChange={() => toggleArticle(article.id)}
                /> {article.title}
              </label>
            ))}
          </div>
          <div className="dialog-actions form-full">
            {message ? <span className="muted">{message}</span> : null}
            <Button type="submit">创建</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PushDraftButton({ draftId }: { draftId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function push() {
    const response = await fetch(`/api/admin/drafts/${encodeURIComponent(draftId)}/push`, { method: "POST" });
    const json = await response.json().catch(() => null);
    setMessage(json?.data?.id ? `任务 ${json.data.id}` : json?.message || "任务已创建");
    router.refresh();
  }

  return (
    <div className="stack">
      <Button type="button" size="sm" onClick={push}><Send size={15} />推送草稿箱</Button>
      {message ? <span className="muted">{message}</span> : null}
    </div>
  );
}
