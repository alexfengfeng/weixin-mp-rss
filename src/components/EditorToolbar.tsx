"use client";

import type { RefObject } from "react";
import { Bold, Code, Heading1, Heading2, Heading3, Image, Italic, Link, List, ListOrdered, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleInserter } from "./ModuleInserter";

export function EditorToolbar({
  textareaRef,
  onInsert
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onInsert: (newText: string, cursorPos: number) => void;
}) {
  function wrap(before: string, after = "", placeholder = "") {
    const el = textareaRef.current;
    if (!el) { onInsert(before + placeholder + after, before.length); return; }
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = el.value.substring(start, end);
    const insertText = selected || placeholder;
    const newText = el.value.substring(0, start) + before + insertText + after + el.value.substring(end);
    const newCursor = selected ? end + before.length + after.length : start + before.length + placeholder.length;
    onInsert(newText, newCursor);
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        marginBottom: 6,
        padding: "6px 8px",
        background: "var(--panel-subtle)",
        borderRadius: 6,
        border: "1px solid var(--line)"
      }}
    >
      <Button type="button" variant="secondary" size="sm" title="加粗" onClick={() => wrap("**", "**", "加粗文字")}>
        <Bold size={14} />
      </Button>
      <Button type="button" variant="secondary" size="sm" title="斜体" onClick={() => wrap("*", "*", "斜体文字")}>
        <Italic size={14} />
      </Button>
      <Button type="button" variant="secondary" size="sm" title="行内代码" onClick={() => wrap("`", "`", "code")}>
        <Code size={14} />
      </Button>

      <span style={{ width: 1, background: "var(--line)", margin: "0 2px" }} aria-hidden />

      <Button type="button" variant="secondary" size="sm" title="一级标题" onClick={() => wrap("\n# ", "", "标题")}>
        <Heading1 size={14} />
      </Button>
      <Button type="button" variant="secondary" size="sm" title="二级标题" onClick={() => wrap("\n## ", "", "标题")}>
        <Heading2 size={14} />
      </Button>
      <Button type="button" variant="secondary" size="sm" title="三级标题" onClick={() => wrap("\n### ", "", "标题")}>
        <Heading3 size={14} />
      </Button>

      <span style={{ width: 1, background: "var(--line)", margin: "0 2px" }} aria-hidden />

      <Button type="button" variant="secondary" size="sm" title="无序列表" onClick={() => wrap("\n- ", "", "列表项")}>
        <List size={14} />
      </Button>
      <Button type="button" variant="secondary" size="sm" title="有序列表" onClick={() => wrap("\n1. ", "", "列表项")}>
        <ListOrdered size={14} />
      </Button>
      <Button type="button" variant="secondary" size="sm" title="引用块" onClick={() => wrap("\n> ", "", "引用文字")}>
        <Quote size={14} />
      </Button>
      <Button type="button" variant="secondary" size="sm" title="代码块" onClick={() => wrap("\n```\n", "\n```", "代码")}>
        <Code size={14} />
      </Button>

      <span style={{ width: 1, background: "var(--line)", margin: "0 2px" }} aria-hidden />

      <Button type="button" variant="secondary" size="sm" title="链接" onClick={() => wrap("[", "](https://)", "链接文字")}>
        <Link size={14} />
      </Button>
      <Button type="button" variant="secondary" size="sm" title="图片" onClick={() => wrap("![", "](https://)", "图片描述")}>
        <Image size={14} />
      </Button>

      <span style={{ width: 1, background: "var(--line)", margin: "0 2px" }} aria-hidden />

      <ModuleInserter
        onInsert={(template) => {
          const el = textareaRef.current;
          if (!el) { onInsert(template, template.length); return; }
          const start = el.selectionStart ?? 0;
          const newText = el.value.substring(0, start) + template + el.value.substring(start);
          onInsert(newText, start + template.length);
        }}
      />
    </div>
  );
}
