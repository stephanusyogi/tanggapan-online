import pool from "@/lib/db";
import TanggapanClient, {
  type UnifiedTanggapanItem,
} from "@/components/backyard/TanggapanClient";


export const metadata = {
  title: "Tanggapan Masyarakat - Backyard KPU Ngawi",
};

export const dynamic = "force-dynamic";

export default async function TanggapanPage() {
  let items: UnifiedTanggapanItem[] = [];
  let availableTahapan: string[] = [];

  try {
    const query = `
      SELECT 
        r.id_response,
        r.tahapan,
        r.alasan_tanggapan,
        r.nik_responden,
        r.nama_responden,
        r.nomor_responden,
        r.email_responden,
        r.alamat_responden,
        r.file_scan_ktp_responden,
        r.file_ttd_responden,
        r.status,
        r.status_feedback,
        r.feedback,
        r.file_output,
        r.created_at,
        -- Pemilih Baru
        rn.nama_pemilih as baru_nama,
        rn.nik as baru_nik,
        rn.no_kk as baru_nkk,
        rn.alamat as baru_alamat,
        rn.rt as baru_rt,
        rn.rw as baru_rw,
        rn.kelurahan as baru_kelurahan,
        rn.kecamatan as baru_kecamatan,
        -- Pemilih Ubah
        rc.nik as ubah_nik,
        rc.history_nama as ubah_history_nama,
        rc.nama_pemilih_ubah as ubah_nama,
        rc.alamat_ubah as ubah_alamat,
        rc.kelurahan_ubah as ubah_kelurahan,
        rc.kecamatan_ubah as ubah_kecamatan,
        -- Pemilih TMS
        rt.nik as tms_nik,
        rt.kategori_tms,
        rt.keterangan as tms_keterangan,
        rt.history_nama as tms_history_nama,
        rt.history_nik as tms_history_nik,
        rt.history_alamat as tms_history_alamat,
        rt.history_rt as tms_history_rt,
        rt.history_rw as tms_history_rw,
        rt.history_kelurahan as tms_history_kelurahan,
        rt.history_kecamatan as tms_history_kecamatan,
        -- Evidences
        se.file_scan_ktp,
        se.file_scan_kk,
        se.file_scan_lain
      FROM responses r
      LEFT JOIN responses_new rn ON r.id_response = rn.id_response
      LEFT JOIN responses_change rc ON r.id_response = rc.id_response
      LEFT JOIN responses_tms rt ON r.id_response = rt.id_response
      LEFT JOIN supporting_evidences se ON r.id_response = se.id_response
      ORDER BY r.created_at DESC
    `;

    const [rows]: any = await pool.execute(query);

    const tahapanSet = new Set<string>();

    items = (rows || []).map((row: any) => {
      if (row.tahapan) tahapanSet.add(row.tahapan);

      // Determine voter details based on category
      let namaPemilih = "-";
      let nikPemilih = "-";
      let kategoriTms = undefined;
      let alamatPemilih = undefined;
      let rt = undefined;
      let rw = undefined;
      let kelurahan = undefined;
      let kecamatan = undefined;

      if (row.alasan_tanggapan === "baru") {
        namaPemilih = row.baru_nama || "-";
        nikPemilih = row.baru_nik || "-";
        alamatPemilih = row.baru_alamat;
        rt = row.baru_rt;
        rw = row.baru_rw;
        kelurahan = row.baru_kelurahan;
        kecamatan = row.baru_kecamatan;
      } else if (row.alasan_tanggapan === "ubah") {
        namaPemilih = row.ubah_history_nama || row.ubah_nama || row.ubah_nik || "-";
        nikPemilih = row.ubah_nik || "-";
        alamatPemilih = row.ubah_alamat;
        kelurahan = row.ubah_kelurahan;
        kecamatan = row.ubah_kecamatan;
      } else if (row.alasan_tanggapan === "tms") {
        namaPemilih = row.tms_history_nama || row.tms_nik || "-";
        nikPemilih = row.tms_nik || row.tms_history_nik || "-";
        kategoriTms = row.kategori_tms;
        alamatPemilih = row.tms_history_alamat;
        rt = row.tms_history_rt;
        rw = row.tms_history_rw;
        kelurahan = row.tms_history_kelurahan;
        kecamatan = row.tms_history_kecamatan;
      }

      return {
        id_response: row.id_response,
        tahapan: row.tahapan || "-",
        alasan_tanggapan: row.alasan_tanggapan,
        nik_responden: row.nik_responden,
        nama_responden: row.nama_responden,
        nomor_responden: row.nomor_responden,
        email_responden: row.email_responden,
        alamat_responden: row.alamat_responden,
        file_scan_ktp_responden: row.file_scan_ktp_responden,
        file_ttd_responden: row.file_ttd_responden,
        status: row.status,
        status_feedback: row.status_feedback,
        feedback: row.feedback,
        file_output: row.file_output,
        created_at: String(row.created_at),
        pemilih: {
          nama: namaPemilih,
          nik: nikPemilih,
          kategori_tms: kategoriTms,
          keterangan_tms: row.tms_keterangan,
          alamat: alamatPemilih,
          rt,
          rw,
          kelurahan,
          kecamatan,
        },
        evidences: {
          file_scan_ktp: row.file_scan_ktp,
          file_scan_kk: row.file_scan_kk,
          file_scan_lain: row.file_scan_lain,
        },
      };
    });

    availableTahapan = Array.from(tahapanSet);
  } catch (err) {
    console.error("Error fetching tanggapan page data:", err);
  }

  return (
    <TanggapanClient
      initialItems={items}
      availableTahapan={availableTahapan}
    />
  );
}
