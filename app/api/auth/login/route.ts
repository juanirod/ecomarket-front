import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminUser || !adminPassword || !jwtSecret) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { username, password } = body as { username: string; password: string };

  if (username !== adminUser || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const key = new TextEncoder().encode(jwtSecret);
  const token = await new SignJWT({ sub: adminUser })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(key);

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });

  return response;
}
