import path from "node:path";
import { describe, expect, test } from "vitest";
import { toAbsoluteUploadPath } from "@/server/wechat/media";

describe("wechat media upload paths", () => {
  test("maps app upload URLs to local upload files", () => {
    expect(toAbsoluteUploadPath("/uploads/a.jpg")).toBe(path.join(process.cwd(), "data", "uploads", "a.jpg"));
  });

  test("maps data upload paths to local upload files", () => {
    expect(toAbsoluteUploadPath("data/uploads/a.jpg")).toBe(path.join(process.cwd(), "data", "uploads", "a.jpg"));
  });

  test("keeps real absolute file paths unchanged", () => {
    const absolutePath = path.resolve("/tmp/a.jpg");

    expect(toAbsoluteUploadPath(absolutePath)).toBe(absolutePath);
  });
});
