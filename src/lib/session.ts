import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-atelier_session" : "atelier_session";

const ISSUER = "atelier";
const AUDIENCE = "atelier-admin";
export const SESSION_TTL = 60 * 60 * 24 * 7; // 7 дней

function key() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (min 32 chars)");
  return new TextEncoder().encode(s);
}

export async function signSession(version: number) {
  return new SignJWT({ role: "admin", v: version })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(key());
}

export async function verifySession(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (payload.role !== "admin") return null;
    return { version: typeof payload.v === "number" ? payload.v : 0 };
  } catch {
    return null;
  }
}
