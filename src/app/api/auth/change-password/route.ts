import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAdminSession, isAdmin, verifyAdminPassword } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const MIN_LEN = 12;

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const ip =
      req.headers.get("x-real-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "unknown";
    const key = `pwchange:${ip}`;

    const failures = await prisma.loginAttempt.count({
      where: { ip: key, createdAt: { gte: new Date(Date.now() - WINDOW_MS) } },
    });
    if (failures >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Слишком много попыток. Подождите 15 минут." },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => null);
    const current = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const next = typeof body?.newPassword === "string" ? body.newPassword : "";

    if (next.length < MIN_LEN || next.length > 200) {
      return NextResponse.json({ error: `Новый пароль: от ${MIN_LEN} символов` }, { status: 400 });
    }
    if (next === current) {
      return NextResponse.json({ error: "Новый пароль совпадает со старым" }, { status: 400 });
    }

    if (!current || current.length > 200 || !(await verifyAdminPassword(current))) {
      await prisma.loginAttempt.create({ data: { ip: key } });
      return NextResponse.json({ error: "Текущий пароль неверный" }, { status: 401 });
    }

    const passwordHash = await hashPassword(next);
    await prisma.adminCredential.upsert({
      where: { id: 1 },
      create: { id: 1, passwordHash, version: 1 },
      update: { passwordHash, version: { increment: 1 } },
    });

    await prisma.loginAttempt.deleteMany({ where: { ip: key } });
    await createAdminSession(); // новая cookie с новой версией, остальные сессии станут недействительны
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("change-password error", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
