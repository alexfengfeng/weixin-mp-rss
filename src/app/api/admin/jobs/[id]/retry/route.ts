import { requireUser } from "@/server/auth/session";
import { retryFailedJob } from "@/server/jobs/persistent";
import { ok, routeGuard } from "@/server/http/responses";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    return ok(await retryFailedJob(id), "任务已重新排队");
  });
}
