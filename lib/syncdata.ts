const SYNCDATA_URL =
  process.env.DATA_API_URL ||
  process.env.SYNCDATA_API_URL ||
  "https://syncdata.kpungawi.com";

let cachedTahapan: {
  nama: string;
  timestamp: number;
} | null = null;

const TAHAPAN_TTL = 1000 * 60 * 30; // 30 minutes

/**
 * Fetch latest active tahapan from syncdata.
 * Checks /api/v1/tahapan first (if created),
 * otherwise falls back to /api/v1/reporting/summary (periodeTahapan).
 */
export async function getActiveTahapan(): Promise<string> {
  const now = Date.now();
  if (cachedTahapan && now - cachedTahapan.timestamp < TAHAPAN_TTL) {
    return cachedTahapan.nama;
  }

  // 1. Try dedicated /api/v1/tahapan if available
  try {
    const res = await fetch(`${SYNCDATA_URL}/api/v1/tahapan`, {
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const json = await res.json();
      const nama = json.tahapan || json.data?.tahapan || json.data?.periodeTahapan;
      if (nama && typeof nama === "string") {
        cachedTahapan = { nama: nama.trim(), timestamp: now };
        return cachedTahapan.nama;
      }
    }
  } catch {
    // Continue to fallback
  }

  // 2. Fallback to /api/v1/reporting/summary which already has periodeTahapan
  try {
    const res = await fetch(`${SYNCDATA_URL}/api/v1/reporting/summary`, {
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const json = await res.json();
      const nama = json.data?.summary?.periodeTahapan;
      if (nama && typeof nama === "string") {
        cachedTahapan = { nama: nama.trim(), timestamp: now };
        return cachedTahapan.nama;
      }
    }
  } catch (err) {
    console.error("Failed to fetch tahapan from syncdata:", err);
  }

  // 3. Safe fallback if network fails
  return cachedTahapan?.nama || "PDPB Triwulan 4 Tahun 2026";
}

export interface PemilihRecord {
  nama?: string;
  nama_masked?: string;
  nik?: string;
  nkk?: string;
  kelamin?: string;
  kecamatan?: string;
  kelurahan?: string;
  tps?: string | number;
  alamat_wilayah?: string;
  rt?: string;
  rw?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  status_kawin?: string;
  [key: string]: any;
}

export interface TangmasSearchResult {
  success?: boolean;
  query?: string;
  kind?: string;
  total: number;
  records: PemilihRecord[];
  message?: string;
}

/**
 * Fungsi helper untuk cek data pemilih aktif di Tangmas
 */
export async function checkPemilihTangmas(nikOrNkk: string, kind?: "NIK" | "NKK") {
  const baseUrl = process.env.DATA_API_URL || process.env.NEXT_PUBLIC_DATA_API_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/v1/search/tangmas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: nikOrNkk,
      ...(kind ? { kind } : {}),
    }),
    cache: "no-store",
  });

  if (response.status === 429) {
    throw new Error("Terlalu sering melakukan pencarian. Silakan coba 1 menit lagi.");
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Gagal memverifikasi NIK/NKK.");
  }

  const data = await response.json();
  return data;
}

/**
 * Cek pemilih Tangmas via syncdata API:
 * Endpoint: POST /api/v1/search/tangmas
 */
export async function cekPemilihTangmas(
  nikOrNkk: string,
  baseUrl = process.env.DATA_API_URL || process.env.SYNCDATA_API_URL || "https://syncdata.kpungawi.com",
  kind: "NIK" | "NKK" = "NIK"
): Promise<PemilihRecord | null> {
  const cleanQuery = String(nikOrNkk || "").trim().replace(/\D/g, "");

  let res = await fetch(`${baseUrl}/api/v1/search/tangmas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: cleanQuery, kind }),
    cache: "no-store",
  });

  // Fallback ke /api/v1/search/pemilih jika endpoint /search/tangmas belum tersedia (404)
  if (res.status === 404) {
    res = await fetch(`${baseUrl}/api/v1/search/pemilih`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: cleanQuery, kind }),
      cache: "no-store",
    });
  }

  if (res.status === 429) {
    const err: any = new Error("Terlalu sering melakukan pencarian. Silakan coba 1 menit lagi.");
    err.status = 429;
    throw err;
  }

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(result.message || "Gagal memverifikasi NIK/NKK.");
    err.status = res.status;
    throw err;
  }

  if (result.total > 0 && result.records && result.records.length > 0) {
    const pemilih = result.records[0];
    console.log(
      `Pemilih Aktif: ${pemilih.nama_masked || pemilih.nama} di TPS ${pemilih.tps}, Kel. ${pemilih.kelurahan}`
    );
    return pemilih;
  } else {
    console.log("Pemilih tidak ditemukan atau bukan pemilih aktif.");
    return null;
  }
}

/**
 * Pencarian Tangmas mentah (mengembalikan total dan array records)
 */
export async function searchTangmasRaw(
  nikOrNkk: string,
  baseUrl = process.env.DATA_API_URL || process.env.SYNCDATA_API_URL || "https://syncdata.kpungawi.com",
  kind: "NIK" | "NKK" = "NIK"
): Promise<TangmasSearchResult> {
  const cleanQuery = String(nikOrNkk || "").trim().replace(/\D/g, "");

  let res = await fetch(`${baseUrl}/api/v1/search/tangmas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: cleanQuery, kind }),
    cache: "no-store",
  });

  if (res.status === 404) {
    res = await fetch(`${baseUrl}/api/v1/search/pemilih`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: cleanQuery, kind }),
      cache: "no-store",
    });
  }

  if (res.status === 429) {
    const err: any = new Error("Terlalu sering melakukan pencarian. Silakan coba 1 menit lagi.");
    err.status = 429;
    throw err;
  }

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(result.message || "Gagal memverifikasi NIK/NKK.");
    err.status = res.status;
    throw err;
  }

  return {
    success: result.success ?? true,
    query: cleanQuery,
    kind,
    total: result.total ?? (result.records?.length || 0),
    records: result.records || [],
  };
}

