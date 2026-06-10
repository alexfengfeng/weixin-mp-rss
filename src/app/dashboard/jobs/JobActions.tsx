"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/ui/alert-dialog";

export function JobActions({ job }: { job: { id: string; status: string } }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function request(path: string, method: string) {
    const response = await fetch(path, { method });
    const json = await response.json().catch(() => null);
    setMessage(json?.message || (response.ok ? "操作成功" : "操作失败"));
    if (response.ok) router.refresh();
  }

  return (
    <div className="stack">
      <div className="actions nowrap">
        {job.status === "failed" ? (
          <Button variant="secondary" size="icon" title="重试" aria-label="重试" onClick={() => request(`/api/admin/jobs/${job.id}/retry`, "POST")}><RefreshCw size={14} /></Button>
        ) : null}
        {["pending", "running"].includes(job.status) ? (
          <Button variant="secondary" size="icon" title="取消" aria-label="取消" onClick={() => request(`/api/admin/jobs/${job.id}`, "PATCH")}><Ban size={14} /></Button>
        ) : null}
        {["completed", "failed", "canceled"].includes(job.status) ? (
          <ConfirmDelete
            title="删除任务"
            description="确认删除该历史任务和日志？运行中或等待中的任务不能直接删除。"
            onConfirm={() => request(`/api/admin/jobs/${job.id}`, "DELETE")}
            trigger={<Button variant="danger" size="sm"><Trash2 size={15} />删除</Button>}
          />
        ) : null}
      </div>
      {message ? <span className="muted">{message}</span> : null}
    </div>
  );
}

export function CleanupJobsButton({ query }: { query: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function cleanup() {
    const response = await fetch(`/api/admin/jobs/cleanup${query ? `?${query}` : ""}`, { method: "POST" });
    const json = await response.json().catch(() => null);
    setMessage(json?.message || (response.ok ? "已清理" : "清理失败"));
    if (response.ok) router.refresh();
  }

  return (
    <div className="actions">
      <ConfirmDelete
        title="清理历史任务"
        description="只会删除 completed、failed、canceled 任务；pending 和 running 不会被删除。"
        onConfirm={cleanup}
        trigger={<Button variant="secondary" size="sm"><Trash2 size={15} />清理已结束</Button>}
      />
      {message ? <span className="muted">{message}</span> : null}
    </div>
  );
}
