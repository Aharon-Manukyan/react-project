import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  const { id } = await params;
  const json = (await request.json()) as { read?: boolean };
  const message = await prisma.message.update({
    where: { id },
    data: { read: Boolean(json.read) },
  });
  return NextResponse.json({ message });
}
