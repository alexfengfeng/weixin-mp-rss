import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { deleteMp, updateMp } from "@/server/mp/service";
import { ok, routeGuard } from "@/server/http/responses";

const UpdateMpSchema = z.object({
  name: z.string().min(1).optional(),
  appId: z.string().min(1).optional(),
  appSecret: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  intro: z.string().nullable().optional(),
  status: z.number().int().min(0).max(1).optional()
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const data = UpdateMpSchema.parse(await request.json());
    return ok(await updateMp({ id, ...data }), "订阅号已更新");
  });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    await deleteMp(id);
    return ok({ id }, "订阅号已删除");
  });
}
