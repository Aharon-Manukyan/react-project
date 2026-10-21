import "server-only";
import { cookies } from "next/headers";
import { scryptSync, timingSafeEqual } from "crypto";
import { COOKIE_NAME, SESSION_TTL, signSession, verifySession } from "./session";

export async function isAdmin() {
  return verifySession((await cookies()).get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("UNAUTHORIZED");
}

export async function createAdminSession() {
  (await cookies()).set(COOKIE_NAME, await signSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export function verifyAdminPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH; // формат "salt:hash" (hex)
  if (!stored) throw new Error("ADMIN_PASSWORD_HASH is not set");
  const [salt, hash] = stored.split(":");
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(hash, "hex")); // длины всегда равны (64)
}
