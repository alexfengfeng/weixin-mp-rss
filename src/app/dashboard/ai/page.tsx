import { prisma } from "@/server/db/prisma";
import { CompactPanel, PageHeader } from "@/components/admin/layout";
import { Badge } from "@/components/ui/badge";
import { listWechatStyleTemplates, listWritingStyles } from "@/server/templates/service";
import { AiWorkbench } from "./AiWorkbench";

export default async function AiPage() {
  const [mps, writingStyles, wechatTemplates] = await Promise.all([
    prisma.mpAccount.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    listWritingStyles(true),
    listWechatStyleTemplates(true)
  ]);

  return (
    <>
      <PageHeader
        title="AI 工作台"
        description="从选题、提纲到文章草稿的创作 Copilot。"
        meta={<Badge tone="info">临时建议，保存后才入库</Badge>}
      />
      <CompactPanel>
        <AiWorkbench mps={mps} writingStyles={writingStyles} wechatTemplates={wechatTemplates} />
      </CompactPanel>
    </>
  );
}
