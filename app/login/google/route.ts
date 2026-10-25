import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const registerToken = url.searchParams.get("token");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:3000/oauth/google/callback/";

  if (!clientId) {
    return NextResponse.json(
      {
        error: "google_client_id_missing",
        message:
          "GOOGLE_CLIENT_ID belum diisi di .env.local. Silakan isi terlebih dahulu.",
      },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(16).toString("hex");
  const cookieStore = await cookies();

  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  if (registerToken) {
    cookieStore.set("admin_register_token", registerToken.trim(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });
  } else {
    cookieStore.delete("admin_register_token");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(googleAuthUrl);
}
