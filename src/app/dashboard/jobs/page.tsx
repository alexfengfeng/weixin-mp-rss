import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { CompactPanel, EmptyState, MetaText, PageHeader, Truncate } from "@/components/admin/layout";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { CleanupJobsButton, JobActions } from "./JobActions";

const PAGE_SIZE = 30;

export default async function JobsPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(Number(params.page || 1), 1);
  const where = {
    type: params.type || undefined,
    status: params.status === "all" || params.status === undefined ? undefined : params.status
  };
  const [jobs, total, types] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      include: { logs: { orderBy: { createdAt: "desc" }, take: 1 } }
    }),
    prisma.job.count({ where }),
    prisma.job.findMany({ distinct: ["type"], select: { type: true }, orderBy: { type: "asc" } })
  ]);
  const pages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const cleanupQuery = toQuery(params, undefined, true);

  return (
    <>
      <PageHeader
        title="任务"
        description="查看草稿箱推送和后台任务状态。"
        meta={<Badge tone="info">共 {total} 个</Badge>}
        actions={<CleanupJobsButton query={cleanupQuery} />}
      />

      <CompactPanel className="flush">
        <div className="toolbar">
          <form>
            <select name="type" defaultValue={params.type || ""}>
              <option value="">全部类型</option>
              {types.map((item) => <option key={item.type} value={item.type}>{item.type}</option>)}
            </select>
            <select name="status" defaultValue={params.status || "all"}>
              <option value="all">全部状态</option>
              <option value="pending">pending</option>
              <option value="running">running</option>
              <option value="completed">completed</option>
              <option value="failed">failed</option>
              <option value="canceled">canceled</option>
            </select>
            <button type="submit">筛选</button>
          </form>
          <LinkButton variant="secondary" size="sm" href="/dashboard/jobs">重置</LinkButton>
        </div>

        {jobs.length === 0 ? <EmptyState>暂无任务。</EmptyState> : (
        <>
          <div className="table-wrap">
          <table>
            <thead><tr><th>任务</th><th>状态</th><th>进度</th><th>错误/日志</th><th>时间</th><th>操作</th></tr></thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.type}<br /><Link className="meta-text mono" href={`/dashboard/jobs/${job.id}`}>{job.id}</Link></td>
                  <td><Badge tone={jobTone(job.status)}>{job.status}</Badge><br /><MetaText>尝试 {job.attempts}/{job.maxRetries}</MetaText></td>
                  <td>{job.progress}%</td>
                  <td><Truncate>{job.error || job.logs[0]?.message || "-"}</Truncate></td>
                  <td>{job.createdAt.toLocaleString()}<br /><MetaText>{job.completedAt?.toLocaleString() || ""}</MetaText></td>
                  <td><JobActions job={{ id: job.id, status: job.status }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="toolbar" style={{ marginTop: 14 }}>
          <span className="muted">第 {page} / {pages} 页，共 {total} 个任务</span>
          <div className="actions">
            <LinkButton variant="secondary" size="sm" href={`/dashboard/jobs?${toQuery(params, page - 1)}`}>上一页</LinkButton>
            <LinkButton variant="secondary" size="sm" href={`/dashboard/jobs?${toQuery(params, page + 1)}`}>下一页</LinkButton>
          </div>
          </div>
        </>
        )}
      </CompactPanel>
    </>
  );
}

function jobTone(status: string): "success" | "danger" | "info" | "warning" | "neutral" {
  if (status === "completed") return "success";
  if (status === "failed") return "danger";
  if (status === "running") return "info";
  if (status === "canceled") return "neutral";
  return "warning";
}

function toQuery(params: Record<string, string | undefined>, page?: number, omitPage = false) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page" && value !== "all") query.set(key, value);
  }
  if (!omitPage && page) query.set("page", String(Math.max(page, 1)));
  return query.toString();
}
