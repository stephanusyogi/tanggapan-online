"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export interface AdminRow {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  created_at: string;
}

interface AdminClientProps {
  initialAdmins: AdminRow[];
  currentAdminId: number;
}

export default function AdminClient({
  initialAdmins,
  currentAdminId,
}: AdminClientProps) {
  const [admins, setAdmins] = useState<AdminRow[]>(initialAdmins);
  const [generating, setGenerating] = useState<boolean>(false);
  const [generatedUrl, setGeneratedUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerateUrl = async () => {
    setGenerating(true);
    setCopied(false);
    try {
      const res = await fetch("/api/backyard/admin/generate-token", {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal membuat URL registrasi.");

      setGeneratedUrl(json.registerUrl);
      Swal.fire({
        icon: "success",
        title: "URL Berhasil Dibuat!",
        text: "Tautan registrasi admin aktif selama 24 jam. Kirimkan tautan ini kepada calon admin.",
        confirmButtonColor: "#550d07",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err?.message || "Terjadi kesalahan saat generate URL.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyUrl = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDelete = (admin: AdminRow) => {
    if (admin.id === currentAdminId) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.",
      });
      return;
    }

    Swal.fire({
      title: "Hapus Admin Ini?",
      text: `Apakah Anda yakin ingin menghapus hak akses admin ${admin.name} (${admin.email})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Hapus Admin",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch("/api/backyard/admin/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: admin.id }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Gagal menghapus admin");

          setAdmins((prev) => prev.filter((a) => a.id !== admin.id));

          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "Akun admin berhasil dihapus dari sistem.",
            confirmButtonColor: "#550d07",
          });
        } catch (err: any) {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: err?.message || "Terjadi kesalahan saat menghapus admin.",
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
            Manajemen Administrator
          </h1>
          <div className="text-muted small">
            Daftar pengelola akun Tangmas KPU Kabupaten Ngawi dan pembuatan tautan registrasi admin baru.
          </div>
        </div>
      </div>

      {/* Generate Invitation URL Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-header py-3 bg-white">
          <h6 className="m-0 font-weight-bold text-gray-800">
            <i className="fas fa-user-plus mr-2 text-primary"></i>Undang Administrator Baru
          </h6>
        </div>
        <div className="card-body">
          <p className="small text-muted mb-3">
            Hasilkan tautan khusus registrasi admin. Calon admin yang membuka tautan tersebut akan diminta masuk menggunakan akun Google resmi dan otomatis terdaftar sebagai administrator Tangmas. Tautan berlaku selama 24 jam.
          </p>

          <button
            className="btn btn-primary font-weight-bold mb-3"
            onClick={handleGenerateUrl}
            disabled={generating}
          >
            {generating ? (
              <>
                <i className="fas fa-spinner fa-spin mr-1"></i>Membuat Tautan...
              </>
            ) : (
              <>
                <i className="fas fa-link mr-1"></i>Generate URL Register Admin
              </>
            )}
          </button>

          {generatedUrl && (
            <div className="p-3 bg-light rounded border">
              <label className="font-weight-bold small text-muted">Tautan Registrasi (Berlaku 24 Jam):</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control font-monospace bg-white"
                  readOnly
                  value={generatedUrl}
                />
                <div className="input-group-append">
                  <button
                    className={`btn ${copied ? "btn-success" : "btn-outline-primary"}`}
                    onClick={handleCopyUrl}
                    type="button"
                  >
                    {copied ? (
                      <>
                        <i className="fas fa-check mr-1"></i>Tersalin!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-copy mr-1"></i>Salin Tautan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin List Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-header py-3 bg-white">
          <h6 className="m-0 font-weight-bold text-gray-800">
            <i className="fas fa-users mr-2 text-info"></i>Daftar Administrator Terdaftar ({admins.length})
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-items-center table-hover table-flush mb-0">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "50px" }}>ID</th>
                  <th>Profil & Nama</th>
                  <th>Email Google</th>
                  <th>Tanggal Terdaftar</th>
                  <th className="text-center" style={{ width: "120px" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((adm) => {
                  const isCurrent = adm.id === currentAdminId;
                  return (
                    <tr key={adm.id}>
                      <td className="font-weight-bold text-muted">{adm.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-user-circle fa-2x mr-2 text-gray-400"></i>
                          <div>
                            <div className="font-weight-bold text-dark">{adm.name}</div>
                            {isCurrent && (
                              <span className="badge badge-success small">Anda (Sedang Login)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="font-monospace text-dark">{adm.email}</td>
                      <td className="small text-muted">
                        {adm.created_at
                          ? new Date(adm.created_at).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Hapus Hak Akses Admin"
                          onClick={() => handleDelete(adm)}
                          disabled={isCurrent}
                        >
                          <i className="fas fa-trash-alt mr-1"></i>Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
