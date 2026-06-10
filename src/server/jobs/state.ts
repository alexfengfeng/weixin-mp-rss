export type MinimalJobState = {
  type?: string;
  status: string;
  progress: number;
  error: string | null;
  startedAt?: Date | null;
};

export function isStaleRunningJob(job: MinimalJobState, now = new Date(), timeoutMs = 180_000): boolean {
  if (job.status !== "running" || !job.startedAt) return false;
  return now.getTime() - job.startedAt.getTime() > timeoutMs;
}
