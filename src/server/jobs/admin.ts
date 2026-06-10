import { prisma } from "@/server/db/prisma";
import { logJob } from "@/server/jobs/persistent";

const ENDED_STATUSES = new Set(["completed", "failed", "canceled"]);
const ACTIVE_STATUSES = new Set(["pending", "running"]);

export function canDeleteJob(status: string) {
  return ENDED_STATUSES.has(status);
}

export function canCancelJob(status: string) {
  return ACTIVE_STATUSES.has(status);
}

export async function deleteEndedJob(id: string) {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) throw new Error("任务不存在");
  if (!canDeleteJob(job.status)) throw new Error("只能删除已结束任务");
  return prisma.job.delete({ where: { id } });
}

export async function cancelActiveJob(id: string) {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) throw new Error("任务不存在");
  if (!canCancelJob(job.status)) throw new Error("只能取消等待中或运行中的任务");

  const canceled = await prisma.job.update({
    where: { id },
    data: {
      status: "canceled",
      error: "用户手动取消",
      completedAt: new Date()
    }
  });
  await logJob(id, "用户手动取消任务", undefined, "warn");
  return canceled;
}

export async function deleteEndedJobs(filter: { type?: string; status?: string } = {}) {
  const statuses = filter.status && canDeleteJob(filter.status)
    ? [filter.status]
    : Array.from(ENDED_STATUSES);

  return prisma.job.deleteMany({
    where: {
      type: filter.type || undefined,
      status: { in: statuses }
    }
  });
}
