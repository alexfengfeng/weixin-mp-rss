"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Edit, FlaskConical, PauseCircle, PlayCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type MpRow = {
  id: string;
  name: string;
  appId: string;
  avatar: string | null;
  intro: string | null;
  status: number;
};

export function AddMpDialog() {
  return (
    <MpEditor
      title="新增订阅号"
      trigger={<Button size="sm"><Plus size={15} />新增订阅号</Button>}
      method="POST"
      url="/api/admin/mps"
    />
  );
}

export function MpActions({ mp }: { mp: MpRow }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function toggleStatus() {
    await fetch(`/api/admin/mps/${encodeURIComponent(mp.id)}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: mp.status === 1 ? 0 : 1 })
    });
    router.refresh();
  }

  async function testToken() {
    const response = await fetch(`/api/admin/mps/${encodeURIComponent(mp.id)}/test-token`, { method: "POST" });
    const json = await response.json().catch(() => null);
    setMessage(json?.message || (response.ok ? "凭证可用" : "凭证测试失败"));
    router.refresh();
  }

  async function remove() {
    await fetch(`/api/admin/mps/${encodeURIComponent(mp.id)}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="stack">
      <div className="actions nowrap">
        <Button variant="secondary" size="icon" title="测试凭证" aria-label="测试凭证" onClick={testToken}>
          <FlaskConical size={14} />
        </Button>
        <MpEditor
          title="编辑订阅号"
          trigger={<Button variant="secondary" size="icon" title="编辑" aria-label="编辑"><Edit size={14} /></Button>}
          method="PUT"
          url={`/api/admin/mps/${encodeURIComponent(mp.id)}`}
          mp={mp}
        />
        <Button variant="secondary" size="icon" title={mp.status === 1 ? "停用" : "启用"} aria-label={mp.status === 1 ? "停用" : "启用"} onClick={toggleStatus}>
          {mp.status === 1 ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
        </Button>
        <ConfirmDelete
          title="删除订阅号"
          description={`确认删除 ${mp.name}？关联文章会保留为未绑定状态，草稿批次会被删除。`}
          onConfirm={remove}
          trigger={<Button variant="danger" size="sm"><Trash2 size={15} />删除</Button>}
        />
      </div>
      {message ? <span className="muted">{message}</span> : null}
    </div>
  );
}

function MpEditor({
  title,
  trigger,
  method,
  url,
  mp
}: {
  title: string;
  trigger: ReactNode;
  method: "POST" | "PUT";
  url: string;
  mp?: MpRow;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: mp?.name || "",
    appId: mp?.appId || "",
    appSecret: "",
    avatar: mp?.avatar || "",
    intro: mp?.intro || "",
    status: mp?.status ?? 1
  });

  function setField(field: keyof typeof form, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const payload = { ...form, appSecret: form.appSecret || null };
    const response = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
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
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title={title}>
        <form className="form-grid" onSubmit={submit}>
          <label>名称<input value={form.name} onChange={(e) => setField("name", e.target.value)} required /></label>
          <label>AppID<input value={form.appId} onChange={(e) => setField("appId", e.target.value)} required /></label>
          <label>
            AppSecret
            <input
              type="password"
              value={form.appSecret}
              onChange={(e) => setField("appSecret", e.target.value)}
              required={method === "POST"}
              placeholder={method === "PUT" ? "留空则不修改" : ""}
            />
          </label>
          <label>状态<select value={form.status} onChange={(e) => setField("status", Number(e.target.value))}><option value={1}>启用</option><option value={0}>停用</option></select></label>
          <label className="form-full">头像 URL<input value={form.avatar} onChange={(e) => setField("avatar", e.target.value)} /></label>
          <label className="form-full">简介<textarea value={form.intro} onChange={(e) => setField("intro", e.target.value)} rows={3} /></label>
          <div className="dialog-actions form-full">
            {message ? <span className="muted">{message}</span> : null}
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
