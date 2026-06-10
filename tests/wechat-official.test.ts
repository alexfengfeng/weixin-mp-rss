import { describe, expect, test } from "vitest";
import { normalizeWechatApiError, shouldRefreshAccessToken } from "@/server/wechat/official";

describe("wechat official api helpers", () => {
  test("converts wechat error payload to clear message", () => {
    expect(normalizeWechatApiError({ errcode: 40013, errmsg: "invalid appid" }, "获取 access_token")).toBe(
      "获取 access_token失败: invalid appid (40013)"
    );
  });

  test("refreshes access token before it expires", () => {
    const now = new Date("2026-06-09T12:00:00.000Z");

    expect(shouldRefreshAccessToken(null, null, now)).toBe(true);
    expect(shouldRefreshAccessToken("token", new Date("2026-06-09T12:03:00.000Z"), now)).toBe(true);
    expect(shouldRefreshAccessToken("token", new Date("2026-06-09T12:20:00.000Z"), now)).toBe(false);
  });
});
