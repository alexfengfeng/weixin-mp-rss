import { z } from "zod";
import { requireUser } from "@/server/auth/session";
import { createWritingStyle, listWritingStyles } from "@/server/templates/service";
import { ok, routeGuard } from "@/server/http/responses";

const WritingStyleSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  prompt: z.string().min(1),
  status: z.number().int().min(0).max(1).optional(),
  sortOrder: z.number().int().optional()
});

export async function GET() {
  return routeGuard(async () => {
    await requireUser();
    return ok(await listWritingStyles(false));
  });
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = WritingStyleSchema.parse(await request.json());
    return ok(await createWritingStyle(input), "写作风格已创建");
  });
}
