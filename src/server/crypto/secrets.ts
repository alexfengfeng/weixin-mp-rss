import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;

function normalizeKey(key: string): Buffer {
  return createHash("sha256").update(key).digest();
}

export function encryptSecret(value: string, key = process.env.ENCRYPTION_KEY || "dev-only-change-me"): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, normalizeKey(key), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return ["v1", iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptSecret(payload: string, key = process.env.ENCRYPTION_KEY || "dev-only-change-me"): string {
  const [version, ivText, tagText, encryptedText] = payload.split(".");
  if (version !== "v1" || !ivText || !tagText || !encryptedText) {
    throw new Error("Invalid encrypted secret payload");
  }

  const decipher = createDecipheriv(ALGORITHM, normalizeKey(key), Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64url")),
    decipher.final()
  ]).toString("utf8");
}
