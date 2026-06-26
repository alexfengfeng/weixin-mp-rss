import { getBrandProfile } from "@/server/brand/service";
import { listWechatStyleTemplates, listWritingStyles } from "@/server/templates/service";
import { CompactPanel, PageHeader } from "@/components/admin/layout";
import { BrandProfileEditor } from "./BrandProfileEditor";

export default async function BrandPage() {
  const [profile, wechatTemplates, writingStyles] = await Promise.all([
    getBrandProfile(),
    listWechatStyleTemplates(true),
    listWritingStyles(true)
  ]);

  return (
    <>
      <PageHeader
        title="品牌档案"
        description="维护品牌人设、默认风格和写作偏好，AI 写作时自动注入。"
      />
      <CompactPanel>
        <BrandProfileEditor
          profile={profile}
          wechatTemplates={wechatTemplates}
          writingStyles={writingStyles}
        />
      </CompactPanel>
    </>
  );
}
