import { cookies, headers } from 'next/headers';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { nanoid } from 'nanoid';
import { AuthError } from '@/lib/api/errors';

export const SESSION_COOKIE = 'aft_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type SessionPayload = JWTPayload & {
  sub: string;
  email: string;
  role: string;
  workspaceId?: string;
  sessionId: string;
};

function getSecret() {
  const secret = process.env.SESSION_SECRET || 'dev_only_change_me';
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(input: { userId: string; email: string; role: string; workspaceId?: string }) {
  return new SignJWT({ email: input.email, role: input.role, workspaceId: input.workspaceId, sessionId: nanoid(10) })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(input.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const verified = await jwtVerify(token, getSecret());
  return verified.payload as SessionPayload;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSessionFromCookies();
  if (!session) throw new AuthError();
  return session;
}

export async function getRequestContext() {
  const headerStore = await headers();
  return {
    ipAddress: headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local',
    userAgent: headerStore.get('user-agent') || 'unknown'
  };
}
