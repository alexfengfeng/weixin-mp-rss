import { prisma } from "@/server/db/prisma";
import { encryptSecret } from "@/server/crypto/secrets";

export async function listMps(keyword = "", page = 1, limit = 20) {
  const where = keyword ? { name: { contains: keyword } } : undefined;
  const skip = (page - 1) * limit;

  const [mps, total] = await Promise.all([
    prisma.mpAccount.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        _count: { select: { articles: true, draftBatches: true } },
        draftBatches: { orderBy: { createdAt: "desc" }, take: 1 }
      }
    }),
    prisma.mpAccount.count({ where })
  ]);

  return { items: mps, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createMp(input: {
  name: string;
  appId: string;
  appSecret: string;
  avatar?: string | null;
  intro?: string | null;
}) {
  return prisma.mpAccount.create({
    data: {
      name: input.name.trim(),
      appId: input.appId.trim(),
      appSecret: encryptSecret(input.appSecret.trim()),
      avatar: input.avatar?.trim() || null,
      intro: input.intro?.trim() || null
    }
  });
}

export async function updateMp(input: {
  id: string;
  name?: string;
  appId?: string;
  appSecret?: string | null;
  avatar?: string | null;
  intro?: string | null;
  status?: number;
}) {
  return prisma.mpAccount.update({
    where: { id: input.id },
    data: {
      name: input.name?.trim(),
      appId: input.appId?.trim(),
      appSecret: input.appSecret ? encryptSecret(input.appSecret.trim()) : undefined,
      avatar: input.avatar === undefined ? undefined : input.avatar?.trim() || null,
      intro: input.intro === undefined ? undefined : input.intro?.trim() || null,
      status: input.status
    }
  });
}

export async function deleteMp(id: string) {
  return prisma.mpAccount.delete({ where: { id } });
}
