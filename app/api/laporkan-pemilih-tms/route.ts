import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import pool from "@/lib/db";
import { getActiveTahapan } from "@/lib/syncdata";
import { saveUploadedFile, saveBase64Signature } from "@/lib/upload";
import { sendPengajuanTerkirimMail, sendTanggapanMasukAdminMail } from "@/lib/mail";

const TMS_CATEGORY_MAP: Record<string, string> = {
  MENINGGAL: "MENINGGAL (1)",
  "MENINGGAL (1)": "MENINGGAL (1)",
  GANDA: "GANDA (2)",
  "GANDA (2)": "GANDA (2)",
  "DI BAWAH UMUR": "DI BAWAH UMUR (3)",
  "DI BAWAH UMUR (3)": "DI BAWAH UMUR (3)",
  "PINDAH DOMISILI": "PINDAH DOMISILI (4)",
  "PINDAH DOMISILI (4)": "PINDAH DOMISILI (4)",
  WNA: "WNA (5)",
  "WNA (5)": "WNA (5)",
  TNI: "TNI (6)",
  "TNI (6)": "TNI (6)",
  POLRI: "POLRI (7)",
  "POLRI (7)": "POLRI (7)",
  "HAK POLITIK DICABUT": "HAK POLITIK DICABUT (8)",
  "HAK POLITIK DICABUT (8)": "HAK POLITIK DICABUT (8)",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Data Asli Pemilih
    const originalNik = String(formData.get("original_nik") || "").trim().replace(/\D/g, "");
    const originalNkk = String(formData.get("original_nkk") || "").trim().replace(/\D/g, "");
    const originalNama = String(formData.get("original_nama") || "").trim().toUpperCase();
    const originalTempatLahir = String(formData.get("original_tempat_lahir") || "").trim().toUpperCase();
    const originalTanggalLahir = String(formData.get("original_tanggal_lahir") || "").trim();
    const originalAlamat = String(formData.get("original_alamat") || "").trim().toUpperCase();
    const originalRt = String(formData.get("original_rt") || "").trim();
    const originalRw = String(formData.get("original_rw") || "").trim();
    const originalKelurahan = String(formData.get("original_kelurahan") || "").trim().toUpperCase();
    const originalKecamatan = String(formData.get("original_kecamatan") || "").trim().toUpperCase();
    const originalStatusKawin = String(formData.get("original_status_kawin") || "").trim();
    const originalJenisKelamin = String(formData.get("original_jenis_kelamin") || "").trim();

    // Alasan TMS
    const rawAlasan = String(formData.get("alasan_tidak_memenuhi_syarat") || "").trim().toUpperCase();
    const kategoriTms = TMS_CATEGORY_MAP[rawAlasan] || "MENINGGAL (1)";

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
    if (!originalNik || originalNik.length !== 16) {
      return NextResponse.json(
        { success: false, message: "NIK asli pemilih harus 16 digit angka." },
        { status: 400 }
      );
    }
    if (!rawAlasan) {
      return NextResponse.json(
        { success: false, message: "Alasan Tidak Memenuhi Syarat (TMS) wajib dipilih." },
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
    const kkFilePath = await saveUploadedFile(kkFile, "upload/response_tms");
    const ktpFilePath = await saveUploadedFile(ktpFile, "upload/response_tms");
    let buktiLainPath: string | null = null;
    if (buktiLain && buktiLain.size > 0) {
      buktiLainPath = await saveUploadedFile(buktiLain, "upload/response_tms");
    }

    // Mapping Status Kawin & Gender
    let statusKawinDb = "B";
    if (originalStatusKawin === "S" || originalStatusKawin === "sudah_nikah") statusKawinDb = "S";
    else if (originalStatusKawin === "P" || originalStatusKawin === "pernah_nikah") statusKawinDb = "P";

    const genderDb = originalJenisKelamin === "P" || originalJenisKelamin === "perempuan" ? "P" : "L";

    // UUIDs
    const idResponse = uuidv4();
    const idResponseTms = uuidv4();
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
        ) VALUES (?, ?, 'tms', ?, ?, ?, ?, ?, ?, ?, 'ongoing', NOW(), NOW())`,
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

      // Insert responses_tms
      await connection.query(
        `INSERT INTO responses_tms (
          id_response_tms, id_response, nik, kategori_tms,
          history_nik, history_nkk, history_nama, history_tempat_lahir,
          history_tanggal_lahir, history_alamat, history_rt, history_rw,
          history_kelurahan, history_kecamatan, history_status_kawin, history_jenis_kelamin,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          idResponseTms,
          idResponse,
          originalNik,
          kategoriTms,
          originalNik,
          originalNkk || null,
          originalNama || null,
          originalTempatLahir || null,
          originalTanggalLahir || null,
          originalAlamat || null,
          originalRt || null,
          originalRw || null,
          originalKelurahan || null,
          originalKecamatan || null,
          statusKawinDb,
          genderDb,
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
        jenis: "tms",
        idResponse,
        namaPelapor: responderName,
        nikPelapor: responderNik,
        kontakPelapor: responderContact,
        namaPemilih: originalNama,
        nikPemilih: originalNik,
      }).catch((mErr) => console.error("[Mail] Error sending admin notification:", mErr));

      return NextResponse.json({
        success: true,
        message: "Laporan Pemilih TMS berhasil disimpan.",
        id_response: idResponse,
      });
    } catch (dbErr: any) {
      await connection.rollback();
      throw dbErr;
    } finally {
      connection.release();
    }
  } catch (err: any) {
    console.error("[api/laporkan-pemilih-tms] Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Gagal menyimpan laporan pemilih TMS." },
      { status: 500 }
    );
  }
}
