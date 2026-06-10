import { prisma } from "@/server/db/prisma";
import { PageHeader } from "@/components/admin/layout";

export default async function DashboardPage() {
  const [mps, enabledMps, articles, draftBatches, jobs] = await Promise.all([
    prisma.mpAccount.count(),
    prisma.mpAccount.count({ where: { status: 1 } }),
    prisma.article.count(),
    prisma.draftBatch.count(),
    prisma.job.count({ where: { status: { in: ["pending", "running"] } } })
  ]);

  return (
    <>
      <PageHeader title="概览" description="订阅号、创作文章和草稿箱推送任务的快速状态。" />
      <div className="stat-grid">
        <div className="stat-card"><p>订阅号</p><strong>{mps}</strong><span className="meta-text">启用 {enabledMps}</span></div>
        <div className="stat-card"><p>文章</p><strong>{articles}</strong><span className="meta-text">本地创作库</span></div>
        <div className="stat-card"><p>草稿批次</p><strong>{draftBatches}</strong><span className="meta-text">单图文 / 多图文</span></div>
        <div className="stat-card"><p>待处理任务</p><strong>{jobs}</strong><span className="meta-text">pending / running</span></div>
      </div>
    </>
  );
}
