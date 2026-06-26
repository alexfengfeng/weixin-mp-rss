import { z } from "zod";
import { uploadImageToWechat } from "@/server/images/upload";
import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";

const UploadImageSchema = z.object({
  filePath: z.string().min(1, "请提供图片路径"),
  mpId: z.string().min(1, "请提供目标订阅号 ID"),
  mode: z.enum(["article", "permanent"]).optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = UploadImageSchema.parse(await request.json());
    const result = await uploadImageToWechat({
      filePath: input.filePath,
      mpId: input.mpId,
      mode: input.mode
    });
    return ok(result, result.mode === "permanent" ? "永久素材已上传" : "正文图片已上传");
  });
}
