import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { sendFeedbackMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id_response, status_feedback, feedback } = body;

    if (!id_response || !status_feedback) {
      return NextResponse.json(
        { error: "id_response dan status_feedback wajib diisi." },
        { status: 400 }
      );
    }

    if (!["diterima", "tidak_diterima"].includes(status_feedback)) {
      return NextResponse.json(
        { error: "status_feedback harus bernilai 'diterima' atau 'tidak_diterima'." },
        { status: 400 }
      );
    }

    // Ambil data responden untuk kirim email feedback
    const [rows]: any = await pool.query(
      `SELECT nama_responden, email_responden, file_output FROM responses WHERE id_response = ? LIMIT 1`,
      [id_response]
    );

    await pool.execute(
      `UPDATE responses 
       SET status_feedback = ?, feedback = ?, status = 'finalized', updated_at = NOW() 
       WHERE id_response = ?`,
      [status_feedback, feedback || null, id_response]
    );

    if (rows && rows.length > 0 && rows[0].email_responden) {
      sendFeedbackMail({
        toEmail: rows[0].email_responden,
        namaPelapor: rows[0].nama_responden || "Pemohon",
        status: status_feedback,
        feedback: feedback || "-",
        lampiranPdfRelPath: rows[0].file_output,
      }).catch((mErr) => console.error("[Mail] Error sending feedback email:", mErr));
    }

    return NextResponse.json({
      success: true,
      message: "Feedback tanggapan berhasil disimpan.",
    });
  } catch (err: any) {
    console.error("Error saving feedback:", err);
    return NextResponse.json(
      { error: "Server error: " + (err?.message || "Gagal menyimpan feedback") },
      { status: 500 }
    );
  }
}
