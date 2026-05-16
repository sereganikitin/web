import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  await clearSessionCookie();
  // Относительный Location, чтобы не зависеть от того,
  // какой Host видит Next.js за nginx (req.url был localhost:3002).
  return new NextResponse(null, {
    status: 303,
    headers: { Location: "/admin/login" },
  });
}
