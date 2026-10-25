import { getTpsList } from "./tps";

export interface KecamatanItem {
  id: number;
  nama: string;
}

export interface DesaItem {
  id: number;
  kec_id: number;
  nama: string;
}

let cachedWilayah: {
  kecamatan: KecamatanItem[];
  desaByKec: Record<string, DesaItem[]>;
  timestamp: number;
} | null = null;

const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function getWilayahData() {
  const now = Date.now();
  if (cachedWilayah && now - cachedWilayah.timestamp < CACHE_TTL) {
    return cachedWilayah;
  }

  const tpsList = await getTpsList();
  const kecMap = new Map<number, KecamatanItem>();
  const desaMap = new Map<string, DesaItem>();
  const desaByKec: Record<string, DesaItem[]> = {};

  for (const tps of tpsList) {
    if (!tps.kecamatan || !tps.kec_id) continue;

    const kecName = tps.kecamatan.trim().toUpperCase();
    if (!kecMap.has(tps.kec_id)) {
      kecMap.set(tps.kec_id, {
        id: tps.kec_id,
        nama: kecName,
      });
    }

    if (tps.kelurahan && tps.kel_id) {
      const desaName = tps.kelurahan.trim().toUpperCase();
      const desaKey = `${tps.kec_id}_${tps.kel_id}`;

      if (!desaMap.has(desaKey)) {
        const item: DesaItem = {
          id: tps.kel_id,
          kec_id: tps.kec_id,
          nama: desaName,
        };
        desaMap.set(desaKey, item);

        if (!desaByKec[kecName]) desaByKec[kecName] = [];
        desaByKec[kecName].push(item);
      }
    }
  }

  const kecamatan = Array.from(kecMap.values()).sort((a, b) =>
    a.nama.localeCompare(b.nama)
  );

  for (const key of Object.keys(desaByKec)) {
    desaByKec[key].sort((a, b) => a.nama.localeCompare(b.nama));
  }

  cachedWilayah = {
    kecamatan,
    desaByKec,
    timestamp: now,
  };

  return cachedWilayah;
}

export async function getKecamatanList(): Promise<KecamatanItem[]> {
  const data = await getWilayahData();
  return data.kecamatan;
}

export async function getDesaList(kecamatanName: string): Promise<DesaItem[]> {
  const data = await getWilayahData();
  const upper = kecamatanName.trim().toUpperCase();
  return data.desaByKec[upper] || [];
}
