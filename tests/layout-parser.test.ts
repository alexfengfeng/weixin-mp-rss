import { describe, it, expect } from "vitest";
import { parseDocument } from "@/server/layout/parser/document";
import { parseFieldsBody, getField, getFieldAll } from "@/server/layout/parser/body-fields";
import { parseRowsBody } from "@/server/layout/parser/body-rows";
import { parseJsonBody } from "@/server/layout/parser/body-json";
import { matchModuleStart, isModuleEnd, scanModuleBlock } from "@/server/layout/parser/module-block";
import { builtinModuleResolver } from "@/server/layout/modules";

describe("module-block 解析", () => {
  it("匹配 :::name 起始行", () => {
    expect(matchModuleStart(":::hero")).toEqual({ name: "hero" });
    expect(matchModuleStart(":::callout tip")).toEqual({ name: "callout", variant: "tip" });
    expect(matchModuleStart(":::toc 文章目录")).toEqual({ name: "toc", title: "文章目录" });
    expect(matchModuleStart(":::callout warning 注意事项")).toEqual({
      name: "callout",
      variant: "warning",
      title: "注意事项"
    });
  });

  it("不匹配非模块行", () => {
    expect(matchModuleStart("::: Hero")).toBeNull();
    expect(matchModuleStart(":::123")).toBeNull();
    expect(matchModuleStart("普通文本")).toBeNull();
  });

  it("识别 ::: 结束行", () => {
    expect(isModuleEnd(":::")).toBe(true);
    expect(isModuleEnd("::: ")).toBe(true);
    expect(isModuleEnd(":::hero")).toBe(false);
  });

  it("扫描完整模块块", () => {
    const lines = [":::hero", "eyebrow: 标题", "title: 主标题", ":::", "普通段落"];
    const result = scanModuleBlock(lines, 0);
    expect(result).not.toBeNull();
    expect(result!.block.name).toBe("hero");
    expect(result!.block.bodyText).toBe("eyebrow: 标题\ntitle: 主标题");
    expect(result!.block.endLine).toBe(3);
    expect(result!.nextIdx).toBe(4);
  });

  it("处理未闭合模块", () => {
    const lines = [":::hero", "eyebrow: 标题"];
    const result = scanModuleBlock(lines, 0);
    expect(result).not.toBeNull();
    expect(result!.block.unclosed).toBe(true);
    expect(result!.block.endLine).toBe(-1);
    expect(result!.nextIdx).toBe(2);
  });
});

describe("body-fields 解析", () => {
  it("解析键值对", () => {
    const fields = parseFieldsBody("eyebrow: 标题\ntitle: 主标题\nsubtitle: 副标题");
    expect(fields).toHaveLength(3);
    expect(fields[0]).toEqual({ key: "eyebrow", value: "标题" });
    expect(fields[1]).toEqual({ key: "title", value: "主标题" });
  });

  it("忽略空行", () => {
    const fields = parseFieldsBody("key1: value1\n\nkey2: value2");
    expect(fields).toHaveLength(2);
  });

  it("getField 精确查找", () => {
    const fields = parseFieldsBody("title: 主标题\nTitle: 大标题");
    expect(getField(fields, "title")).toBe("主标题");
    expect(getField(fields, "title", false)).toBe("主标题");
  });

  it("getFieldAll 获取所有同名字段", () => {
    const fields = parseFieldsBody("point: 第一点\npoint: 第二点\nother: 其他");
    expect(getFieldAll(fields, "point")).toEqual(["第一点", "第二点"]);
  });
});

describe("body-rows 解析", () => {
  it("解析管道符分隔行", () => {
    const { rows } = parseRowsBody("1 | 开篇 | 为什么要做\n2 | 实践 | 怎么做");
    expect(rows).toHaveLength(2);
    expect(rows[0].cells).toEqual(["1", "开篇", "为什么要做"]);
  });

  it("带标题行", () => {
    const { title, rows } = parseRowsBody("文章目录\n1 | 开篇 | 说明", true);
    expect(title).toBe("文章目录");
    expect(rows).toHaveLength(1);
  });

  it("过滤空行", () => {
    const { rows } = parseRowsBody("1 | a | b\n\n\n2 | c | d");
    expect(rows).toHaveLength(2);
  });
});

describe("body-json 解析", () => {
  it("解析 JSON 对象", () => {
    const { json, error } = parseJsonBody('{"name":"test","value":123}');
    expect(error).toBeUndefined();
    expect(json).toEqual({ name: "test", value: 123 });
  });

  it("解析 JSON 数组", () => {
    const { json, error } = parseJsonBody('[{"a":1},{"b":2}]');
    expect(error).toBeUndefined();
    expect(json).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it("解析失败返回错误", () => {
    const { json, error } = parseJsonBody("{invalid json}");
    expect(json).toBeUndefined();
    expect(error).toBeDefined();
  });
});

describe("parseDocument 文档级解析", () => {
  it("解析纯文本", () => {
    const blocks = parseDocument("# 标题\n\n普通段落");
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("text");
  });

  it("解析纯模块", () => {
    const blocks = parseDocument(":::callout tip\n提示内容\n:::", {
      resolver: builtinModuleResolver
    });
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe("module");
    if (blocks[0].type === "module") {
      expect(blocks[0].module.name).toBe("callout");
      expect(blocks[0].module.variant).toBe("tip");
      expect(blocks[0].module.unknown).toBeFalsy();
    }
  });

  it("混合解析文本和模块", () => {
    const md = "开篇段落\n\n:::callout warning\n注意\n:::\n\n结尾段落";
    const blocks = parseDocument(md, { resolver: builtinModuleResolver });
    expect(blocks).toHaveLength(3);
    expect(blocks[0].type).toBe("text");
    expect(blocks[1].type).toBe("module");
    expect(blocks[2].type).toBe("text");
  });

  it("未注册模块标记为 unknown", () => {
    const blocks = parseDocument(":::nonexistent\n内容\n:::", {
      resolver: builtinModuleResolver
    });
    expect(blocks).toHaveLength(1);
    if (blocks[0].type === "module") {
      expect(blocks[0].module.unknown).toBe(true);
    }
  });

  it("fields 模块正确解析 body", () => {
    const blocks = parseDocument(":::hero\neyebrow: 标签\ntitle: 标题\n:::", {
      resolver: builtinModuleResolver
    });
    expect(blocks).toHaveLength(1);
    if (blocks[0].type === "module") {
      expect(blocks[0].module.body.format).toBe("fields");
      expect(blocks[0].module.body.fields).toHaveLength(2);
    }
  });

  it("rows 模块正确解析 body", () => {
    const blocks = parseDocument(":::steps\n步骤列表\n1 | 步骤一 | 说明\n2 | 步骤二 | 说明\n:::", {
      resolver: builtinModuleResolver
    });
    expect(blocks).toHaveLength(1);
    if (blocks[0].type === "module") {
      expect(blocks[0].module.body.format).toBe("rows");
      expect(blocks[0].module.body.title).toBe("步骤列表");
      expect(blocks[0].module.body.rows).toHaveLength(2);
    }
  });
});
