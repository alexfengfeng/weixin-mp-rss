import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { CompactPanel, EmptyState, PageHeader, Truncate } from "@/components/admin/layout";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { AddArticleDialog, ArticleActions, ArticleStatusBadge } from "./ArticleActions";
import { listWechatStyleTemplates, listWritingStyles } from "@/server/templates/service";

const PAGE_SIZE = 20;

export default async function ArticlesPage({
  searchParams
}: {
  searchParams: Promise<{ kw?: string; mpId?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(Number(params.page || 1), 1);
  const where = {
    title: params.kw ? { contains: params.kw } : undefined,
    mpId: params.mpId || undefined,
    status: params.status === "all" || params.status === undefined ? undefined : params.status
  };
  const [articles, total, mps, writingStyles, wechatTemplates] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { mp: true },
      orderBy: { updatedAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE
    }),
    prisma.article.count({ where }),
    prisma.mpAccount.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    listWritingStyles(true),
    listWechatStyleTemplates(true)
  ]);
  const pages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <>
      <PageHeader
        title="文章"
        description="本地 Markdown 创作文章库，可推送到订阅号草稿箱。"
        meta={<Badge tone="info">共 {total} 篇</Badge>}
        actions={<AddArticleDialog mps={mps} writingStyles={writingStyles} wechatTemplates={wechatTemplates} />}
      />

      <CompactPanel className="flush">
        <div className="toolbar">
          <form>
            <input name="kw" defaultValue={params.kw || ""} placeholder="搜索标题" />
            <select name="mpId" defaultValue={params.mpId || ""}>
              <option value="">全部订阅号</option>
              {mps.map((mp) => <option key={mp.id} value={mp.id}>{mp.name}</option>)}
            </select>
            <select name="status" defaultValue={params.status || "all"}>
              <option value="all">全部状态</option>
              <option value="draft">草稿</option>
              <option value="pushed">已推送</option>
              <option value="archived">已归档</option>
            </select>
            <button type="submit">筛选</button>
          </form>
          <LinkButton variant="secondary" size="sm" href="/dashboard/articles">重置</LinkButton>
        </div>

        {articles.length === 0 ? <EmptyState>暂无文章。请新建 Markdown 文章。</EmptyState> : (
        <>
          <div className="table-wrap">
          <table>
            <thead><tr><th>文章</th><th>订阅号</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <div className="row-title">
                      {article.coverPath ? <img className="avatar" src={article.coverPath} alt="" /> : <div className="avatar" />}
                      <div className="row-main">
                        <Link href={`/dashboard/articles/${article.id}`}>{article.title}</Link>
                        <br />
                        <Truncate className="meta-text">{article.digest || article.sourceUrl || article.id}</Truncate>
                      </div>
                    </div>
                  </td>
                  <td>{article.mp?.name || "-"}</td>
                  <td><ArticleStatusBadge status={article.status} /></td>
                  <td>{article.updatedAt.toLocaleString()}</td>
                  <td>
                    <ArticleActions article={{
                      id: article.id,
                      mpId: article.mpId,
                      title: article.title,
                      digest: article.digest,
                      author: article.author,
                      coverPath: article.coverPath,
                      contentMarkdown: article.contentMarkdown,
                      contentHtml: article.contentHtml,
                      sourceUrl: article.sourceUrl,
                      status: article.status
                    }} mps={mps} writingStyles={writingStyles} wechatTemplates={wechatTemplates} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="toolbar" style={{ marginTop: 14 }}>
          <span className="muted">第 {page} / {pages} 页</span>
          <div className="actions">
            <LinkButton variant="secondary" size="sm" href={`/dashboard/articles?${toQuery(params, page - 1)}`}>上一页</LinkButton>
            <LinkButton variant="secondary" size="sm" href={`/dashboard/articles?${toQuery(params, page + 1)}`}>下一页</LinkButton>
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
