import { prisma } from "@/server/db/prisma";
import { requireUser } from "@/server/auth/session";
import { cancelActiveJob, deleteEndedJob } from "@/server/jobs/admin";
import { fail, ok, routeGuard } from "@/server/http/responses";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: { logs: { orderBy: { createdAt: "asc" } } }
    });
    if (!job) return fail("任务不存在", 404);
    return ok(job);
  });
}

export async function PATCH(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    return ok(await cancelActiveJob(id), "任务已取消");
  });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    await deleteEndedJob(id);
    return ok({ id }, "任务已删除");
  });
}
