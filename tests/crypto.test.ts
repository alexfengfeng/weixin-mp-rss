import { describe, expect, test } from "vitest";
import { decryptSecret, encryptSecret } from "@/server/crypto/secrets";

describe("secret encryption", () => {
  test("round-trips sensitive values without storing plaintext", () => {
    const encrypted = encryptSecret("cookie=value", "0123456789abcdef0123456789abcdef");

    expect(encrypted).not.toContain("cookie=value");
    expect(decryptSecret(encrypted, "0123456789abcdef0123456789abcdef")).toBe("cookie=value");
  });
});
