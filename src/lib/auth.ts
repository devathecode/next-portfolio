import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "adm_sess";

function getSecret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET!);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

/**
 * Server Actions are dispatched globally by an ID in the `Next-Action` header,
 * not scoped to the page path they're defined under — so middleware's
 * `/admin/:path*` matcher does NOT protect them. Every admin Server Action
 * must call this itself.
 */
export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = token ? await verifySessionToken(token) : null;
  if (!payload) {
    redirect("/admin/login");
  }
  return payload;
}
