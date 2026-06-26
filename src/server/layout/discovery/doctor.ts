/**
 * 配置体检（doctor）
 */

import { getSetting } from "@/server/settings/settings";

export interface DoctorResult {
  status: "ok" | "warning" | "error";
  checks: Array<{ key: string; ok: boolean; message: string }>;
}

export async function runDoctor(): Promise<DoctorResult> {
  const checks: DoctorResult["checks"] = [];

  // discovery 是否启用
  const discoveryEnabled = await getSetting("discovery_enabled", "false");
  checks.push({
    key: "discovery_enabled",
    ok: discoveryEnabled === "true",
    message: discoveryEnabled === "true" ? "Discovery API 已启用" : "Discovery API 未启用（默认关闭）"
  });

  // API token 是否配置
  const token = await getSetting("discovery_api_token");
  checks.push({
    key: "api_token",
    ok: !!token,
    message: token ? "API token 已配置" : "API token 未配置（Agent 无法通过 Bearer token 访问）"
  });

  const hasError = checks.some((c) => !c.ok && c.key === "api_token" && false); // token 缺失不算 error
  const hasWarning = checks.some((c) => !c.ok);

  return {
    status: hasError ? "error" : hasWarning ? "warning" : "ok",
    checks
  };
}
