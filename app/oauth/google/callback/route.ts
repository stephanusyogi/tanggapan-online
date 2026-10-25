import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { setAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(
      `${appUrl}/?auth_error=${encodeURIComponent(
        error || "Gagal mengautentikasi dengan akun Google."
      )}`
    );
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  // Optional CSRF check
  if (savedState && state && savedState !== state) {
    return NextResponse.redirect(
      `${appUrl}/?auth_error=${encodeURIComponent("State mismatch / CSRF error.")}`
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:3000/oauth/google/callback/";

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${appUrl}/?auth_error=${encodeURIComponent(
        "Konfigurasi GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET belum lengkap di .env.local."
      )}`
    );
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error("Google token exchange error:", errBody);
      return NextResponse.redirect(
        `${appUrl}/?auth_error=${encodeURIComponent(
          "Gagal menukarkan kode otorisasi dengan token Google."
        )}`
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user profile from Google
    const userinfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!userinfoRes.ok) {
      return NextResponse.redirect(
        `${appUrl}/?auth_error=${encodeURIComponent(
          "Gagal mengambil informasi profil dari akun Google Anda."
        )}`
      );
    }

    const googleUser = await userinfoRes.json();
    const { id: googleId, email, name, picture: avatar } = googleUser;

    if (!email) {
      return NextResponse.redirect(
        `${appUrl}/?auth_error=${encodeURIComponent(
          "Akun Google tidak memiliki alamat email publik."
        )}`
      );
    }

    // 3. Check for Admin Register Token (invitation flow)
    const adminRegisterToken = cookieStore.get("admin_register_token")?.value;
    cookieStore.delete("admin_register_token");

    if (adminRegisterToken) {
      const [tokenRows]: any = await pool.execute(
        "SELECT id, token, expires_at FROM admin_register_tokens WHERE token = ? AND expires_at > NOW() LIMIT 1",
        [adminRegisterToken]
      );

      if (!tokenRows || tokenRows.length === 0) {
        return NextResponse.redirect(
          `${appUrl}/?auth_error=${encodeURIComponent(
            "Token registrasi admin tidak valid atau sudah kadaluarsa."
          )}`
        );
      }

      // Check if user already exists
      const [existingUsers]: any = await pool.execute(
        "SELECT id, name, email, avatar, google_id FROM users WHERE email = ? LIMIT 1",
        [email.toLowerCase()]
      );

      let userId: number;
      if (existingUsers && existingUsers.length > 0) {
        userId = existingUsers[0].id;
        await pool.execute(
          "UPDATE users SET google_id = ?, avatar = ?, name = ? WHERE id = ?",
          [googleId, avatar, name, userId]
        );
      } else {
        const [insertResult]: any = await pool.execute(
          "INSERT INTO users (name, email, google_id, avatar, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
          [name, email.toLowerCase(), googleId, avatar]
        );
        userId = insertResult.insertId;
      }

      // Delete used registration token
      await pool.execute(
        "DELETE FROM admin_register_tokens WHERE token = ?",
        [adminRegisterToken]
      );

      await setAdminSession({
        id: userId,
        name,
        email: email.toLowerCase(),
        avatar,
        google_id: googleId,
      });

      return NextResponse.redirect(`${appUrl}/backyard`);
    }

    // 4. Normal Admin Login: Verify email exists in `users` table
    const [users]: any = await pool.execute(
      "SELECT id, name, email, avatar, google_id FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase()]
    );

    if (!users || users.length === 0) {
      return NextResponse.redirect(
        `${appUrl}/?auth_error=${encodeURIComponent(
          `Akses Ditolak. Email (${email}) belum terdaftar sebagai administrator Tangmas KPU Ngawi.`
        )}`
      );
    }

    const user = users[0];

    // Update avatar and google_id if changed
    await pool.execute(
      "UPDATE users SET google_id = ?, avatar = COALESCE(?, avatar) WHERE id = ?",
      [googleId, avatar, user.id]
    );

    await setAdminSession({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: avatar || user.avatar,
      google_id: googleId,
    });

    return NextResponse.redirect(`${appUrl}/backyard`);
  } catch (err: any) {
    console.error("Unhandled OAuth error:", err);
    return NextResponse.redirect(
      `${appUrl}/?auth_error=${encodeURIComponent(
        `Terjadi kendala autentikasi: ${err?.message || "Server Error"}`
      )}`
    );
  }
}
