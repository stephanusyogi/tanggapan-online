import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID admin wajib diisi." },
        { status: 400 }
      );
    }

    // Do not allow admin to delete themselves
    if (Number(id) === Number(currentAdmin.id)) {
      return NextResponse.json(
        { error: "Anda tidak dapat menghapus akun Anda sendiri." },
        { status: 400 }
      );
    }

    await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Admin berhasil dihapus.",
    });
  } catch (err: any) {
    console.error("Error deleting admin:", err);
    return NextResponse.json(
      { error: "Server error: " + (err?.message || "Gagal menghapus admin.") },
      { status: 500 }
    );
  }
}
