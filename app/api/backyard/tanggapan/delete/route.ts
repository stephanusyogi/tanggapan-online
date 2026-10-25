import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id_response } = body;

    if (!id_response) {
      return NextResponse.json(
        { error: "id_response wajib diisi." },
        { status: 400 }
      );
    }

    // ON DELETE CASCADE will automatically delete child rows in responses_new, responses_change, responses_tms, supporting_evidences
    await pool.execute("DELETE FROM responses WHERE id_response = ?", [
      id_response,
    ]);

    return NextResponse.json({
      success: true,
      message: "Data tanggapan berhasil dihapus.",
    });
  } catch (err: any) {
    console.error("Error deleting response:", err);
    return NextResponse.json(
      { error: "Server error: " + (err?.message || "Gagal menghapus data") },
      { status: 500 }
    );
  }
}
