interface MasterTps {
  id: number;
  kec_id: number;
  kecamatan: string;
  kel_id: number;
  kelurahan: string;
  tps_id: number;
  tps_no: string;
  nama_lokasi: string | null;
  alamat_lengkap: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
}

let cachedTpsList: MasterTps[] | null = null;
let lastFetched: number = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function getTpsList(): Promise<MasterTps[]> {
  const now = Date.now();
  if (cachedTpsList && (now - lastFetched) < CACHE_TTL_MS) {
    return cachedTpsList;
  }

  const syncdataUrl = process.env.SYNCDATA_API_URL || "https://syncdata.kpungawi.com";
  try {
    const res = await fetch(`${syncdataUrl}/api/v1/tps`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) {
      console.error("[tps] Failed to fetch TPS list:", res.statusText);
      return cachedTpsList || [];
    }
    const json = await res.json();
    cachedTpsList = json.data || [];
    lastFetched = now;
    return cachedTpsList || [];
  } catch (error) {
    console.error("[tps] Error fetching TPS list:", error);
    return cachedTpsList || [];
  }
}

export async function findTpsCoordinates(kecamatan: string, kelurahan: string, tpsNo: string | number) {
  const list = await getTpsList();
  const cleanKec = kecamatan.trim().toUpperCase();
  const cleanKel = kelurahan.trim().toUpperCase();
  const rawTps = String(tpsNo).replace(/\D/g, "");
  const cleanTps = String(parseInt(rawTps, 10)); // normalize '001' to '1'

  const matched = list.find((item) => {
    const itemKec = (item.kecamatan || "").replace(/^\d+\./, "").trim().toUpperCase();
    const itemKel = (item.kelurahan || "").trim().toUpperCase();
    const itemTps = String(parseInt(String(item.tps_no).replace(/\D/g, ""), 10));

    const kecMatches = !cleanKec || itemKec.includes(cleanKec) || cleanKec.includes(itemKec);
    const kelMatches = !cleanKel || itemKel.includes(cleanKel) || cleanKel.includes(itemKel);
    const tpsMatches = itemTps === cleanTps;

    return kecMatches && kelMatches && tpsMatches;
  });

  return matched || null;
}
