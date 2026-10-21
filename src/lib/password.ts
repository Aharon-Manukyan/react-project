import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt) as (pw: string, salt: string, len: number) => Promise<Buffer>;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

export async function checkPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) throw new Error("Invalid password hash format (expected salt:hash)");
  const actual = await scrypt(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(hash, "hex"));
}
