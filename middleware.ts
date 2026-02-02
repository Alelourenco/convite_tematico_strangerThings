import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin"',
    },
  });
}

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    // Sem credenciais configuradas, bloqueia por segurança.
    return unauthorized();
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return unauthorized();
  }

  const base64 = auth.slice("Basic ".length);
  let decoded = "";
  try {
    decoded = atob(base64);
  } catch {
    return unauthorized();
  }

  const [givenUser, givenPass] = decoded.split(":");
  if (givenUser !== user || givenPass !== password) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/guests/:path*"],
};
