import { z } from "zod";
import { getBrandProfile, saveBrandProfile, type BrandProfile } from "@/server/brand/service";
import { requireUser } from "@/server/auth/session";
import { ok, routeGuard } from "@/server/http/responses";

const BrandProfileSchema = z.object({
  brandName: z.string().default(""),
  slogan: z.string().default(""),
  author: z.string().default(""),
  defaultThemeId: z.string().default("clean_newsletter"),
  defaultStyleId: z.string().default(""),
  persona: z.string().default(""),
  coverStyle: z.string().default(""),
  writingPreference: z.string().default(""),
  bannedWords: z.string().default("")
});

export async function GET() {
  return routeGuard(async () => {
    await requireUser();
    const profile = await getBrandProfile();
    return ok(profile);
  });
}

export async function POST(request: Request) {
  return routeGuard(async () => {
    await requireUser();
    const input = BrandProfileSchema.parse(await request.json());
    const profile: BrandProfile = {
      brandName: input.brandName.trim(),
      slogan: input.slogan.trim(),
      author: input.author.trim(),
      defaultThemeId: input.defaultThemeId || "clean_newsletter",
      defaultStyleId: input.defaultStyleId,
      persona: input.persona.trim(),
      coverStyle: input.coverStyle.trim(),
      writingPreference: input.writingPreference.trim(),
      bannedWords: input.bannedWords.trim()
    };
    await saveBrandProfile(profile);
    return ok(profile, "品牌档案已保存");
  });
}
