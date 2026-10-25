const SYNCDATA_URL =
  process.env.SYNCDATA_API_URL || "https://syncdata.kpungawi.com";

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
