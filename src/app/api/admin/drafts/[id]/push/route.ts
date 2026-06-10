import { requireUser } from "@/server/auth/session";
import { enqueuePushDraft } from "@/server/drafts/service";
import { ok, routeGuard } from "@/server/http/responses";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const job = await enqueuePushDraft(id);
    return ok(job, "草稿推送任务已创建");
  });
}
