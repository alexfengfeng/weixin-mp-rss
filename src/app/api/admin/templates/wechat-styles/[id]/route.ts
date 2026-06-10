import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { deleteWechatStyleTemplate, updateWechatStyleTemplate } from "@/server/templates/service";
import { fail, ok, routeGuard } from "@/server/http/responses";

const StylesSchema = z.object({
  h1: z.string().optional(),
  h2: z.string().optional(),
  h3: z.string().optional(),
  p: z.string().optional(),
  ul: z.string().optional(),
  ol: z.string().optional(),
  li: z.string().optional(),
  hr: z.string().optional(),
  img: z.string().optional(),
  strong: z.string().optional(),
  a: z.string().optional()
});

const WechatStyleSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  styles: StylesSchema,
  status: z.number().int().min(0).max(1).optional(),
  sortOrder: z.number().int().optional()
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const input = WechatStyleSchema.parse(await request.json());
    try {
      return ok(await updateWechatStyleTemplate(id, input), "排版模板已更新");
    } catch (error) {
      const message = error instanceof Error ? error.message : "排版模板更新失败";
      if (message === "至少保留一个启用的排版模板") return fail(message, 400);
      throw error;
    }
  });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    try {
      await deleteWechatStyleTemplate(id);
      return ok({ id }, "排版模板已删除");
    } catch (error) {
      const message = error instanceof Error ? error.message : "排版模板删除失败";
      if (message === "至少保留一个启用的排版模板") return fail(message, 400);
      throw error;
    }
  });
}
