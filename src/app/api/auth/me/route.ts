import { getCurrentUser } from "@/server/auth/session";
import { ok } from "@/server/http/responses";

export async function GET() {
  return ok(await getCurrentUser());
}
