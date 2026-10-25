import Link from "next/link";
import pool from "@/lib/db";
import { getActiveTahapan } from "@/lib/syncdata";
import { getWilayahData } from "@/lib/wilayah";
import { getTpsList } from "@/lib/tps";


export default async function BackyardDashboardPage() {
  const activeTahapan = await getActiveTahapan();

  // 1. Fetch Tanggapan stats from database
  let stats = {
    total: 0,
    baru: 0,
    ubah: 0,
    tms: 0,
    diterima: 0,
    tidak_diterima: 0,
    ongoing: 0,
  };

  let recentList: any[] = [];

  try {
    const [counts]: any = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN alasan_tanggapan = 'baru' THEN 1 ELSE 0 END) as baru,
        SUM(CASE WHEN alasan_tanggapan = 'ubah' THEN 1 ELSE 0 END) as ubah,
        SUM(CASE WHEN alasan_tanggapan = 'tms' THEN 1 ELSE 0 END) as tms,
        SUM(CASE WHEN status_feedback = 'diterima' THEN 1 ELSE 0 END) as diterima,
        SUM(CASE WHEN status_feedback = 'tidak_diterima' THEN 1 ELSE 0 END) as tidak_diterima,
        SUM(CASE WHEN status_feedback IS NULL OR status = 'ongoing' THEN 1 ELSE 0 END) as ongoing
      FROM responses
    `);

    if (counts && counts.length > 0) {
      stats = {
        total: Number(counts[0].total) || 0,
        baru: Number(counts[0].baru) || 0,
        ubah: Number(counts[0].ubah) || 0,
        tms: Number(counts[0].tms) || 0,
        diterima: Number(counts[0].diterima) || 0,
        tidak_diterima: Number(counts[0].tidak_diterima) || 0,
        ongoing: Number(counts[0].ongoing) || 0,
      };
    }

    const [recent]: any = await pool.execute(`
      SELECT 
        r.id_response,
        r.tahapan,
        r.alasan_tanggapan,
        r.nama_responden,
        r.nomor_responden,
        r.status_feedback,
        r.status,
        r.created_at,
        COALESCE(rn.nama_pemilih, rc.history_nama, rc.nama_pemilih_ubah, rt.history_nama, '-') as nama_pemilih
      FROM responses r
      LEFT JOIN responses_new rn ON r.id_response = rn.id_response
      LEFT JOIN responses_change rc ON r.id_response = rc.id_response
      LEFT JOIN responses_tms rt ON r.id_response = rt.id_response
      ORDER BY r.created_at DESC
      LIMIT 5
    `);

    recentList = recent || [];
  } catch (err) {
    console.error("Error fetching stats:", err);
  }

  // 2. Fetch Wilayah info from syncdata
  let totalKecamatan = 19;
  let totalKelurahan = 217;
  let totalTps = 1374;

  try {
    const wilayah = await getWilayahData();
    totalKecamatan = wilayah.kecamatan.length || 19;
    let countDesa = 0;
    for (const k of Object.keys(wilayah.desaByKec)) {
      countDesa += wilayah.desaByKec[k].length;
    }
    if (countDesa > 0) totalKelurahan = countDesa;

    const tpsList = await getTpsList();
    if (tpsList && tpsList.length > 0) {
      totalTps = tpsList.length;
    }
  } catch (err) {
    console.error("Error fetching wilayah from syncdata:", err);
  }

  return (
    <div>
      {/* Page Header */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1 text-gray-800 font-weight-bold">Dashboard</h1>
          <div className="text-muted small">
            Tahapan Berjalan:{" "}
            <span className="badge badge-success px-2 py-1 font-weight-bold" style={{ fontSize: "0.85rem" }}>
              {activeTahapan}
            </span>
          </div>
        </div>
        <ol className="breadcrumb bg-transparent p-0 mb-0 small">
          <li className="breadcrumb-item">
            <Link href="/" className="text-danger font-weight-bold">
              Home
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Dashboard
          </li>
        </ol>
      </div>

      {/* 4 Cards: Tanggapan Metrik */}
      <div className="row mb-4">
        {/* Total Tanggapan */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card h-100 shadow-sm border-left-primary" style={{ borderLeft: "4px solid #4e73df" }}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Tanggapan
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">{stats.total}</div>
                  <div className="text-muted small mt-1">Semua kategori tanggapan</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-comments fa-2x text-primary" style={{ opacity: 0.3 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pemilih Baru */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card h-100 shadow-sm" style={{ borderLeft: "4px solid #1cc88a" }}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Pemilih Baru
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">{stats.baru}</div>
                  <div className="text-muted small mt-1">Laporan pendaftaran baru</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user-plus fa-2x text-success" style={{ opacity: 0.3 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pemilih Ubah */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card h-100 shadow-sm" style={{ borderLeft: "4px solid #36b9cc" }}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Pemilih Ubah
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">{stats.ubah}</div>
                  <div className="text-muted small mt-1">Laporan koreksi elemen data</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user-edit fa-2x text-info" style={{ opacity: 0.3 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pemilih TMS */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card h-100 shadow-sm" style={{ borderLeft: "4px solid #e74a3b" }}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Pemilih TMS
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">{stats.tms}</div>
                  <div className="text-muted small mt-1">Laporan tidak memenuhi syarat</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user-times fa-2x text-danger" style={{ opacity: 0.3 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Status Feedback & Master Wilayah Syncdata */}
      <div className="row mb-4">
        {/* Progress & Tindak Lanjut Tanggapan */}
        <div className="col-xl-6 col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header py-3 d-flex align-items-center justify-content-between bg-white">
              <h6 className="m-0 font-weight-bold text-gray-800">
                <i className="fas fa-tasks mr-2 text-primary"></i>Status Tindak Lanjut Tanggapan
              </h6>
              <Link href="/backyard/tanggapan" className="btn btn-sm btn-primary">
                Buka Data Tanggapan &rarr;
              </Link>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between small font-weight-bold mb-1">
                  <span className="text-success">Diterima & Selesai ({stats.diterima})</span>
                  <span>
                    {stats.total > 0
                      ? Math.round((stats.diterima / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{
                      width: `${
                        stats.total > 0
                          ? (stats.diterima / stats.total) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small font-weight-bold mb-1">
                  <span className="text-danger">Tidak Diterima ({stats.tidak_diterima})</span>
                  <span>
                    {stats.total > 0
                      ? Math.round((stats.tidak_diterima / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{
                      width: `${
                        stats.total > 0
                          ? (stats.tidak_diterima / stats.total) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small font-weight-bold mb-1">
                  <span className="text-warning">Menunggu Tindak Lanjut ({stats.ongoing})</span>
                  <span>
                    {stats.total > 0
                      ? Math.round((stats.ongoing / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{
                      width: `${
                        stats.total > 0
                          ? (stats.ongoing / stats.total) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <hr />
              <div className="small text-muted">
                Admin dapat memberikan umpan balik (feedback) langsung kepada pelapor melalui formulir tanggapan pada menu <strong>Tanggapan Masyarakat</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Master Wilayah Terkoneksi Syncdata */}
        <div className="col-xl-6 col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header py-3 bg-white">
              <h6 className="m-0 font-weight-bold text-gray-800">
                <i className="fas fa-network-wired mr-2 text-success"></i>Master Wilayah (Terkoneksi SyncData)
              </h6>
            </div>
            <div className="card-body d-flex flex-column justify-content-around">
              <div className="row align-items-center mb-3">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-uppercase mb-1 text-primary">
                    Total TPS Kabupaten Ngawi
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">
                    {totalTps.toLocaleString("id-ID")} TPS
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-map-marked-alt fa-2x text-primary" style={{ opacity: 0.3 }}></i>
                </div>
              </div>

              <div className="row align-items-center mb-3">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-uppercase mb-1 text-success">
                    Total Kecamatan
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">
                    {totalKecamatan} Kecamatan
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-city fa-2x text-success" style={{ opacity: 0.3 }}></i>
                </div>
              </div>

              <div className="row align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-uppercase mb-1 text-warning">
                    Total Kelurahan / Desa
                  </div>
                  <div className="h4 mb-0 font-weight-bold text-gray-800">
                    {totalKelurahan} Desa / Kelurahan
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-building fa-2x text-warning" style={{ opacity: 0.3 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Tanggapan Terbaru */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-header py-3 d-flex align-items-center justify-content-between bg-white">
              <h6 className="m-0 font-weight-bold text-gray-800">
                <i className="fas fa-history mr-2 text-info"></i>Tanggapan Masuk Terbaru
              </h6>
              <Link href="/backyard/tanggapan" className="btn btn-sm btn-outline-primary font-weight-bold">
                Lihat Semua ({stats.total}) &rarr;
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-items-center table-hover table-flush mb-0">
                  <thead className="thead-light">
                    <tr>
                      <th>Tanggal</th>
                      <th>Kategori</th>
                      <th>Nama Pelapor</th>
                      <th>Pemilih Dilaporkan</th>
                      <th>No. WhatsApp</th>
                      <th>Tahapan</th>
                      <th>Status Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-muted">
                          Belum ada data tanggapan masyarakat.
                        </td>
                      </tr>
                    ) : (
                      recentList.map((item) => (
                        <tr key={item.id_response}>
                          <td className="small font-weight-bold text-muted">
                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td>
                            {item.alasan_tanggapan === "baru" && (
                              <span className="badge badge-success px-2 py-1 font-weight-bold">
                                Pemilih Baru
                              </span>
                            )}
                            {item.alasan_tanggapan === "ubah" && (
                              <span className="badge badge-info px-2 py-1 font-weight-bold">
                                Pemilih Ubah
                              </span>
                            )}
                            {item.alasan_tanggapan === "tms" && (
                              <span className="badge badge-danger px-2 py-1 font-weight-bold">
                                Pemilih TMS
                              </span>
                            )}
                          </td>
                          <td className="font-weight-bold text-dark">{item.nama_responden}</td>
                          <td>{item.nama_pemilih}</td>
                          <td>
                            <a
                              href={`https://wa.me/${String(item.nomor_responden).replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-success small font-weight-bold"
                            >
                              <i className="fab fa-whatsapp mr-1"></i>
                              {item.nomor_responden}
                            </a>
                          </td>
                          <td>
                            <span className="badge badge-light border">{item.tahapan || "-"}</span>
                          </td>
                          <td>
                            {item.status_feedback === "diterima" && (
                              <span className="badge badge-success">Diterima</span>
                            )}
                            {item.status_feedback === "tidak_diterima" && (
                              <span className="badge badge-danger">Tidak Diterima</span>
                            )}
                            {(!item.status_feedback || item.status === "ongoing") && (
                              <span className="badge badge-warning">Menunggu</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
