import { z } from "zod";
import { uploadArticleImagesFromMarkdown } from "@/server/images/upload";
import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";

const BatchUploadSchema = z.object({
  markdown: z.string(),
  mpId: z.string().min(1, "请提供目标订阅号 ID")
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = BatchUploadSchema.parse(await request.json());
    const { replacements, errors } = await uploadArticleImagesFromMarkdown(input.markdown, input.mpId);
    return ok({
      uploaded: replacements.size,
      failed: errors.length,
      replacements: Object.fromEntries(replacements),
      errors
    }, `上传完成：成功 ${replacements.size} 张，失败 ${errors.length} 张`);
  });
}
