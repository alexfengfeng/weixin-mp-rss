import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";
import { testOfficialCredential } from "@/server/wechat/official";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await requireUser();
    const { id } = await context.params;
    const mp = await testOfficialCredential(id);
    return ok(mp, "凭证测试成功，access_token 已刷新");
  });
}
