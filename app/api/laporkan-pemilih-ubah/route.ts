import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import pool from "@/lib/db";
import { getActiveTahapan } from "@/lib/syncdata";
import { saveUploadedFile, saveBase64Signature } from "@/lib/upload";
import { sendPengajuanTerkirimMail, sendTanggapanMasukAdminMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Data Asli Pemilih
    const originalNik = String(formData.get("original_nik") || "").trim().replace(/\D/g, "");
    const originalNama = String(formData.get("original_nama") || "").trim().toUpperCase();

    // Data Perubahan
    const nameUbah = String(formData.get("name_ubah") || "").trim().toUpperCase();
    const kkUbah = String(formData.get("kk_ubah") || "").trim().replace(/\D/g, "");
    const nikUbah = String(formData.get("nik_ubah") || "").trim().replace(/\D/g, "");
    const placeOfBirthUbah = String(formData.get("place_of_birth_ubah") || "").trim().toUpperCase();
    const dateOfBirthUbah = String(formData.get("date_of_birth_ubah") || "").trim();
    const maritalStatusUbah = String(formData.get("marital_status_ubah") || "").trim();
    const genderUbah = String(formData.get("gender_ubah") || "").trim();
    const addressUbah = String(formData.get("address_ubah") || "").trim().toUpperCase();
    const rtUbah = String(formData.get("rt_ubah") || "").trim();
    const rwUbah = String(formData.get("rw_ubah") || "").trim();
    const kecamatanUbah = String(formData.get("kecamatan_ubah") || "").trim().toUpperCase();
    const kelurahanUbah = String(formData.get("kelurahan_ubah") || "").trim().toUpperCase();

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
    const kkFilePath = await saveUploadedFile(kkFile, "upload/response_ubah");
    const ktpFilePath = await saveUploadedFile(ktpFile, "upload/response_ubah");
    let buktiLainPath: string | null = null;
    if (buktiLain && buktiLain.size > 0) {
      buktiLainPath = await saveUploadedFile(buktiLain, "upload/response_ubah");
    }

    // Mapping Status Kawin & Gender
    let statusKawinDb: string | null = null;
    if (maritalStatusUbah === "sudah_nikah" || maritalStatusUbah === "S") statusKawinDb = "S";
    else if (maritalStatusUbah === "pernah_nikah" || maritalStatusUbah === "P") statusKawinDb = "P";
    else if (maritalStatusUbah === "belum_nikah" || maritalStatusUbah === "B") statusKawinDb = "B";

    let genderDb: string | null = null;
    if (genderUbah === "perempuan" || genderUbah === "P") genderDb = "P";
    else if (genderUbah === "laki_laki" || genderUbah === "L") genderDb = "L";

    // UUIDs
    const idResponse = uuidv4();
    const idResponseChange = uuidv4();
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
        ) VALUES (?, ?, 'ubah', ?, ?, ?, ?, ?, ?, ?, 'ongoing', NOW(), NOW())`,
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

      // Insert responses_change
      await connection.query(
        `INSERT INTO responses_change (
          id_response_change, id_response, nik, history_nama,
          nama_pemilih_ubah, no_kk_ubah, nik_ubah, tempat_lahir_ubah,
          tanggal_lahir_ubah, status_kawin_ubah, jenis_kelamin_ubah,
          alamat_ubah, rt_ubah, rw_ubah, kelurahan_ubah, kecamatan_ubah,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          idResponseChange,
          idResponse,
          originalNik,
          originalNama || nameUbah,
          nameUbah || null,
          kkUbah || null,
          nikUbah || null,
          placeOfBirthUbah || null,
          dateOfBirthUbah || null,
          statusKawinDb,
          genderDb,
          addressUbah || null,
          rtUbah || null,
          rwUbah || null,
          kelurahanUbah || null,
          kecamatanUbah || null,
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
        jenis: "ubah",
        idResponse,
        namaPelapor: responderName,
        nikPelapor: responderNik,
        kontakPelapor: responderContact,
        namaPemilih: nameUbah || originalNama,
        nikPemilih: nikUbah || originalNik,
      }).catch((mErr) => console.error("[Mail] Error sending admin notification:", mErr));

      return NextResponse.json({
        success: true,
        message: "Laporan Perubahan Data Pemilih berhasil disimpan.",
        id_response: idResponse,
      });
    } catch (dbErr: any) {
      await connection.rollback();
      throw dbErr;
    } finally {
      connection.release();
    }
  } catch (err: any) {
    console.error("[api/laporkan-pemilih-ubah] Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Gagal menyimpan laporan ubah data pemilih." },
      { status: 500 }
    );
  }
}
