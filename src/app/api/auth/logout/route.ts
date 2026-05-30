import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  await clearSessionCookie();
  // Конструируем абсолютный URL из исходного req.url — Next 16
  // не принимает голый Location-string с относительным путём
  // (TypeError: Invalid URL внутри его рантайма).
  const url = new URL("/admin/login", req.url);
  return NextResponse.redirect(url, 303);
}
