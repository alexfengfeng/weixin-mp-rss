import { Badge } from "@/components/ui/badge";
import { CompactPanel, EmptyState, MetaText, PageHeader, Truncate } from "@/components/admin/layout";
import { listWritingStyles } from "@/server/templates/service";
import { NewWritingStyleButton, WritingStyleActions, WritingStylePreview } from "../templates/TemplateActions";

export default async function WritingStylesPage() {
  const writingStyles = await listWritingStyles(false);
  const activeCount = writingStyles.filter((item) => item.status === 1).length;

  return (
    <>
      <PageHeader
        title="写作风格"
        description="维护 Kimi 生成文章时使用的语气、结构和表达方式。"
        meta={<Badge tone="info">启用 {activeCount}</Badge>}
        actions={<NewWritingStyleButton />}
      />

      <CompactPanel className="flush">
        {writingStyles.length === 0 ? <EmptyState>暂无写作风格。</EmptyState> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>风格</th><th>状态</th><th>排序</th><th>Prompt</th><th>预览</th><th>操作</th></tr></thead>
              <tbody>
                {writingStyles.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="row-main">
                        <strong>{item.name}</strong>
                        {item.isBuiltin ? <Badge tone="neutral">内置</Badge> : null}
                        <br />
                        <MetaText>{item.description || item.id}</MetaText>
                      </div>
                    </td>
                    <td><Badge tone={item.status === 1 ? "success" : "neutral"}>{item.status === 1 ? "启用" : "停用"}</Badge></td>
                    <td>{item.sortOrder}</td>
                    <td><Truncate className="meta-text">{item.prompt}</Truncate></td>
                    <td><WritingStylePreview item={item} compact /></td>
                    <td><WritingStyleActions item={item} /></td>
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
