import { readFile } from "node:fs/promises";
import path from "node:path";
import { assertWechatOk } from "@/server/wechat/official";

const WECHAT_API_BASE = "https://api.weixin.qq.com";

type WechatJson = {
  errcode?: number;
  errmsg?: string;
  [key: string]: unknown;
};

export async function uploadPermanentImage(accessToken: string, filePath: string, fetchImpl: typeof fetch = fetch) {
  const form = await fileFormData(filePath);
  const url = `${WECHAT_API_BASE}/cgi-bin/material/add_material?access_token=${encodeURIComponent(accessToken)}&type=image`;
  const response = await fetchImpl(url, { method: "POST", body: form });
  if (!response.ok) throw new Error(`上传封面素材失败: HTTP ${response.status}`);
  const json = await response.json() as WechatJson;
  assertWechatOk(json, "上传封面素材");
  if (!json.media_id) throw new Error("上传封面素材失败: 微信返回缺少 media_id");
  return String(json.media_id);
}

export async function uploadArticleImage(accessToken: string, filePath: string, fetchImpl: typeof fetch = fetch) {
  const form = await fileFormData(filePath);
  const url = `${WECHAT_API_BASE}/cgi-bin/media/uploadimg?access_token=${encodeURIComponent(accessToken)}`;
  const response = await fetchImpl(url, { method: "POST", body: form });
  if (!response.ok) throw new Error(`上传正文图片失败: HTTP ${response.status}`);
  const json = await response.json() as WechatJson;
  assertWechatOk(json, "上传正文图片");
  if (!json.url) throw new Error("上传正文图片失败: 微信返回缺少 url");
  return String(json.url);
}

async function fileFormData(filePath: string) {
  const absolutePath = toAbsoluteUploadPath(filePath);
  const bytes = await readFile(absolutePath);
  const form = new FormData();
  form.set("media", new Blob([bytes]), path.basename(absolutePath));
  return form;
}

export function toAbsoluteUploadPath(filePath: string) {
  if (filePath.startsWith("/uploads/")) {
    return path.join(/* turbopackIgnore: true */ process.cwd(), "data", filePath.replace(/^\/+/, ""));
  }
  if (filePath.startsWith("data/uploads/")) {
    return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "uploads", filePath.replace(/^data\/uploads\//, ""));
  }
  if (path.isAbsolute(filePath)) return filePath;
  const normalized = filePath.replace(/^\/+/, "");
  return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "uploads", path.basename(normalized));
}
