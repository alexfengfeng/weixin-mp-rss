import { enableSqliteWal, prisma } from "@/server/db/prisma";
import {
  claimPendingJob,
  completePersistentJob,
  failPersistentJob,
  failStaleRunningJobs,
  logJob,
  parseJobPayload
} from "@/server/jobs/persistent";
import { pushDraftBatch } from "@/server/drafts/push";

const POLL_INTERVAL_MS = Number(process.env.WORKER_POLL_INTERVAL_MS || 4000);

type PushDraftPayload = { draftId: string; templateId?: string };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runJob(job: { id: string; type: string; payload: string }) {
  await logJob(job.id, `开始执行任务: ${job.type}`);

  if (job.type === "push_wechat_draft") {
    const payload = parseJobPayload<PushDraftPayload>(job.payload);
    if (!payload.draftId) throw new Error("缺少 draftId");
    const result = await pushDraftBatch(payload.draftId, job.id, payload.templateId);
    await completePersistentJob(job.id, result);
    return;
  }

  throw new Error(`未知任务类型: ${job.type}`);
}

async function tick() {
  await failStaleRunningJobs();
  const job = await claimPendingJob();
  if (!job) return;

  try {
    await runJob(job);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await logJob(job.id, message, undefined, "error");
    await failPersistentJob(job.id, message);
  }
}

async function main() {
  await enableSqliteWal();
  await failStaleRunningJobs();
  console.log(`Worker started. Poll interval: ${POLL_INTERVAL_MS}ms`);
  while (true) {
    await tick();
    await sleep(POLL_INTERVAL_MS);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
