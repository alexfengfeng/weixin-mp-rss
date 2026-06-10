"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { ConfirmDelete } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getWechatStyleTemplate } from "@/lib/presets";

const STYLE_KEYS = ["h1", "h2", "h3", "p", "ul", "ol", "li", "hr", "img", "strong", "a"] as const;

type StyleKey = typeof STYLE_KEYS[number];
type CssStyles = Record<StyleKey, string>;

export type WritingStyleRow = {
  id: string;
  name: string;
  description: string | null;
  prompt: string;
  status: number;
  isBuiltin: boolean;
  sortOrder: number;
};

export type WechatStyleRow = {
  id: string;
  name: string;
  description: string | null;
  styles: CssStyles;
  status: number;
  isBuiltin: boolean;
  sortOrder: number;
};

export function NewWritingStyleButton() {
  return <WritingStyleEditor title="新建写作风格" method="POST" url="/api/admin/templates/writing-styles" />;
}

export function WritingStyleActions({ item }: { item: WritingStyleRow }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function remove() {
    const response = await fetch(`/api/admin/templates/writing-styles/${encodeURIComponent(item.id)}`, { method: "DELETE" });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      setMessage(json?.message || "删除失败");
      return;
    }
    router.refresh();
  }

  return (
    <div className="stack">
      <div className="actions nowrap">
        <WritingStyleEditor title="编辑写作风格" method="PUT" url={`/api/admin/templates/writing-styles/${encodeURIComponent(item.id)}`} item={item} />
        <ConfirmDelete
          title="删除写作风格"
          description={`确认删除「${item.name}」？删除后文章生成会自动回退到其他启用风格。`}
          onConfirm={remove}
          trigger={<Button variant="danger" size="sm"><Trash2 size={15} />删除</Button>}
        />
      </div>
      {message ? <span className="muted">{message}</span> : null}
    </div>
  );
}

export function NewWechatStyleButton() {
  return <WechatStyleEditor title="新建排版模板" method="POST" url="/api/admin/templates/wechat-styles" />;
}

export function WechatStyleActions({ item }: { item: WechatStyleRow }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function remove() {
    const response = await fetch(`/api/admin/templates/wechat-styles/${encodeURIComponent(item.id)}`, { method: "DELETE" });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      setMessage(json?.message || "删除失败");
      return;
    }
    router.refresh();
  }

  return (
    <div className="stack">
      <div className="actions nowrap">
        <WechatStyleEditor title="编辑排版模板" method="PUT" url={`/api/admin/templates/wechat-styles/${encodeURIComponent(item.id)}`} item={item} />
        <ConfirmDelete
          title="删除排版模板"
          description={`确认删除「${item.name}」？删除后推送会自动回退到其他启用模板。`}
          onConfirm={remove}
          trigger={<Button variant="danger" size="sm"><Trash2 size={15} />删除</Button>}
        />
      </div>
      {message ? <span className="muted">{message}</span> : null}
    </div>
  );
}

function WritingStyleEditor({
  title,
  method,
  url,
  item
}: {
  title: string;
  method: "POST" | "PUT";
  url: string;
  item?: WritingStyleRow;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: item?.name || "",
    description: item?.description || "",
    prompt: item?.prompt || "",
    status: item?.status ?? 1,
    sortOrder: item?.sortOrder ?? 0
  });

  function setField(field: keyof typeof form, value: string | number) {
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
        <Button variant={item ? "secondary" : "default"} size={item ? "icon" : "sm"} title={title} aria-label={title}>
          {item ? <Edit size={14} /> : <Plus size={14} />}
          {item ? null : title}
        </Button>
      </DialogTrigger>
      <DialogContent title={title}>
        <form className="form-grid" onSubmit={submit}>
          <label>名称<input value={form.name} onChange={(event) => setField("name", event.target.value)} required /></label>
          <label>状态<select value={form.status} onChange={(event) => setField("status", Number(event.target.value))}><option value={1}>启用</option><option value={0}>停用</option></select></label>
          <label>排序<input type="number" value={form.sortOrder} onChange={(event) => setField("sortOrder", Number(event.target.value))} /></label>
          <label className="form-full">描述<textarea value={form.description} onChange={(event) => setField("description", event.target.value)} rows={2} /></label>
          <label className="form-full">Prompt<textarea value={form.prompt} onChange={(event) => setField("prompt", event.target.value)} rows={7} required /></label>
          <WritingStylePreview item={{ id: item?.id || "draft", name: form.name || "未命名风格", description: form.description || null, prompt: form.prompt, status: form.status, isBuiltin: item?.isBuiltin || false, sortOrder: form.sortOrder }} />
          <div className="dialog-actions form-full">
            {message ? <span className="muted">{message}</span> : null}
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function WechatStyleEditor({
  title,
  method,
  url,
  item
}: {
  title: string;
  method: "POST" | "PUT";
  url: string;
  item?: WechatStyleRow;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: item?.name || "",
    description: item?.description || "",
    status: item?.status ?? 1,
    sortOrder: item?.sortOrder ?? 0,
    styles: item?.styles || emptyStyles()
  });

  function setField(field: "name" | "description" | "status" | "sortOrder", value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function setStyle(key: StyleKey, value: string) {
    setForm((current) => ({ ...current, styles: { ...current.styles, [key]: value } }));
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
        <Button variant={item ? "secondary" : "default"} size={item ? "icon" : "sm"} title={title} aria-label={title}>
          {item ? <Edit size={14} /> : <Plus size={14} />}
          {item ? null : title}
        </Button>
      </DialogTrigger>
      <DialogContent title={title}>
        <form className="form-grid" onSubmit={submit}>
          <label>名称<input value={form.name} onChange={(event) => setField("name", event.target.value)} required /></label>
          <label>状态<select value={form.status} onChange={(event) => setField("status", Number(event.target.value))}><option value={1}>启用</option><option value={0}>停用</option></select></label>
          <label>排序<input type="number" value={form.sortOrder} onChange={(event) => setField("sortOrder", Number(event.target.value))} /></label>
          <label className="form-full">描述<textarea value={form.description} onChange={(event) => setField("description", event.target.value)} rows={2} /></label>
          {STYLE_KEYS.map((key) => (
            <label key={key} className="form-full">{key} CSS<input value={form.styles[key]} onChange={(event) => setStyle(key, event.target.value)} /></label>
          ))}
          <WechatStylePreview item={{ id: item?.id || "draft", name: form.name || "未命名模板", description: form.description || null, styles: form.styles, status: form.status, isBuiltin: item?.isBuiltin || false, sortOrder: form.sortOrder }} />
          <div className="dialog-actions form-full">
            {message ? <span className="muted">{message}</span> : null}
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function emptyStyles(): CssStyles {
  return { ...getWechatStyleTemplate("clean").styles };
}

export function WritingStylePreview({ item, compact = false }: { item: WritingStyleRow; compact?: boolean }) {
  if (compact) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" title="预览" aria-label="预览"><Eye size={14} /></Button>
        </DialogTrigger>
        <DialogContent title={`预览：${item.name}`}>
          <WritingStylePreviewContent item={item} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="form-section">
      <div className="form-section-title">本地预览</div>
      <WritingStylePreviewContent item={item} />
    </div>
  );
}

function WritingStylePreviewContent({ item }: { item: WritingStyleRow }) {
  return (
    <div className="stack">
      <div>
        <strong>{item.name || "未命名风格"}</strong>
        <p className="muted" style={{ margin: "4px 0 0" }}>{item.description || "暂无描述"}</p>
      </div>
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="form-section-title">Prompt</div>
        <pre style={{ margin: "6px 0 0" }}>{item.prompt || "保存前请输入用于约束 Kimi 的写作 Prompt。"}</pre>
      </div>
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="form-section-title">固定结构示例</div>
        <ol style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          <li>开头：用一个具体场景切入主题。</li>
          <li>正文：围绕 3 个要点展开，每节给出清晰判断。</li>
          <li>结尾：收束到一个可执行建议。</li>
        </ol>
      </div>
    </div>
  );
}

export function WechatStylePreview({ item, compact = false }: { item: WechatStyleRow; compact?: boolean }) {
  if (compact) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="icon" title="预览" aria-label="预览"><Eye size={14} /></Button>
        </DialogTrigger>
        <DialogContent title={`预览：${item.name}`}>
          <WechatStylePreviewContent item={item} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="form-section">
      <div className="form-section-title">排版预览</div>
      <WechatStylePreviewContent item={item} />
    </div>
  );
}

function WechatStylePreviewContent({ item }: { item: WechatStyleRow }) {
  const styles = item.styles;
  return (
    <div className="panel" style={{ marginBottom: 0, background: "#fff", maxWidth: 640 }}>
      <h1 style={cssToReactStyle(styles.h1)}>一人团队的内容工作流</h1>
      <p style={cssToReactStyle(styles.p)}>这是一段用于预览的公众号正文。它会展示段落的字号、行高、颜色和间距。</p>
      <h2 style={cssToReactStyle(styles.h2)}>一、先把主题收窄</h2>
      <p style={cssToReactStyle(styles.p)}>写作不是堆信息，而是把 <strong style={cssToReactStyle(styles.strong)}>判断</strong> 变得清楚。</p>
      <h3 style={cssToReactStyle(styles.h3)}>操作清单</h3>
      <ol style={cssToReactStyle(styles.ol)}>
        <li style={cssToReactStyle(styles.li)}>确定读者是谁。</li>
        <li style={cssToReactStyle(styles.li)}>写下核心结论。</li>
        <li style={cssToReactStyle(styles.li)}>补充一个例子。</li>
      </ol>
      <ul style={cssToReactStyle(styles.ul)}>
        <li style={cssToReactStyle(styles.li)}>保持标题明确。</li>
        <li style={cssToReactStyle(styles.li)}>让段落短一点。</li>
      </ul>
      <hr style={cssToReactStyle(styles.hr)} />
      <p style={cssToReactStyle(styles.p)}>这里有一个 <a href="https://example.com" style={cssToReactStyle(styles.a)}>链接示例</a>。</p>
      <div style={{ ...cssToReactStyle(styles.img), display: "grid", placeItems: "center", minHeight: 96, background: "#f4f4f5", border: "1px solid #e5e7eb", color: "#71717a" }}>
        图片占位预览
      </div>
    </div>
  );
}

function cssToReactStyle(value: string): CSSProperties {
  const style: Record<string, string | number> = {};
  for (const declaration of value.split(";")) {
    const [rawKey, ...rawValue] = declaration.split(":");
    const key = rawKey?.trim();
    const cssValue = rawValue.join(":").trim();
    if (!key || !cssValue) continue;
    style[key.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase())] = cssValue;
  }
  return style as CSSProperties;
}
