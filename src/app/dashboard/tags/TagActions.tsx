"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type MpOption = { id: string; name: string };
type TagRow = {
  id: string;
  name: string;
  intro: string | null;
  cover: string | null;
  status: number;
  mpIds: string[];
};

export function NewTagButton({ mps }: { mps: MpOption[] }) {
  return <TagEditor title="新建标签" method="POST" url="/api/admin/tags" mps={mps} />;
}

export function TagActions({ tag, mps }: { tag: TagRow; mps: MpOption[] }) {
  const router = useRouter();

  async function remove() {
    await fetch(`/api/admin/tags/${encodeURIComponent(tag.id)}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="actions nowrap">
      <TagEditor title="编辑标签" method="PUT" url={`/api/admin/tags/${encodeURIComponent(tag.id)}`} mps={mps} tag={tag} />
      <ConfirmDelete
        title="删除标签"
        description={`确认删除标签「${tag.name}」？不会删除订阅号和文章。`}
        onConfirm={remove}
        trigger={<Button variant="danger" size="sm"><Trash2 size={15} />删除</Button>}
      />
    </div>
  );
}

function TagEditor({
  title,
  method,
  url,
  mps,
  tag
}: {
  title: string;
  method: "POST" | "PUT";
  url: string;
  mps: MpOption[];
  tag?: TagRow;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: tag?.name || "",
    intro: tag?.intro || "",
    cover: tag?.cover || "",
    status: tag?.status ?? 1,
    mpIds: tag?.mpIds || []
  });

  function setField(field: keyof typeof form, value: string | number | string[]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form)
    });
    const json = await response.json().catch(() => null);
    setMessage(json?.message || (response.ok ? "已保存" : "保存失败"));
    if (response.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={tag ? "secondary" : "default"}
          size={tag ? "icon" : "sm"}
          title={title}
          aria-label={title}
        >
          {tag ? <Edit size={14} /> : <Plus size={14} />}
          {tag ? null : title}
        </Button>
      </DialogTrigger>
      <DialogContent title={title}>
        <form className="form-grid" onSubmit={submit}>
          <label>名称<input value={form.name} onChange={(e) => setField("name", e.target.value)} required /></label>
          <label>状态<select value={form.status} onChange={(e) => setField("status", Number(e.target.value))}><option value={1}>启用</option><option value={0}>停用</option></select></label>
          <label>封面<input value={form.cover} onChange={(e) => setField("cover", e.target.value)} /></label>
          <label className="form-full">简介<textarea value={form.intro} onChange={(e) => setField("intro", e.target.value)} rows={2} /></label>
          <label className="form-full">关联订阅号
            <select
              multiple
              value={form.mpIds}
              onChange={(event) => setField("mpIds", Array.from(event.target.selectedOptions).map((item) => item.value))}
              size={Math.min(Math.max(mps.length, 4), 8)}
            >
              {mps.map((mp) => <option key={mp.id} value={mp.id}>{mp.name}</option>)}
            </select>
          </label>
          <div className="dialog-actions form-full">
            {message ? <span className="muted">{message}</span> : null}
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
