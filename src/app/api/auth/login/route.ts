import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminSession, verifyAdminPassword } from "@/lib/auth";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  const since = new Date(Date.now() - WINDOW_MS);
  const failures = await prisma.loginAttempt.count({
    where: { ip, createdAt: { gte: since } },
  });
  if (failures >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте через 15 минут." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || password.length > 200 || !verifyAdminPassword(password)) {
    await prisma.loginAttempt.create({ data: { ip } });
    await new Promise((r) => setTimeout(r, 500)); // небольшая задержка
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  await prisma.loginAttempt.deleteMany({ where: { ip } });
  await createAdminSession();
  return NextResponse.json({ ok: true });
}
