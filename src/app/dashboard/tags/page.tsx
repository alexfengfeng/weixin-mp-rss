import { prisma } from "@/server/db/prisma";
import { CompactPanel, EmptyState, MetaText, PageHeader, Truncate } from "@/components/admin/layout";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { NewTagButton, TagActions } from "./TagActions";

export default async function TagsPage({ searchParams }: { searchParams: Promise<{ kw?: string }> }) {
  const params = await searchParams;
  const [tags, mps] = await Promise.all([
    prisma.tag.findMany({
      where: params.kw ? { name: { contains: params.kw } } : undefined,
      orderBy: { createdAt: "desc" },
      include: { mps: { include: { mp: true } } }
    }),
    prisma.mpAccount.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
  ]);
  const mpOptions = mps.map((mp) => ({ id: mp.id, name: mp.name }));

  return (
    <>
      <PageHeader
        title="标签"
        description="按主题组织订阅号，辅助文章创作和草稿管理。"
        meta={<Badge tone="info">共 {tags.length} 个</Badge>}
        actions={<NewTagButton mps={mpOptions} />}
      />

      <CompactPanel className="flush">
        <div className="toolbar">
          <form>
            <input name="kw" defaultValue={params.kw || ""} placeholder="搜索标签" />
            <button type="submit">筛选</button>
          </form>
          <LinkButton variant="secondary" size="sm" href="/dashboard/tags">重置</LinkButton>
        </div>

        {tags.length === 0 ? <EmptyState>暂无标签。可以先新建标签，再关联订阅号。</EmptyState> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>标签</th><th>状态</th><th>订阅号</th><th>操作</th></tr></thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id}>
                  <td>
                      <div className="row-title">
                        {tag.cover ? <img className="avatar" src={tag.cover} alt="" /> : <div className="avatar" />}
                      <div className="row-main">{tag.name}<br /><Truncate className="meta-text">{tag.intro || tag.id}</Truncate></div>
                    </div>
                  </td>
                  <td><Badge tone={tag.status === 1 ? "success" : "neutral"}>{tag.status === 1 ? "启用" : "停用"}</Badge></td>
                  <td><Truncate>{tag.mps.map((item) => item.mp.name).join(", ") || "-"}</Truncate><MetaText>{tag.mps.length} 个订阅号</MetaText></td>
                  <td>
                    <TagActions
                      tag={{
                        id: tag.id,
                        name: tag.name,
                        intro: tag.intro,
                        cover: tag.cover,
                        status: tag.status,
                        mpIds: tag.mps.map((item) => item.mpId)
                      }}
                      mps={mpOptions}
                    />
                  </td>
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
