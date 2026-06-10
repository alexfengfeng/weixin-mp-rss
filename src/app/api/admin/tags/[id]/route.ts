import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { deleteTag, updateTag } from "@/server/tags/admin";
import { ok, routeGuard } from "@/server/http/responses";

const TagSchema = z.object({
  name: z.string().min(1),
  intro: z.string().nullable().optional(),
  cover: z.string().nullable().optional(),
  status: z.number().int().min(0).max(1).default(1),
  mpIds: z.array(z.string()).default([])
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const data = TagSchema.parse(await request.json());
    return ok(await updateTag(id, data), "标签已更新");
  });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    await deleteTag(id);
    return ok({ id }, "标签已删除");
  });
}
