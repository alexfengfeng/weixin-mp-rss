import { prisma } from "@/server/db/prisma";

export type TagInput = {
  name: string;
  intro?: string | null;
  cover?: string | null;
  status?: number;
  mpIds?: string[];
};

function cleanNullableText(value: unknown) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

export function normalizeTagInput(input: TagInput) {
  return {
    name: input.name.trim(),
    intro: cleanNullableText(input.intro),
    cover: cleanNullableText(input.cover),
    status: input.status ?? 1,
    mpIds: Array.from(new Set((input.mpIds || []).map((id) => id.trim()).filter(Boolean)))
  };
}

export async function createTag(input: TagInput) {
  const data = normalizeTagInput(input);
  return prisma.tag.create({
    data: {
      name: data.name,
      intro: data.intro,
      cover: data.cover,
      status: data.status,
      mps: { create: data.mpIds.map((mpId) => ({ mpId })) }
    }
  });
}

export async function updateTag(id: string, input: TagInput) {
  const data = normalizeTagInput(input);
  return prisma.$transaction(async (tx) => {
    await tx.tagMp.deleteMany({ where: { tagId: id } });
    return tx.tag.update({
      where: { id },
      data: {
        name: data.name,
        intro: data.intro,
        cover: data.cover,
        status: data.status,
        mps: { create: data.mpIds.map((mpId) => ({ mpId })) }
      }
    });
  });
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({ where: { id } });
}
