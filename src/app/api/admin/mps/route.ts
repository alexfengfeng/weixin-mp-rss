import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { createMp, listMps } from "@/server/mp/service";
import { ok, routeGuard } from "@/server/http/responses";

const CreateMpSchema = z.object({
  name: z.string().min(1),
  appId: z.string().min(1),
  appSecret: z.string().min(1),
  avatar: z.string().nullable().optional(),
  intro: z.string().nullable().optional()
});

export async function GET(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const url = new URL(request.url);
    const keyword = url.searchParams.get("kw") || "";
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || "20")));
    return ok(await listMps(keyword, page, limit));
  });
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const parsed = CreateMpSchema.parse(await request.json());
    return ok(await createMp(parsed), "订阅号已创建");
  });
}
