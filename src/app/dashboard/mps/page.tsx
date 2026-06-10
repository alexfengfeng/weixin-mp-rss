import { prisma } from "@/server/db/prisma";
import { CompactPanel, EmptyState, MetaText, PageHeader, Truncate } from "@/components/admin/layout";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { AddMpDialog, MpActions } from "./MpActions";

const PAGE_SIZE = 20;

export default async function MpsPage({ searchParams }: { searchParams: Promise<{ localKw?: string; page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page || 1), 1);
  const where = params.localKw ? { name: { contains: params.localKw } } : undefined;
  const [mps, total] = await Promise.all([
    prisma.mpAccount.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { articles: true, draftBatches: true } },
        draftBatches: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE
    }),
    prisma.mpAccount.count({ where })
  ]);
  const pages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <>
      <PageHeader
        title="订阅号"
        description="管理多个微信公众号订阅号的 AppID/AppSecret，并推送文章到草稿箱。"
        meta={<Badge tone="info">共 {total} 个</Badge>}
        actions={<AddMpDialog />}
      />

      <CompactPanel className="flush">
        <div className="toolbar">
          <form>
            <input name="localKw" defaultValue={params.localKw || ""} placeholder="过滤订阅号" />
            <button type="submit">筛选</button>
          </form>
          <LinkButton variant="secondary" size="sm" href="/dashboard/mps">重置</LinkButton>
        </div>

        {mps.length === 0 ? <EmptyState>暂无订阅号。请先新增订阅号并填写 AppID/AppSecret。</EmptyState> : (
        <>
          <div className="table-wrap">
            <table>
              <thead><tr><th>订阅号</th><th>AppID</th><th>状态</th><th>文章/草稿</th><th>Token</th><th>最近推送</th><th>操作</th></tr></thead>
              <tbody>
                {mps.map((mp) => {
                  const latestDraft = mp.draftBatches[0];
                  return (
                    <tr key={mp.id}>
                      <td>
                        <div className="row-title">
                          {mp.avatar ? <img className="avatar" src={mp.avatar} alt="" /> : <div className="avatar" />}
                          <div className="row-main">{mp.name}<br /><Truncate className="meta-text">{mp.intro || "无简介"}</Truncate></div>
                        </div>
                      </td>
                      <td><span className="mono">{mp.appId}</span></td>
                      <td><Badge tone={mp.status === 1 ? "success" : "neutral"}>{mp.status === 1 ? "启用" : "停用"}</Badge></td>
                      <td>{mp._count.articles} / {mp._count.draftBatches}</td>
                      <td>{mp.lastTokenRefreshAt?.toLocaleString() || "-"}</td>
                      <td>
                        {mp.lastDraftPushAt?.toLocaleString() || "-"}
                        {latestDraft ? <><br /><MetaText>{latestDraft.status}{latestDraft.mediaId ? ` · ${latestDraft.mediaId}` : ""}</MetaText></> : null}
                      </td>
                      <td>
                        <MpActions mp={{
                          id: mp.id,
                          name: mp.name,
                          appId: mp.appId,
                          avatar: mp.avatar,
                          intro: mp.intro,
                          status: mp.status
                        }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="toolbar" style={{ marginTop: 14 }}>
            <span className="muted">第 {page} / {pages} 页</span>
            <div className="actions">
              <LinkButton variant="secondary" size="sm" href={`/dashboard/mps?${toQuery(params, page - 1)}`}>上一页</LinkButton>
              <LinkButton variant="secondary" size="sm" href={`/dashboard/mps?${toQuery(params, page + 1)}`}>下一页</LinkButton>
            </div>
          </div>
        </>
        )}
      </CompactPanel>
    </>
  );
}

function toQuery(params: Record<string, string | undefined>, page: number) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") query.set(key, value);
  }
  query.set("page", String(Math.max(page, 1)));
  return query.toString();
}
