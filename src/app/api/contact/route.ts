import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте форму", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const message = await prisma.message.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      body: parsed.data.body,
    },
  });

  return NextResponse.json({ id: message.id }, { status: 201 });
}
