import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  buildImagePrompt,
  chooseImageSize,
  generateArticleImage,
  normalizeReferenceImage,
  parseGeneratedImage
} from "@/server/ai/images";

let tempDir = "";

afterEach(async () => {
  if (tempDir) await rm(tempDir, { recursive: true, force: true });
  tempDir = "";
});

describe("article image generation", () => {
  test("uses fixed 1536x1024 size for covers", () => {
    expect(chooseImageSize({ type: "cover", contentMarkdown: "任意内容" })).toBe("1536x1024");
  });

  test("chooses illustration size from content", () => {
    expect(chooseImageSize({ type: "illustration", contentMarkdown: "步骤\n1. 安装\n2. 配置" })).toBe("1536x1024");
    expect(chooseImageSize({ type: "illustration", contentMarkdown: "一个创始人的故事和人物场景" })).toBe("1024x1536");
    expect(chooseImageSize({ type: "illustration", contentMarkdown: "抽象概念图" })).toBe("1024x1024");
  });

  test("builds prompts with article context and image purpose", () => {
    const prompt = buildImagePrompt({
      type: "cover",
      title: "AI 发布台",
      digest: "减少发布返工",
      contentMarkdown: "# 正文",
      styleHint: "现代科技感"
    });

    expect(prompt).toContain("用途：微信公众号文章封面图");
    expect(prompt).toContain("AI 发布台");
    expect(prompt).toContain("减少发布返工");
    expect(prompt).toContain("现代科技感");
  });

  test("parses URL and base64 image responses", () => {
    expect(parseGeneratedImage({ images: ["https://example.com/a.png"] })).toEqual({ url: "https://example.com/a.png" });
    expect(parseGeneratedImage({ images: [{ url: "https://example.com/b.png" }] })).toEqual({ url: "https://example.com/b.png" });
    expect(parseGeneratedImage({ images: [{ image_url: "https://example.com/c.png" }] })).toEqual({ url: "https://example.com/c.png" });
    expect(parseGeneratedImage({ images: [{ href: "https://example.com/d.png" }] })).toEqual({ url: "https://example.com/d.png" });
    expect(parseGeneratedImage({ images: [{ b64_json: "YWJj" }] })).toEqual({ base64: "YWJj" });
    expect(() => parseGeneratedImage({ images: [] })).toThrow("图片生成失败：接口未返回图片");
  });

  test("saves generated image from remote URL", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "wedraft-images-"));
    const fetchImpl = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      if (String(url).includes("gpt-image-2-light-text-to-image")) {
        expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
        const body = JSON.parse(String(init?.body));
        expect(body.size).toBe("1536x1024");
        expect(body.background).toBe("auto");
        expect(body.moderation).toBe("auto");
        return Response.json({ images: ["https://cdn.example.com/generated.png"] });
      }
      return new Response(new Uint8Array([1, 2, 3]), {
        headers: { "content-type": "image/png" }
      });
    }) as unknown as typeof fetch;

    const result = await generateArticleImage(
      { type: "cover", title: "AI 发布台" },
      { apiKey: "test-key", uploadDir: tempDir, fetchImpl }
    );

    expect(result.path).toMatch(/^\/uploads\/.+\.png$/);
    expect(result.storagePath).toMatch(/^data\/uploads\/.+\.png$/);
    expect(await readFile(path.join(tempDir, path.basename(result.path)))).toEqual(Buffer.from([1, 2, 3]));
  });

  test("uses Highway /v3 text-to-image endpoint by default", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "wedraft-images-"));
    const requestedUrls: string[] = [];
    const fetchImpl = vi.fn(async (url: string | URL | Request) => {
      requestedUrls.push(String(url));
      if (String(url).includes("gpt-image-2-light-text-to-image")) return Response.json({ images: [{ b64_json: "AQID" }] });
      throw new Error("unexpected fetch");
    }) as unknown as typeof fetch;

    await expect(generateArticleImage(
      { type: "cover", title: "default endpoint" },
      { apiKey: "test-key", uploadDir: tempDir, fetchImpl }
    )).resolves.toMatchObject({
      path: expect.stringMatching(/^\/uploads\/.+\.png$/),
      size: "1536x1024"
    });

    expect(requestedUrls).toEqual([
      "https://api.highwayapi.ai/v3/gpt-image-2-light-text-to-image"
    ]);
  });

  test("uses edit endpoint with reference images", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "wedraft-images-"));
    const requests: Array<{ url: string; body: Record<string, unknown> }> = [];
    const fetchImpl = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      requests.push({ url: String(url), body: JSON.parse(String(init?.body)) });
      return Response.json({ images: [{ b64_json: "AQID" }] });
    }) as unknown as typeof fetch;

    await expect(generateArticleImage(
      {
        type: "illustration",
        contentMarkdown: "人物故事",
        referenceImages: ["https://cdn.example.com/ref.png"]
      },
      { apiKey: "test-key", uploadDir: tempDir, fetchImpl }
    )).resolves.toMatchObject({
      mode: "edit",
      references: ["https://cdn.example.com/ref.png"],
      size: "1024x1536"
    });

    expect(requests[0].url).toBe("https://api.highwayapi.ai/v3/gpt-image-2-light-edit");
    expect(requests[0].body.images).toEqual([{ image_url: "https://cdn.example.com/ref.png" }]);
  });

  test("converts local upload references to data URLs", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "wedraft-images-"));
    const uploadDir = path.join(tempDir, "data", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, "ref.png"), Buffer.from([1, 2, 3]));

    await expect(normalizeReferenceImage("/uploads/ref.png", uploadDir)).resolves.toMatch(/^data:image\/png;base64,/);
    await expect(normalizeReferenceImage("data/uploads/ref.png", uploadDir)).resolves.toMatch(/^data:image\/png;base64,/);
    await expect(normalizeReferenceImage("https://cdn.example.com/ref.png", uploadDir)).resolves.toBe("https://cdn.example.com/ref.png");
  });

  test("downgrades to 1024x1024 once when a large cover times out", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "wedraft-images-"));
    const requestedSizes: string[] = [];
    const fetchImpl = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      requestedSizes.push(body.size);
      if (requestedSizes.length === 1) return Response.json({ error: { message: "gateway timeout" } }, { status: 504 });
      return Response.json({ images: [{ b64_json: "AQID" }] });
    }) as unknown as typeof fetch;

    await expect(generateArticleImage(
      { type: "cover", title: "fallback size" },
      { apiKey: "test-key", uploadDir: tempDir, fetchImpl }
    )).resolves.toMatchObject({
      size: "1024x1024"
    });

    expect(requestedSizes).toEqual(["1536x1024", "1024x1024"]);
  });

  test("falls back to JieKou /v3 host when Highway keeps timing out", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "wedraft-images-"));
    const requestedUrls: string[] = [];
    const fetchImpl = vi.fn(async (url: string | URL | Request) => {
      requestedUrls.push(String(url));
      if (String(url).startsWith("https://api.highwayapi.ai/")) {
        return Response.json({ error: { message: "gateway timeout" } }, { status: 504 });
      }
      return Response.json({ images: [{ b64_json: "AQID" }] });
    }) as unknown as typeof fetch;

    await expect(generateArticleImage(
      { type: "cover", title: "fallback host" },
      { apiKey: "test-key", uploadDir: tempDir, fetchImpl }
    )).resolves.toMatchObject({
      size: "1024x1024",
      mode: "text"
    });

    expect(requestedUrls).toEqual([
      "https://api.highwayapi.ai/v3/gpt-image-2-light-text-to-image",
      "https://api.highwayapi.ai/v3/gpt-image-2-light-text-to-image",
      "https://api.jiekou.ai/v3/gpt-image-2-light-text-to-image"
    ]);
  });

  test("downgrades an illustration to 1024x1024 once when the preferred size times out", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "wedraft-images-"));
    const requestedSizes: string[] = [];
    const fetchImpl = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      requestedSizes.push(body.size);
      if (requestedSizes.length === 1) return Response.json({ error: { message: "gateway timeout" } }, { status: 504 });
      return Response.json({ images: [{ b64_json: "AQID" }] });
    }) as unknown as typeof fetch;

    await expect(generateArticleImage(
      { type: "illustration", contentMarkdown: "步骤\n1. 安装\n2. 配置" },
      { apiKey: "test-key", uploadDir: tempDir, fetchImpl }
    )).resolves.toMatchObject({
      size: "1024x1024"
    });

    expect(requestedSizes).toEqual(["1536x1024", "1024x1024"]);
  });

  test("falls back edit requests to JieKou edit endpoint after Highway timeout", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "wedraft-images-"));
    const requestedUrls: string[] = [];
    const fetchImpl = vi.fn(async (url: string | URL | Request) => {
      requestedUrls.push(String(url));
      if (String(url).startsWith("https://api.highwayapi.ai/")) {
        return Response.json({ error: { message: "gateway timeout" } }, { status: 504 });
      }
      return Response.json({ images: [{ b64_json: "AQID" }] });
    }) as unknown as typeof fetch;

    await expect(generateArticleImage(
      {
        type: "illustration",
        contentMarkdown: "人物故事",
        referenceImages: ["https://cdn.example.com/ref.png"]
      },
      { apiKey: "test-key", uploadDir: tempDir, fetchImpl }
    )).resolves.toMatchObject({
      size: "1024x1024",
      mode: "edit"
    });

    expect(requestedUrls).toEqual([
      "https://api.highwayapi.ai/v3/gpt-image-2-light-edit",
      "https://api.highwayapi.ai/v3/gpt-image-2-light-edit",
      "https://api.jiekou.ai/v3/gpt-image-2-light-edit"
    ]);
  });

  test("saves generated image from base64 response", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "wedraft-images-"));
    const fetchImpl = vi.fn(async () => Response.json({ images: [{ b64_json: Buffer.from([4, 5, 6]).toString("base64") }] })) as unknown as typeof fetch;

    const result = await generateArticleImage(
      { type: "illustration", contentMarkdown: "人物故事" },
      { apiKey: "test-key", uploadDir: tempDir, fetchImpl }
    );

    expect(result.size).toBe("1024x1536");
    expect(await readFile(path.join(tempDir, path.basename(result.path)))).toEqual(Buffer.from([4, 5, 6]));
  });

  test("normalizes provider and download errors", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "wedraft-images-"));
    const providerFail = vi.fn(async () => Response.json({ error: { message: "bad request" } }, { status: 400 })) as unknown as typeof fetch;
    await expect(generateArticleImage({ type: "cover" }, { apiKey: "test-key", uploadDir: tempDir, fetchImpl: providerFail })).rejects.toThrow(
      "图片生成失败: bad request"
    );

    const downloadFail = vi.fn(async (url: string | URL | Request) => {
      if (String(url).startsWith("http://image.local")) return new Response("no", { status: 404 });
      return Response.json({ images: ["http://image.local/a.png"] });
    }) as unknown as typeof fetch;
    await expect(generateArticleImage({ type: "cover" }, { apiKey: "test-key", uploadDir: tempDir, fetchImpl: downloadFail })).rejects.toThrow(
      "图片下载失败"
    );
  });
});
