import { describe, expect, test } from "vitest";
import { isStaleRunningJob } from "@/server/jobs/state";

describe("job state helpers", () => {
  test("detects stale running jobs after timeout", () => {
    const startedAt = new Date("2026-06-07T00:00:00.000Z");
    const now = new Date("2026-06-07T00:03:01.000Z");

    expect(isStaleRunningJob({ type: "push_wechat_draft", status: "running", progress: 20, error: null, startedAt }, now, 180_000)).toBe(true);
  });

  test("does not mark fresh running jobs as stale", () => {
    const startedAt = new Date("2026-06-07T00:00:00.000Z");
    const now = new Date("2026-06-07T00:01:00.000Z");

    expect(isStaleRunningJob({ type: "push_wechat_draft", status: "running", progress: 20, error: null, startedAt }, now, 180_000)).toBe(false);
  });
});
