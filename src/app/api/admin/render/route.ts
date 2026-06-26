import { z } from "zod";
import { ok, routeGuard } from "@/server/http/responses";
import { requireUser } from "@/server/auth/session";
import { renderMarkdown } from "@/server/layout";

const RenderSchema = z.object({
  markdown: z.string(),
  themeId: z.string().optional()
});

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const body = RenderSchema.parse(await request.json());
    const html = renderMarkdown(body.markdown, body.themeId);
    return ok({ html });
  });
}
