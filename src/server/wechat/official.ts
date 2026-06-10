import { prisma } from "@/server/db/prisma";
import { decryptSecret, encryptSecret } from "@/server/crypto/secrets";

const TOKEN_REFRESH_SKEW_MS = 5 * 60 * 1000;
const WECHAT_API_BASE = "https://api.weixin.qq.com";

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  errcode?: number;
  errmsg?: string;
};

type WechatJson = {
  errcode?: number;
  errmsg?: string;
  [key: string]: unknown;
};

export function normalizeWechatApiError(json: WechatJson, context: string) {
  const code = Number(json.errcode || 0);
  if (code === 0) return "";
  return `${context}失败: ${String(json.errmsg || "微信接口返回错误")} (${code})`;
}

export function assertWechatOk(json: WechatJson, context: string) {
  const message = normalizeWechatApiError(json, context);
  if (message) throw new Error(message);
}

export function shouldRefreshAccessToken(token: string | null, expiresAt: Date | null, now = new Date()) {
  if (!token || !expiresAt) return true;
  return expiresAt.getTime() - now.getTime() <= TOKEN_REFRESH_SKEW_MS;
}

export async function getOfficialAccessToken(mpId: string, fetchImpl: typeof fetch = fetch) {
  const mp = await prisma.mpAccount.findUnique({ where: { id: mpId } });
  if (!mp) throw new Error("订阅号不存在");
  if (!shouldRefreshAccessToken(mp.accessToken, mp.accessTokenExpiresAt)) {
    return decryptSecret(mp.accessToken!);
  }

  const appSecret = decryptSecret(mp.appSecret);
  const url = new URL(`${WECHAT_API_BASE}/cgi-bin/token`);
  url.searchParams.set("grant_type", "client_credential");
  url.searchParams.set("appid", mp.appId);
  url.searchParams.set("secret", appSecret);

  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`获取 access_token失败: HTTP ${response.status}`);
  const json = await response.json() as TokenResponse;
  assertWechatOk(json, "获取 access_token");
  if (!json.access_token || !json.expires_in) throw new Error("获取 access_token失败: 微信返回缺少 access_token");

  const expiresAt = new Date(Date.now() + Math.max(json.expires_in - 300, 60) * 1000);
  await prisma.mpAccount.update({
    where: { id: mp.id },
    data: {
      accessToken: encryptSecret(json.access_token),
      accessTokenExpiresAt: expiresAt,
      lastTokenRefreshAt: new Date()
    }
  });

  return json.access_token;
}

export async function testOfficialCredential(mpId: string) {
  await getOfficialAccessToken(mpId);
  return prisma.mpAccount.findUnique({ where: { id: mpId } });
}

export async function addWechatDraft(accessToken: string, payload: unknown, fetchImpl: typeof fetch = fetch) {
  const response = await fetchImpl(`${WECHAT_API_BASE}/cgi-bin/draft/add?access_token=${encodeURIComponent(accessToken)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`新增草稿失败: HTTP ${response.status}`);
  const json = await response.json() as WechatJson;
  assertWechatOk(json, "新增草稿");
  if (!json.media_id) throw new Error("新增草稿失败: 微信返回缺少 media_id");
  return String(json.media_id);
}
