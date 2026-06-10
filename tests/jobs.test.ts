import { describe, expect, test } from "vitest";
import { claimNextJob, completeJob, createJob, failJob, type JobRecord } from "@/server/jobs/queue";

function makeStore() {
  const jobs: JobRecord[] = [];
  return {
    jobs,
    now: () => new Date("2026-06-07T00:00:00.000Z")
  };
}

describe("sqlite-style job queue", () => {
  test("claims the oldest pending job and marks it running", () => {
    const store = makeStore();
    createJob(store, "push_wechat_draft", { draftId: "draft-2" });
    createJob(store, "cleanup", {});

    const claimed = claimNextJob(store);

    expect(claimed?.type).toBe("push_wechat_draft");
    expect(claimed?.status).toBe("running");
    expect(claimed?.startedAt).toEqual(store.now());
  });

  test("requeues failed jobs until max retries is reached", () => {
    const store = makeStore();
    const job = createJob(store, "push_wechat_draft", { draftId: "draft-2" }, { maxRetries: 1 });

    failJob(store, job.id, "temporary failure");

    expect(store.jobs[0].status).toBe("pending");
    expect(store.jobs[0].attempts).toBe(1);

    failJob(store, job.id, "fatal failure");

    expect(store.jobs[0].status).toBe("failed");
    expect(store.jobs[0].error).toBe("fatal failure");
  });

  test("stores completion progress and result", () => {
    const store = makeStore();
    const job = createJob(store, "push_wechat_draft", { draftId: "draft-2" });

    completeJob(store, job.id, { mediaId: "media-1" });

    expect(store.jobs[0].status).toBe("completed");
    expect(store.jobs[0].progress).toBe(100);
    expect(store.jobs[0].result).toEqual({ mediaId: "media-1" });
  });
});
