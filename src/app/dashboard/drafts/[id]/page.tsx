import { notFound } from "next/navigation";
import { getDraftBatch } from "@/server/drafts/service";
import { CompactPanel, MetaText, PageHeader } from "@/components/admin/layout";
import { Badge } from "@/components/ui/badge";
import { PushDraftButton } from "../DraftActions";

export default async function DraftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const draft = await getDraftBatch(id);
  if (!draft) notFound();

  return (
    <>
      <PageHeader
        title={draft.title}
        description={`${draft.mp.name} · ${draft.createdAt.toLocaleString()}`}
        meta={<Badge tone={draft.status === "pushed" ? "success" : "info"}>{draft.status}</Badge>}
        actions={<PushDraftButton draftId={draft.id} />}
      />
      <CompactPanel>
        <p>微信 media_id：<span className="mono">{draft.mediaId || "-"}</span></p>
        {draft.error ? <p className="muted">{draft.error}</p> : null}
        {draft.items.map((item) => (
          <section key={item.id}>
            <h2>{item.order + 1}. {item.article.title}</h2>
            <MetaText>{item.article.digest || "无摘要"}</MetaText>
            <div dangerouslySetInnerHTML={{ __html: item.article.contentHtml || "" }} />
          </section>
        ))}
      </CompactPanel>
    </>
  );
}
