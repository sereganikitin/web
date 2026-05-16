import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-only-secret-change-me-please-32chars"
);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return redirectToLogin(req);
  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest) {
  // Относительный Location, чтобы за nginx не утекал хост localhost:3002.
  const target = `/admin/login?from=${encodeURIComponent(req.nextUrl.pathname)}`;
  return new NextResponse(null, {
    status: 307,
    headers: { Location: target },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
