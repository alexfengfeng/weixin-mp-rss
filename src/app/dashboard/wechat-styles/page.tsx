import { Badge } from "@/components/ui/badge";
import { CompactPanel, EmptyState, MetaText, PageHeader, Truncate } from "@/components/admin/layout";
import { listWechatStyleTemplates } from "@/server/templates/service";
import { NewWechatStyleButton, WechatStyleActions, WechatStylePreview } from "../templates/TemplateActions";

export default async function WechatStylesPage() {
  const wechatStyles = await listWechatStyleTemplates(false);
  const activeCount = wechatStyles.filter((item) => item.status === 1).length;

  return (
    <>
      <PageHeader
        title="排版模板"
        description="维护推送到微信公众号草稿箱时使用的内联 HTML 样式。"
        meta={<Badge tone="info">启用 {activeCount}</Badge>}
        actions={<NewWechatStyleButton />}
      />

      <CompactPanel className="flush">
        {wechatStyles.length === 0 ? <EmptyState>暂无排版模板。</EmptyState> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>模板</th><th>状态</th><th>排序</th><th>关键样式</th><th>预览</th><th>操作</th></tr></thead>
              <tbody>
                {wechatStyles.map((item) => (
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
                    <td><Truncate className="meta-text">{`h1: ${item.styles.h1} p: ${item.styles.p}`}</Truncate></td>
                    <td><WechatStylePreview item={item} compact /></td>
                    <td><WechatStyleActions item={item} /></td>
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
