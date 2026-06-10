import { requireUser } from "@/server/auth/session";
import { getDraftBatch } from "@/server/drafts/service";
import { fail, ok, routeGuard } from "@/server/http/responses";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const draft = await getDraftBatch(id);
    if (!draft) return fail("草稿批次不存在", 404);
    return ok(draft);
  });
}
