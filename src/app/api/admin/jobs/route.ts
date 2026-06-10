import { prisma } from "@/server/db/prisma";
import { requireUser } from "@/server/auth/session";
import { routeGuard } from "@/server/http/responses";

export async function GET() {
  return routeGuard(async () => {
    await requireUser();
    return prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { logs: { orderBy: { createdAt: "desc" }, take: 5 } }
    });
  });
}
