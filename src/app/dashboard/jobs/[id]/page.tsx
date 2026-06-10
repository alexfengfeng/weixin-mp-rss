import { notFound } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { CompactPanel, MetaText, PageHeader } from "@/components/admin/layout";
import { Badge } from "@/components/ui/badge";
import { RetryJobButton } from "./RetryJobButton";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: { logs: { orderBy: { createdAt: "asc" } } }
  });
  if (!job) notFound();

  return (
    <>
      <PageHeader title="任务详情" description={job.id} meta={<Badge tone={job.status === "completed" ? "success" : job.status === "failed" ? "danger" : "info"}>{job.status} · {job.progress}%</Badge>} />
      <CompactPanel>
        <div className="actions">
          <MetaText>类型：{job.type}</MetaText>
          <MetaText>创建：{job.createdAt.toLocaleString()}</MetaText>
          <MetaText>完成：{job.completedAt?.toLocaleString() || "-"}</MetaText>
        </div>
        {job.error ? <p style={{ marginTop: 8, marginBottom: 0, color: "#dc2626" }}>{job.error}</p> : null}
        {job.status === "failed" ? <RetryJobButton jobId={job.id} /> : null}
      </CompactPanel>
      <CompactPanel>
        <h2>Payload</h2>
        <pre>{job.payload}</pre>
        <h2>Result</h2>
        <pre>{job.result || "-"}</pre>
      </CompactPanel>
      <CompactPanel>
        <h2>日志</h2>
        <ul>
          {job.logs.map((log) => (
            <li key={log.id}>{log.createdAt.toLocaleString()} [{log.level}] {log.message}</li>
          ))}
        </ul>
      </CompactPanel>
    </>
  );
}
