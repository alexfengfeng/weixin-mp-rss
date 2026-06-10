import { requireUser } from "@/server/auth/session";
import { deleteEndedJobs } from "@/server/jobs/admin";
import { ok, routeGuard } from "@/server/http/responses";

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const url = new URL(request.url);
    const result = await deleteEndedJobs({
      type: url.searchParams.get("type") || undefined,
      status: url.searchParams.get("status") || undefined
    });
    return ok(result, `已清理 ${result.count} 个历史任务`);
  });
}
