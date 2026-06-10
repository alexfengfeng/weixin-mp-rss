import { readFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp"
};

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await context.params;
  const filename = parts.join("/");
  if (filename.includes("..")) return new Response("Not found", { status: 404 });

  try {
    const filePath = path.join(process.cwd(), "data", "uploads", filename);
    const bytes = await readFile(filePath);
    const contentType = CONTENT_TYPES[path.extname(filename).toLowerCase()] || "application/octet-stream";
    return new Response(bytes, { headers: { "content-type": contentType } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
