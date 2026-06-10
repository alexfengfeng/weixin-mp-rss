import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("缺少上传文件");

    const extension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) throw new Error("只支持 jpg、png、gif、webp 图片");

    const dir = path.join(process.cwd(), "data", "uploads");
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}${extension}`;
    const absolutePath = path.join(dir, filename);
    await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));

    return ok({ path: `/uploads/${filename}`, storagePath: `data/uploads/${filename}` }, "图片已上传");
  });
}
