export type JobStatus = "pending" | "running" | "completed" | "failed";

export type JobRecord = {
  id: string;
  type: string;
  status: JobStatus;
  payload: unknown;
  result: unknown;
  progress: number;
  attempts: number;
  maxRetries: number;
  error: string | null;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
};

export type InMemoryJobStore = {
  jobs: JobRecord[];
  now: () => Date;
};

type CreateJobOptions = {
  maxRetries?: number;
};

let sequence = 0;

export function createJob(
  store: InMemoryJobStore,
  type: string,
  payload: unknown,
  options: CreateJobOptions = {}
): JobRecord {
  const job: JobRecord = {
    id: `job_${++sequence}`,
    type,
    status: "pending",
    payload,
    result: null,
    progress: 0,
    attempts: 0,
    maxRetries: options.maxRetries ?? 3,
    error: null,
    createdAt: store.now(),
    startedAt: null,
    completedAt: null
  };

  store.jobs.push(job);
  return job;
}

export function claimNextJob(store: InMemoryJobStore): JobRecord | null {
  const job = store.jobs
    .filter((item) => item.status === "pending")
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];

  if (!job) return null;

  job.status = "running";
  job.startedAt = store.now();
  job.error = null;
  return job;
}

export function completeJob(store: InMemoryJobStore, jobId: string, result: unknown): JobRecord {
  const job = requireJob(store, jobId);
  job.status = "completed";
  job.progress = 100;
  job.result = result;
  job.completedAt = store.now();
  return job;
}

export function failJob(store: InMemoryJobStore, jobId: string, error: string): JobRecord {
  const job = requireJob(store, jobId);
  job.attempts += 1;
  job.error = error;
  job.completedAt = store.now();
  job.status = job.attempts <= job.maxRetries ? "pending" : "failed";
  if (job.status === "pending") {
    job.startedAt = null;
  }
  return job;
}

function requireJob(store: InMemoryJobStore, jobId: string): JobRecord {
  const job = store.jobs.find((item) => item.id === jobId);
  if (!job) {
    throw new Error(`Job not found: ${jobId}`);
  }
  return job;
}
