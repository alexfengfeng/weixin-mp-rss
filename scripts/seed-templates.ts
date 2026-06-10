import { prisma } from "@/server/db/prisma";
import { seedBuiltinTemplates } from "@/server/templates/seed";
import { listWechatStyleTemplates, listWritingStyles } from "@/server/templates/service";

async function main() {
  await seedBuiltinTemplates({ force: true });
  const [writingStyles, wechatTemplates] = await Promise.all([
    listWritingStyles(false),
    listWechatStyleTemplates(false)
  ]);

  console.log(JSON.stringify({
    writingStyles: writingStyles.length,
    builtinWritingStyles: writingStyles.filter((item) => item.isBuiltin).length,
    wechatTemplates: wechatTemplates.length,
    builtinWechatTemplates: wechatTemplates.filter((item) => item.isBuiltin).length
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
