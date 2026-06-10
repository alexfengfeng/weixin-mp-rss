import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  writingFindMany: vi.fn(),
  writingFindUnique: vi.fn(),
  writingCount: vi.fn(),
  writingUpdate: vi.fn(),
  writingDelete: vi.fn(),
  wechatFindMany: vi.fn(),
  wechatFindUnique: vi.fn(),
  wechatCount: vi.fn(),
  wechatUpdate: vi.fn(),
  wechatDelete: vi.fn()
}));

vi.mock("@/server/db/prisma", () => ({
  prisma: {
    writingStyle: {
      findMany: mocks.writingFindMany,
      findUnique: mocks.writingFindUnique,
      count: mocks.writingCount,
      update: mocks.writingUpdate,
      delete: mocks.writingDelete
    },
    wechatStyleTemplate: {
      findMany: mocks.wechatFindMany,
      findUnique: mocks.wechatFindUnique,
      count: mocks.wechatCount,
      update: mocks.wechatUpdate,
      delete: mocks.wechatDelete
    }
  }
}));

vi.mock("@/server/templates/seed", () => ({
  seedBuiltinTemplates: vi.fn(async () => undefined)
}));

import {
  deleteWechatStyleTemplate,
  deleteWritingStyle,
  resolveWechatStyleTemplate,
  resolveWritingStyle,
  updateWechatStyleTemplate,
  updateWritingStyle
} from "@/server/templates/service";

describe("template service", () => {
  beforeEach(() => {
    for (const mock of Object.values(mocks)) mock.mockReset();
  });

  test("falls back to builtin writing style when database has no active rows", async () => {
    mocks.writingFindUnique.mockResolvedValue(null);
    mocks.writingFindMany.mockResolvedValue([]);

    await expect(resolveWritingStyle("missing")).resolves.toMatchObject({
      id: "product_insight",
      prompt: expect.stringContaining("产品洞察")
    });
  });

  test("falls back to first active writing style when requested row is inactive", async () => {
    mocks.writingFindUnique.mockResolvedValue({ id: "custom-off", status: 0 });
    mocks.writingFindMany.mockResolvedValue([
      {
        id: "custom-on",
        name: "自定义",
        description: "desc",
        prompt: "自定义 Prompt",
        status: 1,
        isBuiltin: false,
        sortOrder: 2
      }
    ]);

    await expect(resolveWritingStyle("custom-off")).resolves.toMatchObject({
      id: "custom-on",
      prompt: "自定义 Prompt"
    });
  });

  test("parses database wechat template styles and falls back to clean when empty", async () => {
    mocks.wechatFindUnique.mockResolvedValue({
      id: "custom-template",
      name: "自定义模板",
      description: "desc",
      stylesJson: JSON.stringify({ h1: "font-size:30px;", p: "line-height:2;" }),
      status: 1,
      isBuiltin: false,
      sortOrder: 1
    });
    mocks.wechatFindMany.mockResolvedValue([]);

    const template = await resolveWechatStyleTemplate("custom-template");

    expect(template.id).toBe("custom-template");
    expect(template.styles.h1).toBe("font-size:30px;");
    expect(template.styles.p).toBe("line-height:2;");
    expect(template.styles.ol).toContain("padding-left");
  });

  test("does not delete the last active writing style", async () => {
    mocks.writingFindUnique.mockResolvedValue({ id: "only", status: 1 });
    mocks.writingCount.mockResolvedValue(1);

    await expect(deleteWritingStyle("only")).rejects.toThrow("至少保留一个启用的写作风格");
    expect(mocks.writingDelete).not.toHaveBeenCalled();
  });

  test("does not delete the last active wechat style template", async () => {
    mocks.wechatFindUnique.mockResolvedValue({ id: "only", status: 1 });
    mocks.wechatCount.mockResolvedValue(1);

    await expect(deleteWechatStyleTemplate("only")).rejects.toThrow("至少保留一个启用的排版模板");
    expect(mocks.wechatDelete).not.toHaveBeenCalled();
  });

  test("does not disable the last active writing style", async () => {
    mocks.writingFindUnique.mockResolvedValue({ id: "only", status: 1 });
    mocks.writingCount.mockResolvedValue(1);

    await expect(updateWritingStyle("only", { name: "Only", prompt: "Prompt", status: 0 })).rejects.toThrow(
      "至少保留一个启用的写作风格"
    );
    expect(mocks.writingUpdate).not.toHaveBeenCalled();
  });

  test("does not disable the last active wechat style template", async () => {
    mocks.wechatFindUnique.mockResolvedValue({ id: "only", status: 1 });
    mocks.wechatCount.mockResolvedValue(1);

    await expect(updateWechatStyleTemplate("only", { name: "Only", styles: {}, status: 0 })).rejects.toThrow(
      "至少保留一个启用的排版模板"
    );
    expect(mocks.wechatUpdate).not.toHaveBeenCalled();
  });
});
