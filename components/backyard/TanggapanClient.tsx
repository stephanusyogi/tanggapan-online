"use client";

import { useState, useMemo } from "react";
import Swal from "sweetalert2";

export interface UnifiedTanggapanItem {
  id_response: string;
  tahapan: string;
  alasan_tanggapan: "baru" | "ubah" | "tms";
  nik_responden: string;
  nama_responden: string;
  nomor_responden: string;
  email_responden: string | null;
  alamat_responden: string;
  file_scan_ktp_responden: string | null;
  file_ttd_responden: string | null;
  status: "ongoing" | "finalized";
  status_feedback: "diterima" | "tidak_diterima" | null;
  feedback: string | null;
  file_output: string | null;
  created_at: string;
  // Detail Pemilih
  pemilih: {
    nama: string;
    nik: string;
    nkk?: string;
    kategori_tms?: string;
    keterangan_tms?: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    alamat?: string;
    rt?: string;
    rw?: string;
    kelurahan?: string;
    kecamatan?: string;
    // Perubahan (khusus ubah)
    perubahan?: Record<string, string>;
  };
  // Berkas pendukung
  evidences?: {
    file_scan_ktp: string | null;
    file_scan_kk: string | null;
    file_scan_lain: string | null;
  };
}

interface TanggapanClientProps {
  initialItems: UnifiedTanggapanItem[];
  availableTahapan: string[];
}

export default function TanggapanClient({
  initialItems,
  availableTahapan,
}: TanggapanClientProps) {
  const [items, setItems] = useState<UnifiedTanggapanItem[]>(initialItems);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [tahapanFilter, setTahapanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [detailModalItem, setDetailModalItem] = useState<UnifiedTanggapanItem | null>(null);
  const [feedbackModalItem, setFeedbackModalItem] = useState<UnifiedTanggapanItem | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<"diterima" | "tidak_diterima">("diterima");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (categoryFilter !== "all" && item.alasan_tanggapan !== categoryFilter) {
        return false;
      }
      // Tahapan filter
      if (tahapanFilter !== "all" && item.tahapan !== tahapanFilter) {
        return false;
      }
      // Status Feedback filter
      if (statusFilter === "diterima" && item.status_feedback !== "diterima") {
        return false;
      }
      if (statusFilter === "tidak_diterima" && item.status_feedback !== "tidak_diterima") {
        return false;
      }
      if (statusFilter === "ongoing" && item.status_feedback !== null) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const pelapor = (item.nama_responden || "").toLowerCase();
        const nikPelapor = (item.nik_responden || "").toLowerCase();
        const noWa = (item.nomor_responden || "").toLowerCase();
        const pemilih = (item.pemilih.nama || "").toLowerCase();
        const nikPemilih = (item.pemilih.nik || "").toLowerCase();

        return (
          pelapor.includes(q) ||
          nikPelapor.includes(q) ||
          noWa.includes(q) ||
          pemilih.includes(q) ||
          nikPemilih.includes(q)
        );
      }

      return true;
    });
  }, [items, categoryFilter, tahapanFilter, statusFilter, searchQuery]);

  // Counts for tabs
  const countAll = items.length;
  const countBaru = items.filter((i) => i.alasan_tanggapan === "baru").length;
  const countUbah = items.filter((i) => i.alasan_tanggapan === "ubah").length;
  const countTms = items.filter((i) => i.alasan_tanggapan === "tms").length;

  const isFiltered =
    searchQuery.trim() !== "" ||
    categoryFilter !== "all" ||
    tahapanFilter !== "all" ||
    statusFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setTahapanFilter("all");
    setStatusFilter("all");
  };

  const handleOpenFeedback = (item: UnifiedTanggapanItem) => {
    setFeedbackModalItem(item);
    setFeedbackStatus(item.status_feedback || "diterima");
    setFeedbackText(
      item.feedback ||
        (item.status_feedback === "tidak_diterima"
          ? "Berkas lampiran tidak memenuhi kelengkapan persyaratan yang ditentukan."
          : "Terima kasih atas tanggapan yang telah disampaikan. Tanggapan Anda telah diverifikasi dan diterima.")
    );
  };

  const handleSaveFeedback = async () => {
    if (!feedbackModalItem) return;
    setSubmittingFeedback(true);

    try {
      const res = await fetch("/api/backyard/tanggapan/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_response: feedbackModalItem.id_response,
          status_feedback: feedbackStatus,
          feedback: feedbackText,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan feedback");

      // Update local state
      setItems((prev) =>
        prev.map((i) =>
          i.id_response === feedbackModalItem.id_response
            ? {
                ...i,
                status_feedback: feedbackStatus,
                feedback: feedbackText,
                status: "finalized",
              }
            : i
        )
      );

      setFeedbackModalItem(null);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Feedback dan status tanggapan berhasil disimpan.",
        confirmButtonColor: "#550d07",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err?.message || "Terjadi kendala saat menyimpan feedback.",
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleDelete = (item: UnifiedTanggapanItem) => {
    Swal.fire({
      title: "Hapus Tanggapan Ini?",
      text: `Apakah Anda yakin ingin menghapus tanggapan dari ${item.nama_responden}? Tindakan ini tidak dapat dibatalkan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Hapus Data",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch("/api/backyard/tanggapan/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_response: item.id_response }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Gagal menghapus data");

          setItems((prev) =>
            prev.filter((i) => i.id_response !== item.id_response)
          );

          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "Data tanggapan berhasil dihapus dari sistem.",
            confirmButtonColor: "#550d07",
          });
        } catch (err: any) {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: err?.message || "Terjadi kesalahan saat menghapus data.",
          });
        }
      }
    });
  };

  return (
    <div>
      {/* Title & Header */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1 text-gray-800 font-weight-bold">
            Data Tanggapan Masyarakat
          </h1>
          <div className="text-muted small">
            Daftar seluruh masukan dan tanggapan pemilih (Baru, Ubah, TMS) dalam satu tempat.
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="backyard-filter-card mb-4">
        <div className="card-body p-3">
          <div className="backyard-filter-row">
            {/* 1. Search Input */}
            <div className="backyard-search-wrap">
              <i className="fas fa-search backyard-search-icon"></i>
              <input
                type="text"
                className="backyard-search-input"
                placeholder="Cari pelapor, NIK, pemilih..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="backyard-search-clear"
                  onClick={() => setSearchQuery("")}
                  title="Hapus pencarian"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            {/* 2. Filter Kategori */}
            <div>
              <select
                className="backyard-select font-weight-bold"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Semua Kategori ({countAll})</option>
                <option value="baru">Pemilih Baru ({countBaru})</option>
                <option value="ubah">Pemilih Ubah ({countUbah})</option>
                <option value="tms">Pemilih TMS ({countTms})</option>
              </select>
            </div>

            {/* 3. Filter Tahapan */}
            <div>
              <select
                className="backyard-select"
                value={tahapanFilter}
                onChange={(e) => setTahapanFilter(e.target.value)}
              >
                <option value="all">Semua Tahapan</option>
                {availableTahapan.map((t) => (
                  <option key={t} value={t}>
                    Tahapan: {t}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Filter Status Feedback */}
            <div>
              <select
                className="backyard-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status Feedback</option>
                <option value="diterima">Status: Diterima</option>
                <option value="tidak_diterima">Status: Tidak Diterima</option>
                <option value="ongoing">Status: Menunggu Tindak Lanjut</option>
              </select>
            </div>
          </div>

          {/* Filter Footer / Status */}
          {isFiltered && (
            <div className="backyard-filter-footer">
              <div>
                Menampilkan <strong>{filteredItems.length}</strong> dari <strong>{items.length}</strong> tanggapan
              </div>
              <button
                type="button"
                className="backyard-reset-btn"
                onClick={handleResetFilters}
              >
                <i className="fas fa-undo-alt mr-1"></i>
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-items-center table-hover table-flush mb-0">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "50px" }}>No</th>
                  <th>Tanggal & Tahapan</th>
                  <th>Kategori</th>
                  <th>Pelapor (Responden)</th>
                  <th>Data Pemilih Terkait</th>
                  <th>Status & Feedback</th>
                  <th className="text-center" style={{ width: "160px" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      <i className="fas fa-inbox fa-3x mb-3 text-gray-300 d-block"></i>
                      Tidak ada data tanggapan yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const waDigits = String(item.nomor_responden || "").replace(/\D/g, "");
                    return (
                      <tr key={item.id_response}>
                        <td className="font-weight-bold text-muted">{idx + 1}</td>
                        <td>
                          <div className="font-weight-bold text-dark small">
                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <span className="badge badge-light border text-muted small mt-1">
                            {item.tahapan || "-"}
                          </span>
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
                        <td>
                          <div className="font-weight-bold text-dark">{item.nama_responden}</div>
                          <div className="small text-muted">NIK: {item.nik_responden}</div>
                          {waDigits && (
                            <a
                              href={`https://wa.me/${waDigits}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-success small font-weight-bold"
                            >
                              <i className="fab fa-whatsapp mr-1"></i>
                              {item.nomor_responden}
                            </a>
                          )}
                        </td>
                        <td>
                          <div className="font-weight-bold text-dark">{item.pemilih.nama || "-"}</div>
                          <div className="small text-muted font-monospace">
                            NIK: {item.pemilih.nik || "-"}
                          </div>
                          {item.pemilih.kategori_tms && (
                            <div className="small text-danger font-weight-bold mt-1">
                              <i className="fas fa-exclamation-circle mr-1"></i>
                              {item.pemilih.kategori_tms}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="mb-1">
                            {item.status_feedback === "diterima" && (
                              <span className="badge badge-success">Diterima</span>
                            )}
                            {item.status_feedback === "tidak_diterima" && (
                              <span className="badge badge-danger">Tidak Diterima</span>
                            )}
                            {(!item.status_feedback || item.status === "ongoing") && (
                              <span className="badge badge-warning">Menunggu</span>
                            )}
                          </div>
                          {item.feedback && (
                            <div
                              className="small text-muted text-truncate"
                              style={{ maxWidth: "220px" }}
                              title={item.feedback}
                            >
                              {item.feedback}
                            </div>
                          )}
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            {/* Tombol Detail */}
                            <button
                              className="btn btn-outline-primary"
                              title="Lihat Detail Lengkap"
                              onClick={() => setDetailModalItem(item)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>

                            {/* Tombol Feedback */}
                            <button
                              className="btn btn-outline-warning text-dark font-weight-bold"
                              title="Beri Feedback"
                              onClick={() => handleOpenFeedback(item)}
                            >
                              <i className="fas fa-reply"></i>
                            </button>

                            {/* Tombol Cetak PDF */}
                            {item.file_output ? (
                              <a
                                href={`/storage/${item.file_output}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-success"
                                title="Unduh Formulir PDF"
                              >
                                <i className="fas fa-file-pdf"></i>
                              </a>
                            ) : (
                              <button
                                className="btn btn-outline-secondary"
                                title="PDF Belum Tersedia"
                                disabled
                              >
                                <i className="fas fa-file-pdf"></i>
                              </button>
                            )}

                            {/* Tombol Hapus */}
                            <button
                              className="btn btn-outline-danger"
                              title="Hapus Tanggapan"
                              onClick={() => handleDelete(item)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL 1: Detail Tanggapan */}
      {detailModalItem && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header text-white" style={{ backgroundColor: "#550d07" }}>
                <h5 className="modal-title font-weight-bold">
                  <i className="fas fa-info-circle mr-2"></i>
                  Detail Tanggapan ({detailModalItem.alasan_tanggapan.toUpperCase()})
                </h5>
                <button
                  type="button"
                  className="close text-white"
                  onClick={() => setDetailModalItem(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body p-4">
                {/* Bagian 1: Data Pelapor */}
                <h6 className="font-weight-bold text-dark border-bottom pb-2 mb-3">
                  <i className="fas fa-user mr-2 text-primary"></i>1. Identitas Pelapor (Responden)
                </h6>
                <div className="row mb-3 small">
                  <div className="col-sm-4 text-muted">Nama Pelapor:</div>
                  <div className="col-sm-8 font-weight-bold text-dark">{detailModalItem.nama_responden}</div>
                  <div className="col-sm-4 text-muted">NIK Pelapor:</div>
                  <div className="col-sm-8 text-dark">{detailModalItem.nik_responden}</div>
                  <div className="col-sm-4 text-muted">No. WhatsApp/Telp:</div>
                  <div className="col-sm-8 text-dark font-weight-bold text-success">
                    {detailModalItem.nomor_responden}
                  </div>
                  <div className="col-sm-4 text-muted">Email:</div>
                  <div className="col-sm-8 text-dark">{detailModalItem.email_responden || "-"}</div>
                  <div className="col-sm-4 text-muted">Alamat Pelapor:</div>
                  <div className="col-sm-8 text-dark">{detailModalItem.alamat_responden}</div>
                </div>

                {/* Scan KTP Pelapor & Tanda Tangan */}
                <div className="row mb-4">
                  {detailModalItem.file_scan_ktp_responden && (
                    <div className="col-md-6 mb-2">
                      <div className="border rounded p-2 text-center bg-light">
                        <div className="small font-weight-bold text-muted mb-2">Scan KTP Pelapor</div>
                        <a
                          href={`/storage/${detailModalItem.file_scan_ktp_responden}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`/storage/${detailModalItem.file_scan_ktp_responden}`}
                            alt="Scan KTP Pelapor"
                            style={{ maxHeight: 150, maxWidth: "100%", objectFit: "contain" }}
                            className="rounded border"
                          />
                        </a>
                      </div>
                    </div>
                  )}

                  {detailModalItem.file_ttd_responden && (
                    <div className="col-md-6 mb-2">
                      <div className="border rounded p-2 text-center bg-light">
                        <div className="small font-weight-bold text-muted mb-2">Tanda Tangan Digital</div>
                        <img
                          src={`/storage/${detailModalItem.file_ttd_responden}`}
                          alt="Tanda Tangan Digital"
                          style={{ maxHeight: 150, maxWidth: "100%", objectFit: "contain", backgroundColor: "#fff" }}
                          className="rounded border"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bagian 2: Data Pemilih Dilaporkan */}
                <h6 className="font-weight-bold text-dark border-bottom pb-2 mb-3">
                  <i className="fas fa-id-card mr-2 text-info"></i>2. Objek Pemilih yang Dilaporkan
                </h6>
                <div className="row mb-3 small">
                  <div className="col-sm-4 text-muted">Nama Pemilih:</div>
                  <div className="col-sm-8 font-weight-bold text-dark">{detailModalItem.pemilih.nama || "-"}</div>
                  <div className="col-sm-4 text-muted">NIK Pemilih:</div>
                  <div className="col-sm-8 text-dark">{detailModalItem.pemilih.nik || "-"}</div>
                  {detailModalItem.pemilih.kategori_tms && (
                    <>
                      <div className="col-sm-4 text-muted">Kategori TMS:</div>
                      <div className="col-sm-8 text-danger font-weight-bold">
                        {detailModalItem.pemilih.kategori_tms}
                      </div>
                    </>
                  )}
                  {detailModalItem.pemilih.alamat && (
                    <>
                      <div className="col-sm-4 text-muted">Alamat Tertera:</div>
                      <div className="col-sm-8 text-dark">
                        {detailModalItem.pemilih.alamat && detailModalItem.pemilih.alamat !== "-" ? `${detailModalItem.pemilih.alamat}, ` : ""}
                        {detailModalItem.alasan_tanggapan !== "tms" && detailModalItem.pemilih.rt && detailModalItem.pemilih.rt !== "-"
                          ? `RT ${detailModalItem.pemilih.rt} / RW ${detailModalItem.pemilih.rw || "-"}, `
                          : ""}
                        {detailModalItem.pemilih.kelurahan ? `KEL. ${detailModalItem.pemilih.kelurahan}, ` : ""}
                        {detailModalItem.pemilih.kecamatan ? `KEC. ${detailModalItem.pemilih.kecamatan}` : ""}
                      </div>
                    </>
                  )}
                </div>

                {/* Bagian 3: Berkas Bukti Pendukung */}
                {detailModalItem.evidences && (
                  <>
                    <h6 className="font-weight-bold text-dark border-bottom pb-2 mb-3">
                      <i className="fas fa-folder-open mr-2 text-warning"></i>3. Dokumen Lampiran Bukti
                    </h6>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {detailModalItem.evidences.file_scan_ktp && (
                        <a
                          href={`/storage/${detailModalItem.evidences.file_scan_ktp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-info mr-2 mb-2"
                        >
                          <i className="fas fa-file-image mr-1"></i>Lampiran KTP
                        </a>
                      )}
                      {detailModalItem.evidences.file_scan_kk && (
                        <a
                          href={`/storage/${detailModalItem.evidences.file_scan_kk}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-info mr-2 mb-2"
                        >
                          <i className="fas fa-file-image mr-1"></i>Lampiran KK
                        </a>
                      )}
                      {detailModalItem.evidences.file_scan_lain && (
                        <a
                          href={`/storage/${detailModalItem.evidences.file_scan_lain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-info mr-2 mb-2"
                        >
                          <i className="fas fa-file-alt mr-1"></i>Surat Keterangan / Lainnya
                        </a>
                      )}
                    </div>
                  </>
                )}

                {/* Bagian 4: Status Feedback & Output */}
                <h6 className="font-weight-bold text-dark border-bottom pb-2 mb-3">
                  <i className="fas fa-check-circle mr-2 text-success"></i>4. Status Tindak Lanjut KPU
                </h6>
                <div className="row small">
                  <div className="col-sm-4 text-muted">Status:</div>
                  <div className="col-sm-8">
                    {detailModalItem.status_feedback === "diterima" && (
                      <span className="badge badge-success">Diterima</span>
                    )}
                    {detailModalItem.status_feedback === "tidak_diterima" && (
                      <span className="badge badge-danger">Tidak Diterima</span>
                    )}
                    {!detailModalItem.status_feedback && (
                      <span className="badge badge-warning">Menunggu Tindak Lanjut</span>
                    )}
                  </div>
                  <div className="col-sm-4 text-muted mt-2">Catatan Feedback:</div>
                  <div className="col-sm-8 mt-2 text-dark font-italic">
                    {detailModalItem.feedback || "Belum ada catatan feedback yang diberikan."}
                  </div>
                  {detailModalItem.file_output && (
                    <>
                      <div className="col-sm-4 text-muted mt-2">Formulir PDF Resmi:</div>
                      <div className="col-sm-8 mt-2">
                        <a
                          href={`/storage/${detailModalItem.file_output}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-success font-weight-bold"
                        >
                          <i className="fas fa-download mr-1"></i>Buka Formulir Tanggapan PDF
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary font-weight-bold"
                  onClick={() => setDetailModalItem(null)}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  className="btn btn-warning text-dark font-weight-bold"
                  onClick={() => {
                    const it = detailModalItem;
                    setDetailModalItem(null);
                    handleOpenFeedback(it);
                  }}
                >
                  <i className="fas fa-reply mr-1"></i>Beri / Ubah Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Form Beri Feedback */}
      {feedbackModalItem && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header text-white" style={{ backgroundColor: "#550d07" }}>
                <h5 className="modal-title font-weight-bold">
                  <i className="fas fa-reply mr-2"></i>Beri Feedback Tanggapan
                </h5>
                <button
                  type="button"
                  className="close text-white"
                  onClick={() => setFeedbackModalItem(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3 small">
                  Pelapor: <strong>{feedbackModalItem.nama_responden}</strong> (NIK: {feedbackModalItem.nik_responden})
                </div>

                <div className="form-group mb-3">
                  <label className="font-weight-bold small text-muted">Keputusan Feedback:</label>
                  <div className="d-flex gap-3">
                    <div className="custom-control custom-radio mr-3">
                      <input
                        type="radio"
                        id="fbDiterima"
                        name="feedbackStatusRadio"
                        className="custom-control-input"
                        checked={feedbackStatus === "diterima"}
                        onChange={() => setFeedbackStatus("diterima")}
                      />
                      <label className="custom-control-label text-success font-weight-bold" htmlFor="fbDiterima">
                        <i className="fas fa-check mr-1"></i>Diterima
                      </label>
                    </div>

                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        id="fbDitolak"
                        name="feedbackStatusRadio"
                        className="custom-control-input"
                        checked={feedbackStatus === "tidak_diterima"}
                        onChange={() => setFeedbackStatus("tidak_diterima")}
                      />
                      <label className="custom-control-label text-danger font-weight-bold" htmlFor="fbDitolak">
                        <i className="fas fa-times mr-1"></i>Tidak Diterima
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="font-weight-bold small text-muted">Catatan Respon / Feedback KPU:</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tuliskan catatan tindak lanjut atau alasan penolakan berkas..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary font-weight-bold"
                  onClick={() => setFeedbackModalItem(null)}
                  disabled={submittingFeedback}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-primary font-weight-bold"
                  onClick={handleSaveFeedback}
                  disabled={submittingFeedback}
                >
                  {submittingFeedback ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-1"></i>Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-1"></i>Simpan Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
