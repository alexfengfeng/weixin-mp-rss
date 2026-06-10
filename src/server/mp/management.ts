export function normalizeWechatErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error || "微信接口调用失败");
}
