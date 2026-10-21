import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { checkPassword } from "./password";
import { COOKIE_NAME, SESSION_TTL, signSession, verifySession } from "./session";

async function getCredential() {
  const row = await prisma.adminCredential.findUnique({ where: { id: 1 } });
  if (row) return { hash: row.passwordHash, version: row.version };
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (!envHash) throw new Error("ADMIN_PASSWORD_HASH is not set");
  return { hash: envHash, version: 0 };
}

export async function isAdmin() {
  const session = await verifySession((await cookies()).get(COOKIE_NAME)?.value);
  if (!session) return false;
  const cred = await getCredential();
  return session.version === cred.version;
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("UNAUTHORIZED");
}

export async function createAdminSession() {
  const { version } = await getCredential();
  (await cookies()).set(COOKIE_NAME, await signSession(version), {
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

export async function verifyAdminPassword(password: string) {
  const { hash } = await getCredential();
  return checkPassword(password, hash);
}
