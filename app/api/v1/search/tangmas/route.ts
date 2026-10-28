import { NextResponse } from "next/server";
import { searchTangmasRaw } from "@/lib/syncdata";

// Rate limiting in-memory per IP (maksimal 30 request / menit)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Bersihkan data lama jika ukuran map terlalu besar
  if (rateLimitMap.size > 5000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!entry || entry.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  try {
    // 1. Validasi Rate Limit
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: "Terlalu sering melakukan pencarian. Silakan coba 1 menit lagi.",
        },
        {
          status: 429,
          headers: {
            ...CORS_HEADERS,
            "Retry-After": "60",
          },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const rawQuery = String(body.query || body.nik || "").trim();
    const kind = body.kind === "NKK" ? "NKK" : "NIK";

    if (!rawQuery) {
      return NextResponse.json(
        {
          success: false,
          message: "Parameter query (NIK/NKK) wajib diisi.",
        },
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    const syncdataUrl =
      process.env.DATA_API_URL ||
      process.env.SYNCDATA_API_URL ||
      "https://syncdata.kpungawi.com";

    const result = await searchTangmasRaw(rawQuery, syncdataUrl, kind);

    return NextResponse.json(
      {
        success: true,
        query: rawQuery,
        kind,
        total: result.total,
        records: result.records,
      },
      {
        headers: CORS_HEADERS,
      }
    );
  } catch (error: any) {
    console.error("[api/v1/search/tangmas] Error:", error.message);
    const status = error.status || (error.message?.includes("Terlalu") ? 429 : 500);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal memverifikasi NIK/NKK.",
      },
      {
        status,
        headers: {
          ...CORS_HEADERS,
          ...(status === 429 ? { "Retry-After": "60" } : {}),
        },
      }
    );
  }
}
