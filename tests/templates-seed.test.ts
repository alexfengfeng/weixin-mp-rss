import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  writingUpsert: vi.fn(),
  writingDeleteMany: vi.fn(),
  wechatUpsert: vi.fn()
  ,
  wechatDeleteMany: vi.fn()
}));

vi.mock("@/server/db/prisma", () => ({
  prisma: {
    writingStyle: {
      upsert: mocks.writingUpsert
      ,
      deleteMany: mocks.writingDeleteMany
    },
    wechatStyleTemplate: {
      upsert: mocks.wechatUpsert
      ,
      deleteMany: mocks.wechatDeleteMany
    }
  }
}));

import { WRITING_STYLE_PRESETS } from "@/lib/presets";
import { BUILTIN_THEMES } from "@/server/layout/themes";
import { seedBuiltinTemplates } from "@/server/templates/seed";

describe("builtin template seed", () => {
  beforeEach(() => {
    mocks.writingUpsert.mockReset();
    mocks.wechatUpsert.mockReset();
  });

  test("upserts all builtin writing styles with updated prompts", async () => {
    await seedBuiltinTemplates({ force: true });

    expect(mocks.writingUpsert).toHaveBeenCalledTimes(WRITING_STYLE_PRESETS.length);
    expect(mocks.writingUpsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "product_insight" },
      update: expect.objectContaining({
        isBuiltin: true,
        prompt: expect.stringContaining("产品")
      })
    }));
    expect(mocks.writingDeleteMany).toHaveBeenCalledWith({
      where: {
        isBuiltin: true,
        id: { notIn: WRITING_STYLE_PRESETS.map((preset) => preset.id) }
      }
    });
  });

  test("upserts all builtin wechat style templates with updated styles", async () => {
    await seedBuiltinTemplates({ force: true });

    expect(mocks.wechatUpsert).toHaveBeenCalledTimes(BUILTIN_THEMES.length);
    expect(mocks.wechatUpsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "bold_review" },
      update: expect.objectContaining({
        isBuiltin: true,
        stylesJson: expect.stringContaining("font-size")
      })
    }));
    expect(mocks.wechatDeleteMany).toHaveBeenCalledWith({
      where: {
        isBuiltin: true,
        id: { notIn: BUILTIN_THEMES.map((theme) => theme.id) }
      }
    });
  });
});
