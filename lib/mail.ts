import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "helpdeskdaftarpemilihkpungawi@gmail.com",
    pass: process.env.SMTP_PASS || "lybf kkrm ucad hpto",
  },
});

const DEFAULT_FROM =
  process.env.SMTP_FROM ||
  '"Tangmas KPU Kabupaten Ngawi" <helpdeskdaftarpemilihkpungawi@gmail.com>';

const ADMIN_TARGET_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || "stephanusyogi12@gmail.com";

/**
 * 1. Kirim Email Konfirmasi Pengajuan ke Pelapor (Responder)
 */
export async function sendPengajuanTerkirimMail({
  toEmail,
  namaPelapor,
}: {
  toEmail: string;
  namaPelapor: string;
}) {
  if (!toEmail || !toEmail.includes("@")) return null;

  const waLink = `https://wa.me/62859106510645?text=Halo%20Admin%20KPU%20Ngawi%2C%20saya%20ingin%20tindak%20lanjut%20laporan%20tanggapan%20masyarakat%20atas%20nama%20${encodeURIComponent(
    namaPelapor
  )}.`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Pengajuan Tanggapan Anda Telah Diterima</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #000000; background-color: #f9f9f9; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid #e5e5e5;">
        <h2 style="color: #f76c26; margin-top: 0;">Halo ${namaPelapor},</h2>
        <p style="color: #333333; line-height: 1.6;">
          Terima kasih telah mengajukan tanggapan masyarakat kepada <strong>KPU Kabupaten Ngawi</strong>.
        </p>
        <p style="color: #333333; line-height: 1.6;">
          Pengajuan Anda telah berhasil terkirim ke sistem kami dan akan segera diproses oleh tim verifikator maksimal dalam waktu
          <strong>3×24 jam</strong>. Mohon menunggu dan pantau kotak masuk email Anda secara berkala untuk informasi lebih lanjut.
        </p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f0f7ff; border-radius: 6px; border-left: 4px solid #007bff;">
          <p style="margin: 0 0 8px 0; color: #333; font-weight: 600;">Layanan Bantuan & Tindak Lanjut:</p>
          <a href="${waLink}" target="_blank" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: bold;">
            Hubungi Helpdesk via WhatsApp
          </a>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
        <p style="color: #777777; font-size: 13px; margin: 0;">
          Salam hormat,<br>
          <strong style="color: #333;">Tim KPU Kabupaten Ngawi</strong><br>
          Jl. Untung Suropati No. 48, Ngawi, Jawa Timur
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: DEFAULT_FROM,
      to: toEmail,
      subject: "Pengajuan Tanggapan Masyarakat Anda Terkirim",
      html,
    });
    console.log(`[Mail] Pengajuan terkirim notification sent to ${toEmail} (${info.messageId})`);
    return info;
  } catch (err) {
    console.error("[Mail] Failed to send pengajuan terkirim mail:", err);
    return null;
  }
}

/**
 * 2. Kirim Notifikasi Tanggapan Masuk ke Admin
 * (Default tujuan testing: stephanusyogi12@gmail.com, atau ADMIN_NOTIFICATION_EMAIL)
 */
export async function sendTanggapanMasukAdminMail({
  jenis,
  idResponse,
  namaPelapor,
  nikPelapor,
  kontakPelapor,
  namaPemilih,
  nikPemilih,
}: {
  jenis: "baru" | "ubah" | "tms";
  idResponse: string;
  namaPelapor: string;
  nikPelapor?: string;
  kontakPelapor?: string;
  namaPemilih?: string;
  nikPemilih?: string;
}) {
  const targetEmail = ADMIN_TARGET_EMAIL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const backyardUrl = `${appUrl}/backyard/tanggapan`;

  const jenisLabel =
    jenis === "baru"
      ? "PEMILIH BARU"
      : jenis === "ubah"
      ? "UBAH DATA PEMILIH"
      : "PEMILIH TIDAK MEMENUHI SYARAT (TMS)";

  const badgeColor =
    jenis === "baru" ? "#28a745" : jenis === "ubah" ? "#007bff" : "#dc3545";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Tanggapan Masyarakat Masuk</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f6f9; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid #e3e6f0;">
        <div style="border-bottom: 2px solid #eaecf4; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #550d07; margin: 0 0 5px 0;">Tangmas KPU Kabupaten Ngawi</h2>
          <span style="display: inline-block; background-color: ${badgeColor}; color: #ffffff; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 4px;">
            ${jenisLabel}
          </span>
        </div>

        <p style="font-size: 15px; margin-top: 0;">
          Terdapat laporan tanggapan masyarakat baru yang masuk ke portal Tangmas:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; color: #666; width: 40%;">ID Tanggapan:</td>
            <td style="padding: 8px 0; font-weight: 600; font-family: monospace;">${idResponse}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; color: #666;">Nama Pelapor:</td>
            <td style="padding: 8px 0; font-weight: 600;">${namaPelapor}</td>
          </tr>
          ${
            nikPelapor
              ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">NIK Pelapor:</td><td style="padding: 8px 0;">${nikPelapor}</td></tr>`
              : ""
          }
          ${
            kontakPelapor
              ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">No. WhatsApp:</td><td style="padding: 8px 0;">+62${kontakPelapor}</td></tr>`
              : ""
          }
          ${
            namaPemilih
              ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Nama Pemilih:</td><td style="padding: 8px 0; font-weight: 600;">${namaPemilih}</td></tr>`
              : ""
          }
          ${
            nikPemilih
              ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">NIK Pemilih:</td><td style="padding: 8px 0;">${nikPemilih}</td></tr>`
              : ""
          }
        </table>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${backyardUrl}" target="_blank" style="display: inline-block; background-color: #550d07; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-weight: bold; font-size: 14px;">
            Buka Panel Backyard Admin
          </a>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
        <p style="font-size: 12px; color: #888; margin: 0; text-align: center;">
          Notifikasi otomatis Tangmas &bull; KPU Kabupaten Ngawi
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: DEFAULT_FROM,
      to: targetEmail,
      subject: `[Tangmas Masuk] ${jenisLabel} - ${namaPelapor}`,
      html,
    });
    console.log(`[Mail] Tanggapan masuk admin notification sent to ${targetEmail} (${info.messageId})`);
    return info;
  } catch (err) {
    console.error("[Mail] Failed to send admin notification:", err);
    return null;
  }
}

/**
 * 3. Kirim Email Feedback / Tindak Lanjut ke Pelapor
 */
export async function sendFeedbackMail({
  toEmail,
  namaPelapor,
  status,
  feedback,
  lampiranPdfRelPath,
}: {
  toEmail: string;
  namaPelapor: string;
  status: "diterima" | "tidak_diterima";
  feedback: string;
  lampiranPdfRelPath?: string | null;
}) {
  if (!toEmail || !toEmail.includes("@")) return null;

  const isDiterima = status === "diterima";
  const subject = isDiterima
    ? "Pengajuan Tanggapan Masyarakat Anda Diterima"
    : "Pengajuan Tanggapan Masyarakat Anda Tidak Diterima";

  const attachments: any[] = [];
  if (lampiranPdfRelPath) {
    const fullPdfPath = path.join(process.cwd(), "public", "storage", lampiranPdfRelPath);
    if (fs.existsSync(fullPdfPath)) {
      attachments.push({
        filename: "Formulir_Tanggapan.pdf",
        path: fullPdfPath,
        contentType: "application/pdf",
      });
    }
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${subject}</title>
    </head>
    <body style="color: #000; font-family: Arial, sans-serif; font-size: 14px; background-color: #f9f9f9; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid #ddd;">
        <p>Halo <strong>${namaPelapor}</strong>,</p>

        <p>
          Pengajuan tanggapan masyarakat Anda telah <strong style="color: ${isDiterima ? "#28a745" : "#dc3545"};">${isDiterima ? "DITERIMA" : "TIDAK DAPAT DITERIMA"}</strong> oleh Tim Verifikator KPU Kabupaten Ngawi.
        </p>

        <div style="margin: 15px 0; padding: 15px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid ${isDiterima ? "#28a745" : "#dc3545"};">
          <p style="margin: 0 0 6px 0; font-weight: bold; color: #333;">Catatan / Feedback Verifikator:</p>
          <p style="margin: 0; color: #444; line-height: 1.5;">${feedback}</p>
        </div>

        ${
          attachments.length > 0
            ? '<p style="color: #007bff; font-size: 13px;">* Terlampir dokumen Formulir Tanggapan PDF resmi dari KPU Kabupaten Ngawi.</p>'
            : ""
        }

        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

        <p style="font-size: 13px; color: #555;">
          Untuk pertanyaan lebih lanjut, Anda dapat menghubungi kami melalui WhatsApp di
          <a href="https://wa.me/62859106510645" target="_blank" style="color: #007bff; font-weight: bold;">+62 859-1065-10645</a>.
        </p>

        <p style="font-size: 13px; color: #777; margin-top: 20px;">
          Salam hormat,<br>
          <strong style="color: #333;">Tim KPU Kabupaten Ngawi</strong>
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: DEFAULT_FROM,
      to: toEmail,
      subject,
      html,
      attachments,
    });
    console.log(`[Mail] Feedback mail sent to ${toEmail} (${info.messageId})`);
    return info;
  } catch (err) {
    console.error("[Mail] Failed to send feedback mail:", err);
    return null;
  }
}
