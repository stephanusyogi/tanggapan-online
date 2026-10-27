import { NextResponse } from "next/server";
import { searchTangmasRaw } from "@/lib/syncdata";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = String(body.query || body.nik || "").trim();
    const kind = body.kind === "NKK" ? "NKK" : "NIK";

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          message: "Parameter query (NIK/NKK) wajib diisi.",
        },
        { status: 400 }
      );
    }

    const syncdataUrl = process.env.SYNCDATA_API_URL || "https://syncdata.kpungawi.com";
    const result = await searchTangmasRaw(query, syncdataUrl, kind);

    return NextResponse.json({
      success: true,
      query,
      kind,
      total: result.total,
      records: result.records,
    });
  } catch (error: any) {
    console.error("[api/v1/search/tangmas] Error:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal melakukan pencarian Tangmas",
      },
      { status: 500 }
    );
  }
}
