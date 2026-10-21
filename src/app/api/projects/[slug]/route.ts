import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { projectSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) {
    return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  const { slug } = await params;
  const json = await request.json();
  const parsed = projectSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте поля", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) {
    return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
  }

  const updated = await prisma.project.update({
    where: { slug },
    data: {
      ...parsed.data,
      repoUrl: parsed.data.repoUrl === undefined ? undefined : parsed.data.repoUrl || null,
      liveUrl: parsed.data.liveUrl === undefined ? undefined : parsed.data.liveUrl || null,
    },
  });

  return NextResponse.json({ project: updated });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  const { slug } = await params;
  await prisma.project.delete({ where: { slug } });
  return NextResponse.json({ ok: true });
}
