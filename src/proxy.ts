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
  // Клонируем req.nextUrl - он содержит правильный proto/host
  // (Next подставляет их из Host/X-Forwarded-Host заголовков),
  // и меняем путь. NextResponse.redirect ждёт абсолютный URL,
  // а голый Location-string с относительным путём ломает Next 16
  // на этапе внутреннего парсинга → TypeError: Invalid URL.
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?from=${encodeURIComponent(req.nextUrl.pathname)}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ["/admin/:path*"],
};
