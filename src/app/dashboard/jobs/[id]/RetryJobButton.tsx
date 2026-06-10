"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RetryJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function retry() {
    setLoading(true);
    await fetch(`/api/admin/jobs/${jobId}/retry`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return <button type="button" onClick={retry} disabled={loading}>{loading ? "已提交" : "重试任务"}</button>;
}
