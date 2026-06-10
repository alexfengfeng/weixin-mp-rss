import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { createWechatStyleTemplate, listWechatStyleTemplates } from "@/server/templates/service";
import { ok, routeGuard } from "@/server/http/responses";

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

export async function GET() {
  return routeGuard(async () => {
    await requireUser();
    return ok(await listWechatStyleTemplates(false));
  });
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = WechatStyleSchema.parse(await request.json());
    return ok(await createWechatStyleTemplate(input), "排版模板已创建");
  });
}
