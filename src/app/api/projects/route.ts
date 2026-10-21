import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { projectSchema } from "@/lib/validators";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { year: "desc" }],
  });
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = projectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте поля", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await prisma.project.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return NextResponse.json({ error: "Slug уже занят" }, { status: 409 });
  }

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      repoUrl: parsed.data.repoUrl || null,
      liveUrl: parsed.data.liveUrl || null,
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
