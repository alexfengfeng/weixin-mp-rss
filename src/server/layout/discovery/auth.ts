/**
 * Discovery API 鉴权
 *
 * 双轨制：Bearer token（供 Agent 用）+ JWT cookie（供浏览器/调试用）。
 */

import { getSetting } from "@/server/settings/settings";
import { getCurrentUser } from "@/server/auth/session";

export type DiscoveryAuthResult =
  | { kind: "api" }
  | { kind: "session"; user: { id: string; username: string; role: string } }
  | { kind: "unauthorized"; message: string };

/** 验证 discovery API 请求的鉴权 */
export async function requireDiscoveryAuth(request: Request): Promise<DiscoveryAuthResult> {
  // 1. 优先 Bearer token（供 Agent 用）
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7);
    const stored = await getSetting("discovery_api_token");
    if (stored && token === stored) return { kind: "api" };
    return { kind: "unauthorized", message: "Invalid API token" };
  }

  // 2. 兼容 JWT cookie（供浏览器/调试用）
  const user = await getCurrentUser();
  if (user) return { kind: "session", user };

  return { kind: "unauthorized", message: "Unauthorized" };
}

/** 检查 discovery API 是否启用 */
export async function isDiscoveryEnabled(): Promise<boolean> {
  const enabled = await getSetting("discovery_enabled", "false");
  return enabled === "true";
}
