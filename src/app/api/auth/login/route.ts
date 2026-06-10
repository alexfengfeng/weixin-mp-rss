import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { verifyPassword } from "@/server/auth/password";
import { setSessionCookie } from "@/server/auth/session";
import { fail, ok } from "@/server/http/responses";

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const parsed = LoginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("请输入用户名和密码", 400);

  const user = await prisma.user.findUnique({ where: { username: parsed.data.username } });
  if (!user || !user.isActive) return fail("用户名或密码错误", 401);

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) return fail("用户名或密码错误", 401);

  await setSessionCookie(user.id);
  return ok({ username: user.username, role: user.role });
}
