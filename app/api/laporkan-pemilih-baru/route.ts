import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import pool from "@/lib/db";
import { getActiveTahapan } from "@/lib/syncdata";
import { saveUploadedFile, saveBase64Signature } from "@/lib/upload";
import { sendPengajuanTerkirimMail, sendTanggapanMasukAdminMail } from "@/lib/mail";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Verifikasi CAPTCHA Turnstile
    const turnstileToken = String(
      formData.get("cf-turnstile-response") ||
      formData.get("turnstileToken") ||
      ""
    );
    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

    const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            turnstileResult.message ||
            "Verifikasi keamanan (CAPTCHA) gagal atau belum diselesaikan.",
        },
        { status: 403 }
      );
    }

    // Data Pemilih Baru
    const name = String(formData.get("name") || "").trim().toUpperCase();
    const kk = String(formData.get("kk") || "").trim().replace(/\D/g, "");
    const nik = String(formData.get("nik") || "").trim().replace(/\D/g, "");
    const placeOfBirth = String(formData.get("place_of_birth") || "").trim().toUpperCase();
    const dateOfBirth = String(formData.get("date_of_birth") || "").trim();
    const maritalStatus = String(formData.get("marital_status") || "").trim();
    const gender = String(formData.get("gender") || "").trim();
    const address = String(formData.get("address") || "").trim().toUpperCase();
    const rt = String(formData.get("rt") || "").trim();
    const rw = String(formData.get("rw") || "").trim();
    const kecamatan = String(formData.get("kecamatan") || "").trim().toUpperCase();
    const kelurahan = String(formData.get("kelurahan") || "").trim().toUpperCase();

    // Files
    const kkFile = formData.get("kk_file") as File | null;
    const ktpFile = formData.get("ktp_file") as File | null;
    const buktiLain = formData.get("bukti_lain") as File | null;

    // Data Pelapor
    const responderName = String(formData.get("responder_name") || "").trim().toUpperCase();
    const responderNik = String(formData.get("responder_nik") || "").trim().replace(/\D/g, "");
    const responderAddress = String(formData.get("responder_address") || "").trim().toUpperCase();
    const responderContact = String(formData.get("responder_contact") || "").trim().replace(/\D/g, "");
    const responderEmail = String(formData.get("responder_email") || "").trim().toLowerCase();
    const ktpPelapor = formData.get("ktp_pelapor") as File | null;
    const signatureData = String(formData.get("signature_data") || "").trim();

    // Validasi basic
    if (!name || nik.length !== 16 || kk.length !== 16) {
      return NextResponse.json(
        { success: false, message: "Nama, NIK (16 digit), dan No. KK (16 digit) wajib diisi lengkap." },
        { status: 400 }
      );
    }
    if (!dateOfBirth || !kecamatan || !kelurahan || !address) {
      return NextResponse.json(
        { success: false, message: "Tanggal lahir, alamat, kecamatan, dan kelurahan wajib diisi." },
        { status: 400 }
      );
    }
    if (!responderName || responderNik.length !== 16 || !responderContact || !responderEmail) {
      return NextResponse.json(
        { success: false, message: "Data pelapor (Nama, NIK, WhatsApp, Email) wajib diisi lengkap." },
        { status: 400 }
      );
    }
    if (!kkFile || !ktpFile || !ktpPelapor) {
      return NextResponse.json(
        { success: false, message: "File KK, File KTP Pemilih, dan File KTP Pelapor wajib diunggah." },
        { status: 400 }
      );
    }
    if (!signatureData) {
      return NextResponse.json(
        { success: false, message: "Tanda tangan digital pelapor wajib dibubuhkan." },
        { status: 400 }
      );
    }

    // Ambil Tahapan Aktif dari SyncData
    const activeTahapan = await getActiveTahapan();

    // Simpan file
    const ktpPelaporPath = await saveUploadedFile(ktpPelapor, "upload/ktp_pelapor");
    const signaturePath = await saveBase64Signature(signatureData);
    const kkFilePath = await saveUploadedFile(kkFile, "upload/response_new");
    const ktpFilePath = await saveUploadedFile(ktpFile, "upload/response_new");
    let buktiLainPath: string | null = null;
    if (buktiLain && buktiLain.size > 0) {
      buktiLainPath = await saveUploadedFile(buktiLain, "upload/response_new");
    }

    // Mapping Status Kawin & Gender
    let statusKawinDb = "B";
    if (maritalStatus === "sudah_nikah" || maritalStatus === "S") statusKawinDb = "S";
    else if (maritalStatus === "pernah_nikah" || maritalStatus === "P") statusKawinDb = "P";

    const genderDb = gender === "perempuan" || gender === "P" ? "P" : "L";

    // UUIDs
    const idResponse = uuidv4();
    const idResponseNew = uuidv4();
    const idEvidence = uuidv4();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert responses
      await connection.query(
        `INSERT INTO responses (
          id_response, tahapan, alasan_tanggapan, nik_responden, nama_responden,
          nomor_responden, email_responden, alamat_responden, file_scan_ktp_responden,
          file_ttd_responden, status, created_at, updated_at
        ) VALUES (?, ?, 'baru', ?, ?, ?, ?, ?, ?, ?, 'ongoing', NOW(), NOW())`,
        [
          idResponse,
          activeTahapan,
          responderNik,
          responderName,
          responderContact,
          responderEmail,
          responderAddress,
          ktpPelaporPath,
          signaturePath,
        ]
      );

      // Insert responses_new
      await connection.query(
        `INSERT INTO responses_new (
          id_response_new, id_response, nama_pemilih, no_kk, nik,
          tempat_lahir, tanggal_lahir, status_kawin, jenis_kelamin,
          alamat, rt, rw, kelurahan, kecamatan, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          idResponseNew,
          idResponse,
          name,
          kk,
          nik,
          placeOfBirth,
          dateOfBirth,
          statusKawinDb,
          genderDb,
          address,
          rt,
          rw,
          kelurahan,
          kecamatan,
        ]
      );

      // Insert supporting_evidences
      await connection.query(
        `INSERT INTO supporting_evidences (
          id_evidence, id_response, file_scan_ktp, file_scan_kk, file_scan_lain, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [idEvidence, idResponse, ktpFilePath, kkFilePath, buktiLainPath]
      );

      await connection.commit();

      // Kirim Notifikasi Email Asynchronous (tanpa memblokir respon client)
      sendPengajuanTerkirimMail({
        toEmail: responderEmail,
        namaPelapor: responderName,
      }).catch((mErr) => console.error("[Mail] Error sending pengajuan mail:", mErr));

      sendTanggapanMasukAdminMail({
        jenis: "baru",
        idResponse,
        namaPelapor: responderName,
        nikPelapor: responderNik,
        kontakPelapor: responderContact,
        namaPemilih: name,
        nikPemilih: nik,
      }).catch((mErr) => console.error("[Mail] Error sending admin notification:", mErr));

      return NextResponse.json({
        success: true,
        message: "Laporan Pemilih Baru berhasil disimpan.",
        id_response: idResponse,
      });
    } catch (dbErr: any) {
      await connection.rollback();
      throw dbErr;
    } finally {
      connection.release();
    }
  } catch (err: any) {
    console.error("[api/laporkan-pemilih-baru] Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Gagal menyimpan laporan pemilih baru." },
      { status: 500 }
    );
  }
}
