import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { deleteWritingStyle, updateWritingStyle } from "@/server/templates/service";
import { fail, ok, routeGuard } from "@/server/http/responses";

const WritingStyleSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  prompt: z.string().min(1),
  status: z.number().int().min(0).max(1).optional(),
  sortOrder: z.number().int().optional()
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const input = WritingStyleSchema.parse(await request.json());
    try {
      return ok(await updateWritingStyle(id, input), "写作风格已更新");
    } catch (error) {
      const message = error instanceof Error ? error.message : "写作风格更新失败";
      if (message === "至少保留一个启用的写作风格") return fail(message, 400);
      throw error;
    }
  });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    try {
      await deleteWritingStyle(id);
      return ok({ id }, "写作风格已删除");
    } catch (error) {
      const message = error instanceof Error ? error.message : "写作风格删除失败";
      if (message === "至少保留一个启用的写作风格") return fail(message, 400);
      throw error;
    }
  });
}
