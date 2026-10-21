import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySession } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const session = await verifySession(req.cookies.get(COOKIE_NAME)?.value);
  if (!session) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
