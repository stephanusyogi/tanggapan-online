import { NextResponse } from "next/server";
import { getWilayahData } from "@/lib/wilayah";

export async function GET() {
  try {
    const data = await getWilayahData();
    return NextResponse.json({
      success: true,
      kecamatan: data.kecamatan,
      desaByKec: data.desaByKec,
    });
  } catch (err: any) {
    console.error("[api/wilayah] Error:", err);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data wilayah" },
      { status: 500 }
    );
  }
}
