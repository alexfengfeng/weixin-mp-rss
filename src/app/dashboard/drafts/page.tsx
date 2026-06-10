import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { CompactPanel, EmptyState, MetaText, PageHeader, Truncate } from "@/components/admin/layout";
import { Badge } from "@/components/ui/badge";
import { CreateDraftDialog, PushDraftButton } from "./DraftActions";

const PAGE_SIZE = 20;

export default async function DraftsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page || 1), 1);
  const [drafts, total, mps, articles] = await Promise.all([
    prisma.draftBatch.findMany({
      orderBy: { createdAt: "desc" },
      include: { mp: true, items: { orderBy: { order: "asc" }, include: { article: true } } },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE
    }),
    prisma.draftBatch.count(),
    prisma.mpAccount.findMany({ where: { status: 1 }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.article.findMany({ where: { status: { in: ["draft", "pushed"] } }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true, mpId: true } })
  ]);

  return (
    <>
      <PageHeader
        title="草稿"
        description="把一篇或多篇本地文章推送到目标订阅号草稿箱。"
        meta={<Badge tone="info">共 {total} 个</Badge>}
        actions={<CreateDraftDialog mps={mps} articles={articles} />}
      />
      <CompactPanel className="flush">
        {drafts.length === 0 ? <EmptyState>暂无草稿批次。请先创建文章，再创建草稿批次。</EmptyState> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>批次</th><th>订阅号</th><th>文章</th><th>状态</th><th>微信 media_id</th><th>时间</th><th>操作</th></tr></thead>
              <tbody>
                {drafts.map((draft) => (
                  <tr key={draft.id}>
                    <td>{draft.title}<br /><Link className="meta-text mono" href={`/dashboard/drafts/${draft.id}`}>{draft.id}</Link></td>
                    <td>{draft.mp.name}</td>
                    <td>
                      {draft.items.map((item) => <Truncate key={item.id} className="meta-text">{item.order + 1}. {item.article.title}</Truncate>)}
                    </td>
                    <td><Badge tone={draft.status === "pushed" ? "success" : draft.status === "failed" ? "danger" : "info"}>{draft.status}</Badge></td>
                    <td><span className="mono">{draft.mediaId || "-"}</span>{draft.error ? <><br /><MetaText>{draft.error}</MetaText></> : null}</td>
                    <td>{draft.createdAt.toLocaleString()}<br /><MetaText>{draft.pushedAt?.toLocaleString() || ""}</MetaText></td>
                    <td><PushDraftButton draftId={draft.id} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CompactPanel>
    </>
  );
}
