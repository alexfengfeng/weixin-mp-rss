import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/server/db/prisma";

const COOKIE_NAME = "wedraft_session";

function secretKey(): Uint8Array {
  const secret = process.env.COOKIE_SECRET || "dev-cookie-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function createSession(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function setSessionCookie(userId: string) {
  const token = await createSession(userId);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, secretKey());
    const userId = String(verified.payload.userId || "");
    if (!userId) return null;
    return prisma.user.findFirst({
      where: { id: userId, isActive: true },
      select: { id: true, username: true, role: true }
    });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
