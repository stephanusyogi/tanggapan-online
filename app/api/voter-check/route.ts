import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { searchTangmasRaw } from "@/lib/syncdata";

export async function POST(request: Request) {
  try {
    const { nik, kk } = await request.json();
    const cleanNik = String(nik || "").trim().replace(/\D/g, "");
    const cleanKk = String(kk || "").trim().replace(/\D/g, "");

    if (cleanNik.length !== 16) {
      return NextResponse.json(
        { success: false, message: "NIK harus 16 digit angka." },
        { status: 400 }
      );
    }

    // 1. Cek apakah NIK sudah pernah dilaporkan di responses_change atau responses_tms
    const [changeRows]: any = await pool.query(
      "SELECT id_response_change FROM responses_change WHERE nik = ? LIMIT 1",
      [cleanNik]
    );
    if (changeRows.length > 0) {
      return NextResponse.json({
        success: false,
        alreadyReported: true,
        message: "NIK tersebut sudah pernah dilaporkan pada formulir Ubah Data.",
      });
    }

    const [tmsRows]: any = await pool.query(
      "SELECT id_response_tms FROM responses_tms WHERE nik = ? OR history_nik = ? LIMIT 1",
      [cleanNik, cleanNik]
    );
    if (tmsRows.length > 0) {
      return NextResponse.json({
        success: false,
        alreadyReported: true,
        message: "NIK tersebut sudah pernah dilaporkan pada formulir Pemilih TMS.",
      });
    }

    // 2. Query voter dari syncdata (POST /api/v1/search/tangmas)
    const syncdataUrl =
      process.env.DATA_API_URL ||
      process.env.SYNCDATA_API_URL ||
      "https://syncdata.kpungawi.com";
    let json;
    try {
      json = await searchTangmasRaw(cleanNik, syncdataUrl, "NIK");
    } catch (err: any) {
      console.error("[api/voter-check] Error from syncdata:", err.message);
      if (err.status === 429 || err.message?.includes("Terlalu")) {
        return NextResponse.json(
          {
            success: false,
            message: err.message || "Terlalu sering melakukan pencarian. Silakan coba 1 menit lagi.",
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Gagal menghubungi server syncdata KPU." },
        { status: 502 }
      );
    }

    const record = json.records && json.records.length > 0 ? json.records[0] : null;

    if (!record) {
      return NextResponse.json({
        success: false,
        notFound: true,
        message: "Data pemilih dengan NIK tersebut tidak ditemukan di DPT KPU Ngawi.",
      });
    }

    return NextResponse.json({
      success: true,
      voter: {
        nik: cleanNik,
        nkk: cleanKk || `${cleanNik.slice(0, 6)}**********`,
        nama: record.nama || "-",
        kelamin: record.kelamin || "L",
        kecamatan: record.kecamatan || "",
        kelurahan: record.kelurahan || "",
        tps: record.tps || "",
        alamat: record.alamat_wilayah || "",
        rt: record.rt || "",
        rw: record.rw || "",
        tempat_lahir: record.tempat_lahir || "NGAWI",
        tanggal_lahir: record.tanggal_lahir || "",
        status_kawin: record.status_kawin || "B",
      },
    });
  } catch (err: any) {
    console.error("[api/voter-check] Error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada sistem." },
      { status: 500 }
    );
  }
}
