import { z } from "zod";
import { generateArticleImage } from "@/server/ai/images";
import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";

const ImageSchema = z.object({
  type: z.enum(["cover", "illustration"]),
  title: z.string().nullable().optional(),
  digest: z.string().nullable().optional(),
  contentMarkdown: z.string().nullable().optional(),
  selectedText: z.string().nullable().optional(),
  styleHint: z.string().nullable().optional(),
  referenceImages: z.array(z.string().min(1)).max(16).nullable().optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = ImageSchema.parse(await request.json());
    return ok(await generateArticleImage(input), "图片已生成");
  });
}
