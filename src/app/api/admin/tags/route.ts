import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { requireUser } from "@/server/auth/session";
import { createTag } from "@/server/tags/admin";
import { ok, routeGuard } from "@/server/http/responses";

const TagSchema = z.object({
  name: z.string().min(1),
  intro: z.string().optional(),
  cover: z.string().optional(),
  status: z.number().int().min(0).max(1).default(1),
  mpIds: z.array(z.string()).default([])
});

export async function GET() {
  return routeGuard(async () => {
    await requireUser();
    return prisma.tag.findMany({
      orderBy: { createdAt: "desc" },
      include: { mps: { include: { mp: true } } }
    });
  });
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const data = TagSchema.parse(await request.json());
    const tag = await createTag(data);
    return ok(tag);
  });
}
