import { NextResponse } from "next/server";
import { findTpsCoordinates } from "@/lib/tps";
import { searchTangmasRaw } from "@/lib/syncdata";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawNik = String(body.nik || "").trim();
    const digitsOnly = rawNik.replace(/\D/g, "");

    // 1. Verifikasi CAPTCHA Turnstile
    const turnstileToken =
      body["cf-turnstile-response"] || body.turnstileToken || body.token;
    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;

    const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          status: "turnstile_error",
          message:
            turnstileResult.message ||
            "Verifikasi keamanan (CAPTCHA) gagal atau belum diselesaikan.",
        },
        { status: 403 }
      );
    }

    if (digitsOnly.length !== 16) {
      return NextResponse.json({
        status: "invalid",
        message: "NIK harus 16 digit angka."
      }, { status: 400 });
    }

    const syncdataUrl =
      process.env.DATA_API_URL ||
      process.env.SYNCDATA_API_URL ||
      "https://syncdata.kpungawi.com";

    // 1. Call syncdata search/tangmas (POST /api/v1/search/tangmas)
    let json;
    try {
      json = await searchTangmasRaw(digitsOnly, syncdataUrl, "NIK");
    } catch (err: any) {
      console.error("[api/search] Error from syncdata:", err.message);
      if (err.status === 429 || err.message?.includes("Terlalu")) {
        return NextResponse.json({
          status: "rate_limited",
          message: err.message || "Terlalu sering melakukan pencarian. Silakan coba 1 menit lagi."
        }, { status: 429 });
      }
      return NextResponse.json({
        status: "error",
        message: "Gagal menghubungi server data KPU. Silakan coba sesaat lagi."
      }, { status: 502 });
    }

    const record = json.records && json.records.length > 0 ? json.records[0] : null;

    if (!record) {
      return NextResponse.json({
        status: "not_found",
        message: "Data NIK tidak ditemukan di DPT Kabupaten Ngawi."
      });
    }

    // Format Masking NIK dan NKK (6 digit awal terlihat, 10 digit disamarkan bintang)
    const maskedNIK = `${digitsOnly.slice(0, 6)}**********`;
    const maskedNKK = `${digitsOnly.slice(0, 6)}**********`;

    const cleanTpsNo = String(record.tps || "").replace(/\D/g, "");
    const paddedTpsNo = cleanTpsNo ? cleanTpsNo.padStart(3, "0") : "-";

    // Lookup koordinat geografis TPS
    const tpsDetails = await findTpsCoordinates(
      record.kecamatan || "",
      record.kelurahan || "",
      cleanTpsNo
    );

    return NextResponse.json({
      status: "found",
      data: {
        nik: digitsOnly,
        maskedNIK,
        maskedNKK,
        nama: record.nama || record.nama_masked || "-",
        kelamin: record.kelamin === "L" ? "Laki-laki" : (record.kelamin === "P" ? "Perempuan" : "-"),
        kecamatan: record.kecamatan || "-",
        kelurahan: record.kelurahan || "-",
        tps: paddedTpsNo,
        alamat: record.alamat_wilayah || tpsDetails?.alamat_lengkap || "-",
        tpsDetails: tpsDetails ? {
          tps_no: paddedTpsNo,
          nama_lokasi: tpsDetails.nama_lokasi || `TPS ${paddedTpsNo} ${record.kelurahan}`,
          alamat: tpsDetails.alamat_lengkap || record.alamat_wilayah || "-",
          latitude: tpsDetails.latitude ? Number(tpsDetails.latitude) : -7.4042,
          longitude: tpsDetails.longitude ? Number(tpsDetails.longitude) : 111.4458
        } : {
          tps_no: paddedTpsNo,
          nama_lokasi: `TPS ${paddedTpsNo} ${record.kelurahan}`,
          alamat: record.alamat_wilayah || "-",
          latitude: -7.4042,
          longitude: 111.4458
        }
      }
    });
  } catch (error: any) {
    console.error("[api/search] Unhandled error:", error);
    return NextResponse.json({
      status: "error",
      message: "Terjadi kesalahan pada sistem."
    }, { status: 500 });
  }
}
