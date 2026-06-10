import { prisma } from "@/server/db/prisma";

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? fallback;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
}

export async function seedDefaultSettings() {
  const defaults: Record<string, string> = {
    siteName: "WeDraft",
    editorMode: "markdown"
  };

  for (const [key, value] of Object.entries(defaults)) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value }
    });
  }
}
