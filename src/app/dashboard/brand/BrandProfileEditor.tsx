"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Sparkles } from "lucide-react";

type BrandProfile = {
  brandName: string;
  slogan: string;
  author: string;
  defaultThemeId: string;
  defaultStyleId: string;
  persona: string;
  coverStyle: string;
  writingPreference: string;
  bannedWords: string;
};

type Option = { id: string; name: string };

export function BrandProfileEditor({
  profile,
  wechatTemplates,
  writingStyles
}: {
  profile: BrandProfile;
  wechatTemplates: Option[];
  writingStyles: Option[];
}) {
  const [form, setForm] = useState<BrandProfile>(profile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function setField<K extends keyof BrandProfile>(key: K, value: BrandProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/brand", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.ok) {
        setMessage("已保存");
        setForm(data.data);
      } else {
        setMessage(data.error || "保存失败");
      }
    } catch {
      setMessage("网络错误");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-grid">
      <label>
        品牌名称
        <input
          value={form.brandName}
          onChange={(e) => setField("brandName", e.target.value)}
          placeholder="如：WeDraft"
        />
      </label>

      <label>
        Slogan / 一句话定位
        <input
          value={form.slogan}
          onChange={(e) => setField("slogan", e.target.value)}
          placeholder="如：让公众号创作更高效"
        />
      </label>

      <label>
        默认作者署名
        <input
          value={form.author}
          onChange={(e) => setField("author", e.target.value)}
          placeholder="如：Alex"
        />
      </label>

      <label>
        默认排版主题
        <select
          value={form.defaultThemeId}
          onChange={(e) => setField("defaultThemeId", e.target.value)}
        >
          {wechatTemplates.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </label>

      <label>
        默认写作风格
        <select
          value={form.defaultStyleId}
          onChange={(e) => setField("defaultStyleId", e.target.value)}
        >
          <option value="">不指定</option>
          {writingStyles.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </label>

      <label className="form-full">
        品牌人设描述
        <textarea
          value={form.persona}
          onChange={(e) => setField("persona", e.target.value)}
          rows={4}
          placeholder="描述品牌的性格、立场、目标读者。如：面向独立开发者的技术媒体，风格专业但不学术，关注实战经验和工具推荐。"
        />
      </label>

      <label className="form-full">
        封面图风格
        <input
          value={form.coverStyle}
          onChange={(e) => setField("coverStyle", e.target.value)}
          placeholder="如：极简扁平、科技感、暖色调插画"
        />
      </label>

      <label className="form-full">
        写作偏好（给 AI 的补充指令）
        <textarea
          value={form.writingPreference}
          onChange={(e) => setField("writingPreference", e.target.value)}
          rows={3}
          placeholder="如：多用短句、避免排比、第一人称叙事、结尾不下定论"
        />
      </label>

      <label className="form-full">
        禁用词 / 敏感词（每行一个）
        <textarea
          value={form.bannedWords}
          onChange={(e) => setField("bannedWords", e.target.value)}
          rows={4}
          placeholder={"如：\n综上所述\n不难发现\n值得一提的是"}
        />
      </label>

      <div className="form-full toolbar" style={{ marginTop: 8 }}>
        <Button type="button" onClick={handleSave} disabled={saving}>
          <Save size={14} />
          {saving ? "保存中..." : "保存品牌档案"}
        </Button>
        {message ? <span className="muted">{message}</span> : null}
      </div>
    </div>
  );
}
