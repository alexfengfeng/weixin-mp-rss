import { prisma } from "../src/server/db/prisma";
import { hashPassword } from "../src/server/auth/password";
import { seedDefaultSettings } from "../src/server/settings/settings";

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin@123";

  await seedDefaultSettings();

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    await prisma.user.update({
      where: { username },
      data: { role: "admin", isActive: true }
    });
    console.log(`Admin user already exists: ${username}`);
    return;
  }

  await prisma.user.create({
    data: {
      username,
      passwordHash: await hashPassword(password),
      role: "admin",
      isActive: true
    }
  });
  console.log(`Admin user created: ${username}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
