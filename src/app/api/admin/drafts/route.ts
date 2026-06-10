import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { createDraftBatch, listDraftBatches } from "@/server/drafts/service";
import { ok, routeGuard } from "@/server/http/responses";

const DraftSchema = z.object({
  title: z.string().min(1),
  mpId: z.string().min(1),
  articleIds: z.array(z.string().min(1)).min(1).max(8)
});

export async function GET(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || "20")));
    return ok(await listDraftBatches(page, limit));
  });
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = DraftSchema.parse(await request.json());
    return ok(await createDraftBatch(input), "草稿批次已创建");
  });
}
