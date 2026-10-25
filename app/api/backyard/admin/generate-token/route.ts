import { NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = crypto.randomBytes(24).toString("hex");
    // Token expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.execute(
      "INSERT INTO admin_register_tokens (token, expires_at, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
      [token, expiresAt]
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const registerUrl = `${appUrl}/login/google?token=${token}`;

    return NextResponse.json({
      success: true,
      token,
      registerUrl,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err: any) {
    console.error("Error generating admin token:", err);
    return NextResponse.json(
      { error: "Server error: " + (err?.message || "Gagal membuat token admin.") },
      { status: 500 }
    );
  }
}
