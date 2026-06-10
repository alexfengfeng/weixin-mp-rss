import { prisma } from "@/server/db/prisma";
import { isStaleRunningJob } from "@/server/jobs/state";

export async function enqueueJob(type: string, payload: unknown = {}, maxRetries = 3) {
  return prisma.job.create({
    data: {
      type,
      payload: JSON.stringify(payload),
      maxRetries
    }
  });
}

export async function cancelActiveJobsByType(type: string, reason: string) {
  const jobs = await prisma.job.findMany({
    where: {
      type,
      status: { in: ["pending", "running"] }
    },
    select: { id: true }
  });

  if (jobs.length === 0) return 0;

  await prisma.job.updateMany({
    where: { id: { in: jobs.map((job) => job.id) } },
    data: {
      status: "failed",
      error: reason,
      completedAt: new Date()
    }
  });

  await Promise.all(jobs.map((job) => logJob(job.id, reason, undefined, "warn")));
  return jobs.length;
}

export async function failStaleRunningJobs(timeoutMs = 180_000) {
  const now = new Date();
  const runningJobs = await prisma.job.findMany({
    where: { status: "running" }
  });
  const staleJobs = runningJobs.filter((job) => isStaleRunningJob(job, now, timeoutMs));

  if (staleJobs.length === 0) return 0;

  for (const job of staleJobs) {
    const message = `任务运行超时，已自动失败化 (${Math.round(timeoutMs / 1000)}s)`;
    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "failed",
        error: message,
        completedAt: now
      }
    });
    await logJob(job.id, message, undefined, "warn");
  }

  return staleJobs.length;
}

export async function claimPendingJob() {
  const job = await prisma.job.findFirst({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" }
  });
  if (!job) return null;

  return prisma.job.update({
    where: { id: job.id },
    data: {
      status: "running",
      startedAt: new Date(),
      error: null
    }
  });
}

export async function logJob(jobId: string, message: string, meta?: unknown, level = "info") {
  await prisma.jobLog.create({
    data: {
      jobId,
      level,
      message,
      meta: meta === undefined ? undefined : JSON.stringify(meta)
    }
  });
}

export async function updateJobProgress(jobId: string, progress: number, message?: string, meta?: unknown) {
  await prisma.job.update({
    where: { id: jobId },
    data: { progress }
  });

  if (message) {
    await logJob(jobId, message, meta);
  }
}

export async function completePersistentJob(jobId: string, result: unknown) {
  return prisma.job.update({
    where: { id: jobId },
    data: {
      status: "completed",
      progress: 100,
      result: JSON.stringify(result),
      completedAt: new Date()
    }
  });
}

export async function failPersistentJob(jobId: string, error: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return null;

  const attempts = job.attempts + 1;
  return prisma.job.update({
    where: { id: jobId },
    data: {
      attempts,
      status: attempts <= job.maxRetries ? "pending" : "failed",
      error,
      startedAt: attempts <= job.maxRetries ? null : job.startedAt,
      completedAt: attempts <= job.maxRetries ? null : new Date()
    }
  });
}

export async function retryFailedJob(jobId: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("任务不存在");
  if (job.status !== "failed") throw new Error("只有失败任务可以重试");

  return prisma.job.update({
    where: { id: jobId },
    data: {
      status: "pending",
      error: null,
      progress: 0,
      startedAt: null,
      completedAt: null
    }
  });
}

export function parseJobPayload<T>(payload: string): T {
  return JSON.parse(payload || "{}") as T;
}
