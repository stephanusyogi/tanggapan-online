import crypto from "crypto";
import { cookies } from "next/headers";
import pool from "./db";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  google_id: string | null;
}

export interface SessionPayload {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  exp: number; // timestamp in seconds
}

const COOKIE_NAME = "tangmas_admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

function getSecretKey(): string {
  return (
    process.env.AUTH_SESSION_SECRET ||
    "fallback_secret_tangmas_kpu_ngawi_super_secure_key_2026"
  );
}

/**
 * Sign payload with HMAC-SHA256
 */
export function signSession(payload: SessionPayload): string {
  const secret = getSecretKey();
  const jsonStr = JSON.stringify(payload);
  const dataB64 = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(dataB64)
    .digest("base64url");
  return `${dataB64}.${signature}`;
}

/**
 * Verify and parse HMAC-SHA256 signed session token
 */
export function verifySession(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [dataB64, signature] = parts;
    const secret = getSecretKey();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(dataB64)
      .digest("base64url");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(dataB64, "base64url").toString("utf-8")
    );

    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Set session cookie in Next.js Server Action / Route Handler
 */
export async function setAdminSession(user: AdminUser) {
  const cookieStore = await cookies();
  const exp = Math.floor(Date.now() / 1000) + SESSION_DURATION;
  const payload: SessionPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    exp,
  };

  const token = signSession(payload);

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Get currently authenticated admin user
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifySession(token);
    if (!payload) return null;

    // Verify user still exists in database
    const [rows]: any = await pool.execute(
      "SELECT id, name, email, avatar, google_id FROM users WHERE id = ? LIMIT 1",
      [payload.id]
    );

    if (!rows || rows.length === 0) return null;

    return {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      avatar: rows[0].avatar,
      google_id: rows[0].google_id,
    };
  } catch (err: any) {
    if (
      err?.digest === "DYNAMIC_SERVER_USAGE" ||
      err?.message?.includes("Dynamic server usage")
    ) {
      throw err;
    }
    console.error("Error in getCurrentAdmin:", err);
    return null;
  }
}
