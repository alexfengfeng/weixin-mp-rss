import { notFound } from "next/navigation";
import { getArticle } from "@/server/articles/service";
import { CompactPanel, PageHeader } from "@/components/admin/layout";
import { Badge } from "@/components/ui/badge";

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  return (
    <>
      <PageHeader
        title={article.title}
        description={`${article.mp?.name || "未指定订阅号"} · ${article.updatedAt.toLocaleString()}`}
        meta={<Badge tone={article.status === "pushed" ? "success" : "info"}>{article.status}</Badge>}
      />
      <CompactPanel>
        <p className="muted">{article.digest || "无摘要"}</p>
        {article.coverPath ? <p><img src={article.coverPath} alt="" style={{ maxWidth: 260, borderRadius: 8 }} /></p> : null}
        <h2>Markdown</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>{article.contentMarkdown}</pre>
        <h2>HTML 预览</h2>
        <div dangerouslySetInnerHTML={{ __html: article.contentHtml || "" }} />
      </CompactPanel>
    </>
  );
}
