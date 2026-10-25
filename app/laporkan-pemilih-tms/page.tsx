"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import SignaturePadComponent, { SignaturePadHandle } from "@/components/SignaturePadComponent";
import { useTTS } from "@/lib/useTTS";

interface VoterRecord {
  nik: string;
  nkk: string;
  nama: string;
  kelamin: string;
  kecamatan: string;
  kelurahan: string;
  tps: string;
  alamat: string;
  rt: string;
  rw: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  status_kawin: string;
}

const TMS_OPTIONS = [
  { value: "MENINGGAL", label: "MENINGGAL (1)", note: "Sertakan Surat Kematian dari Desa/Kelurahan atau Akta Kematian dari Dukcapil." },
  { value: "GANDA", label: "GANDA (2)", note: "Sertakan bukti dokumen kependudukan yang menunjukkan identitas ganda." },
  { value: "DI BAWAH UMUR", label: "DI BAWAH UMUR (3)", note: "Sertakan Kartu Keluarga / Akta Kelahiran yang membuktikan usia di bawah 17 tahun dan belum menikah." },
  { value: "PINDAH DOMISILI", label: "PINDAH DOMISILI (4)", note: "Sertakan Surat Keterangan Pindah Warga Negara Indonesia (SKPWNI) atau KK baru." },
  { value: "WNA", label: "WNA (5)", note: "Sertakan bukti dokumen kewarganegaraan asing." },
  { value: "TNI", label: "TNI (6)", note: "Sertakan KTA TNI atau Surat Keputusan Pengangkatan TNI aktif." },
  { value: "POLRI", label: "POLRI (7)", note: "Sertakan KTA POLRI atau Surat Keputusan Pengangkatan POLRI aktif." },
  { value: "HAK POLITIK DICABUT", label: "HAK POLITIK DICABUT (8)", note: "Sertakan Salinan Putusan Pengadilan berkekuatan hukum tetap." },
];

function PemilihTmsContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Initial Voter Lookup State
  const [voter, setVoter] = useState<VoterRecord | null>(null);
  const [lookupNik, setLookupNik] = useState<string>("");
  const [lookupKk, setLookupKk] = useState<string>("");

  // Step 1: Alasan TMS
  const [alasanTms, setAlasanTms] = useState<string>("");

  // Files - Step 2
  const [kkFile, setKkFile] = useState<File | null>(null);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [buktiLainFile, setBuktiLainFile] = useState<File | null>(null);

  // Form Fields - Step 3: Pelapor
  const [responderName, setResponderName] = useState<string>("");
  const [responderNik, setResponderNik] = useState<string>("");
  const [responderAddress, setResponderAddress] = useState<string>("");
  const [responderContact, setResponderContact] = useState<string>("");
  const [responderEmail, setResponderEmail] = useState<string>("");
  const [ktpPelaporFile, setKtpPelaporFile] = useState<File | null>(null);
  const [signatureData, setSignatureData] = useState<string>("");

  const sigPadRef = useRef<SignaturePadHandle>(null);
  const { ttsEnabled, toggleTts, speakAlert, handleNumericInput } = useTTS();

  // Perform Voter Check
  const checkVoter = async (nikToSearch: string, kkToSearch: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/voter-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nik: nikToSearch, kk: kkToSearch }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.alreadyReported) {
        speakAlert(data.message);
        await Swal.fire({
          icon: "warning",
          title: "NIK Telah Dilaporkan",
          text: data.message,
          confirmButtonText: "Kembali ke Beranda",
          confirmButtonColor: "#007bff",
        });
        window.location.href = "/";
        return;
      }

      if (data.notFound) {
        speakAlert("Data pemilih tidak ditemukan di DPT KPU Ngawi.");
        await Swal.fire({
          icon: "warning",
          title: "Data Tidak Ditemukan",
          text: "NIK pemilih tidak ditemukan dalam Daftar Pemilih Tetap (DPT) KPU Kabupaten Ngawi.",
          confirmButtonColor: "#dc3545",
        });
        return;
      }

      if (data.success && data.voter) {
        setVoter(data.voter);
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengambil Data",
          text: data.message || "Terjadi kesalahan saat memeriksa data pemilih.",
        });
      }
    } catch (err: any) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Kesalahan Sistem",
        text: err.message || "Gagal menghubungi server.",
      });
    }
  };

  // Check URL params on mount
  useEffect(() => {
    const paramNik = searchParams.get("nik")?.trim() || "";
    const paramKk = searchParams.get("kk")?.trim() || "";

    if (paramNik && paramNik.length === 16) {
      setLookupNik(paramNik);
      setLookupKk(paramKk);
      checkVoter(paramNik, paramKk);
    }
  }, [searchParams]);

  const previewFile = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  // Navigation: Step 1 -> Step 2
  const handleStep1Next = () => {
    if (!alasanTms) {
      Swal.fire({
        icon: "error",
        title: "Alasan TMS Wajib Dipilih!",
        text: "Silakan pilih salah satu dari 8 kategori Tidak Memenuhi Syarat (TMS).",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      speakAlert("Silakan unggah dokumen pendukung seperti surat kematian atau bukti TMS lainnya.");
    }, 400);
  };

  // Navigation: Step 2 -> Step 3
  const handleStep2Next = () => {
    if (!kkFile) {
      Swal.fire({ icon: "error", title: "File KK Wajib Diunggah!" });
      return;
    }
    if (!ktpFile) {
      Swal.fire({ icon: "error", title: "File KTP Wajib Diunggah!" });
      return;
    }
    if (!buktiLainFile) {
      Swal.fire({
        icon: "error",
        title: "Bukti Dukung TMS Wajib Diunggah!",
        text: "Harap sertakan bukti pendukung (cth: Surat Kematian, SK Pindah, KTA TNI/POLRI, Putusan Pengadilan).",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      speakAlert("Silakan isi identitas pelapor dan bubuhkan tanda tangan digital.");
    }, 400);
  };

  // Navigation: Step 3 -> Step 4
  const handleStep3Next = () => {
    if (!responderName.trim()) {
      Swal.fire({ icon: "error", title: "Nama Pelapor Wajib Diisi!" });
      return;
    }
    if (responderNik.length !== 16) {
      Swal.fire({ icon: "error", title: "NIK Pelapor harus 16 digit angka!" });
      return;
    }
    if (!responderAddress.trim()) {
      Swal.fire({ icon: "error", title: "Alamat Pelapor Wajib Diisi!" });
      return;
    }
    if (responderContact.length < 9) {
      Swal.fire({ icon: "error", title: "Nomor WhatsApp Pelapor harus valid (10-15 digit)!" });
      return;
    }
    if (!responderEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(responderEmail)) {
      Swal.fire({ icon: "error", title: "Email Pelapor tidak valid!" });
      return;
    }
    if (!ktpPelaporFile) {
      Swal.fire({ icon: "error", title: "File KTP Pelapor Wajib Diunggah!" });
      return;
    }
    if (sigPadRef.current?.isEmpty() || !signatureData) {
      Swal.fire({
        icon: "error",
        title: "Tanda Tangan Pelapor Wajib Diisi!",
        text: "Harap membubuhkan tanda tangan digital pada area yang disediakan.",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
      speakAlert("Silakan periksa kembali seluruh data pada halaman verifikasi sebelum mengirim laporan.");
    }, 400);
  };

  // Submit Laporan TMS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const swalRes = await Swal.fire({
      title: "Konfirmasi Laporan Pemilih TMS",
      text: "Apakah Anda yakin seluruh data pelaporan pemilih Tidak Memenuhi Syarat (TMS) sudah benar dan siap dikirim?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim Laporan!",
      cancelButtonText: "Periksa Lagi",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!swalRes.isConfirmed) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("original_nik", voter?.nik || lookupNik);
      fd.append("original_nkk", voter?.nkk || lookupKk);
      fd.append("original_nama", voter?.nama || "");
      fd.append("original_tempat_lahir", voter?.tempat_lahir || "NGAWI");
      fd.append("original_tanggal_lahir", voter?.tanggal_lahir || "");
      fd.append("original_alamat", voter?.alamat || "");
      fd.append("original_rt", voter?.rt || "");
      fd.append("original_rw", voter?.rw || "");
      fd.append("original_kelurahan", voter?.kelurahan || "");
      fd.append("original_kecamatan", voter?.kecamatan || "");
      fd.append("original_status_kawin", voter?.status_kawin || "B");
      fd.append("original_jenis_kelamin", voter?.kelamin || "L");

      fd.append("alasan_tidak_memenuhi_syarat", alasanTms);

      if (kkFile) fd.append("kk_file", kkFile);
      if (ktpFile) fd.append("ktp_file", ktpFile);
      if (buktiLainFile) fd.append("bukti_lain", buktiLainFile);

      fd.append("responder_name", responderName);
      fd.append("responder_nik", responderNik);
      fd.append("responder_address", responderAddress);
      fd.append("responder_contact", responderContact);
      fd.append("responder_email", responderEmail);
      if (ktpPelaporFile) fd.append("ktp_pelapor", ktpPelaporFile);
      fd.append("signature_data", signatureData);

      const res = await fetch("/api/laporkan-pemilih-tms", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      setLoading(false);

      if (json.success) {
        speakAlert("Laporan pemilih tidak memenuhi syarat berhasil terkirim. Terima kasih atas partisipasi Anda.");
        await Swal.fire({
          icon: "success",
          title: "Laporan Berhasil Terkirim!",
          html: "Tanggapan masyarakat untuk <strong>Pemilih Tidak Memenuhi Syarat (TMS)</strong> telah berhasil dikirim ke KPU Kabupaten Ngawi.<br>Terima kasih atas partisipasi Anda.",
          confirmButtonColor: "#28a745",
        });

        window.location.href = "/";
      } else {
        Swal.fire({
          icon: "error",
          title: "Pengiriman Gagal",
          text: json.message || "Terjadi kesalahan saat menyimpan tanggapan.",
        });
      }
    } catch (err: any) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Kesalahan Sistem",
        text: err.message || "Terjadi kesalahan koneksi ke server.",
      });
    }
  };

  const selectedTmsDetail = TMS_OPTIONS.find((t) => t.value === alasanTms);

  return (
    <div className="container">
      {/* Fullscreen Loader */}
      {loading && (
        <div className="loader-wrapper">
          <div className="loader" />
          <div className="dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      )}

      {/* Header Logo */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Image
          src="/images/logo-kpu-ngawi.png"
          alt="Logo KPU Ngawi"
          width={90}
          height={90}
          className="logo-kpu"
          priority
        />
        <h1 style={{ marginTop: 10 }}>
          Formulir Tanggapan Masyarakat <br /> KPU Kabupaten Ngawi
        </h1>
        <p className="subtitle" style={{ fontWeight: 600, color: "#dc3545" }}>
          Laporkan Pemilih Tidak Memenuhi Syarat (TMS) {voter ? `(Langkah ${step} dari 4)` : ""}
        </p>
      </div>

      {/* Lookup Card jika belum ada Voter */}
      {!voter ? (
        <div className="form-container">
          <div className="alert alert-info">
            Masukkan Nomor Kartu Keluarga (KK) dan NIK pemilih yang ingin dilaporkan TMS untuk memuat data dari DPT KPU Ngawi.
          </div>

          <div className="input-group">
            <label htmlFor="lookup_kk">Nomor Kartu Keluarga (KK):</label>
            <input
              type="text"
              id="lookup_kk"
              placeholder="Masukkan 16 Digit No. KK"
              maxLength={16}
              value={lookupKk}
              onChange={(e) => setLookupKk(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <div className="input-group">
            <label htmlFor="lookup_nik">Nomor Induk Kependudukan (NIK):</label>
            <input
              type="text"
              id="lookup_nik"
              placeholder="Masukkan 16 Digit NIK"
              maxLength={16}
              value={lookupNik}
              onChange={(e) => setLookupNik(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <div className="form-buttons">
            <Link href="/" className="btn btn-back">
              Kembali
            </Link>
            <button
              type="button"
              className="btn btn-next"
              style={{ backgroundColor: "#dc3545" }}
              onClick={() => {
                if (lookupNik.length !== 16 || lookupKk.length !== 16) {
                  Swal.fire({
                    icon: "error",
                    title: "Perhatian",
                    text: "No. KK dan NIK harus berupa 16 digit angka!",
                  });
                  return;
                }
                checkVoter(lookupNik, lookupKk);
              }}
            >
              Cari Data Pemilih
            </button>
          </div>
        </div>
      ) : (
        <div className="form-container">
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* ========================================================
                STEP 1: PILIH ALASAN TMS & REVIEW IDENTITAS
               ======================================================== */}
            {step === 1 && (
              <div id="formSection">
                <div className="input-group">
                  <label htmlFor="alasan_tidak_memenuhi_syarat">
                    Alasan Tidak Memenuhi Syarat (TMS):
                  </label>
                  <select
                    id="alasan_tidak_memenuhi_syarat"
                    value={alasanTms}
                    onChange={(e) => setAlasanTms(e.target.value)}
                    required
                  >
                    <option value="" disabled>PILIH KATEGORI TMS</option>
                    {TMS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {selectedTmsDetail && (
                    <small
                      className="description"
                      style={{
                        textAlign: "left",
                        marginTop: 6,
                        display: "block",
                        color: "#dc3545",
                        fontWeight: 600,
                      }}
                    >
                      * Petunjuk: {selectedTmsDetail.note}
                    </small>
                  )}
                </div>

                <hr style={{ margin: "20px 0" }} />

                <h4 style={{ marginBottom: 12, fontSize: 15, fontWeight: 700 }}>
                  Data Pemilih yang Dilaporkan:
                </h4>
                <table className="verification-table">
                  <tbody>
                    <tr>
                      <td>Nomor KK</td>
                      <td>{voter.nkk}</td>
                    </tr>
                    <tr>
                      <td>NIK Pemilih</td>
                      <td>{voter.nik}</td>
                    </tr>
                    <tr>
                      <td>Nama Pemilih</td>
                      <td>{voter.nama}</td>
                    </tr>
                    <tr>
                      <td>Tempat, Tanggal Lahir</td>
                      <td>
                        {voter.tempat_lahir || "NGAWI"}, {voter.tanggal_lahir || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td>Alamat</td>
                      <td>
                        {voter.alamat && voter.alamat !== "-" ? `${voter.alamat}, ` : ""}KEL. {voter.kelurahan}, KEC. {voter.kecamatan}
                      </td>
                    </tr>
                    <tr>
                      <td>Jenis Kelamin</td>
                      <td>{voter.kelamin === "P" ? "PEREMPUAN" : "LAKI-LAKI"}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="form-buttons">
                  <Link href="/" className="btn btn-back">
                    Kembali
                  </Link>
                  <button
                    type="button"
                    className="btn btn-next"
                    style={{ backgroundColor: "#dc3545" }}
                    onClick={handleStep1Next}
                  >
                    Lanjut
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                STEP 2: UPLOAD BERKAS BUKTI TMS
               ======================================================== */}
            {step === 2 && (
              <div id="fileSection">
                <div className="alert alert-info">
                  <strong>Ketentuan Berkas:</strong> File berukuran maksimal 2MB per file dengan format JPG, JPEG, PNG, atau PDF.
                </div>

                <div className="input-group">
                  <label htmlFor="kk_file">File Kartu Keluarga (KK):</label>
                  <input
                    type="file"
                    id="kk_file"
                    accept=".jpg, .jpeg, .png, .pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      if (f && f.size > 2.5 * 1024 * 1024) {
                        Swal.fire({ icon: "error", title: "Ukuran File Terlalu Besar (Maks 2MB)!" });
                        e.target.value = "";
                        return;
                      }
                      setKkFile(f);
                    }}
                    required
                  />
                  {kkFile && (
                    <button
                      type="button"
                      className="viewFileButtons"
                      onClick={() => previewFile(kkFile)}
                    >
                      <i className="fas fa-eye" style={{ marginRight: 6 }} />
                      Lihat File KK ({kkFile.name})
                    </button>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="ktp_file">File KTP Pemilih:</label>
                  <input
                    type="file"
                    id="ktp_file"
                    accept=".jpg, .jpeg, .png, .pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      if (f && f.size > 2.5 * 1024 * 1024) {
                        Swal.fire({ icon: "error", title: "Ukuran File Terlalu Besar (Maks 2MB)!" });
                        e.target.value = "";
                        return;
                      }
                      setKtpFile(f);
                    }}
                    required
                  />
                  {ktpFile && (
                    <button
                      type="button"
                      className="viewFileButtons"
                      onClick={() => previewFile(ktpFile)}
                    >
                      <i className="fas fa-eye" style={{ marginRight: 6 }} />
                      Lihat File KTP ({ktpFile.name})
                    </button>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="bukti_lain">
                    Bukti Dukung TMS ({selectedTmsDetail?.label || "Wajib"}):
                  </label>
                  <input
                    type="file"
                    id="bukti_lain"
                    accept=".jpg, .jpeg, .png, .pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      if (f && f.size > 2.5 * 1024 * 1024) {
                        Swal.fire({ icon: "error", title: "Ukuran File Terlalu Besar (Maks 2MB)!" });
                        e.target.value = "";
                        return;
                      }
                      setBuktiLainFile(f);
                    }}
                    required
                  />
                  {buktiLainFile && (
                    <button
                      type="button"
                      className="viewFileButtons"
                      onClick={() => previewFile(buktiLainFile)}
                    >
                      <i className="fas fa-eye" style={{ marginRight: 6 }} />
                      Lihat Bukti Dukung ({buktiLainFile.name})
                    </button>
                  )}
                  <small className="description" style={{ textAlign: "left", marginTop: 6, display: "block" }}>
                    {selectedTmsDetail?.note || "Sertakan dokumen resmi pendukung laporan TMS."}
                  </small>
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="btn btn-back"
                    onClick={() => setStep(1)}
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    className="btn btn-next"
                    style={{ backgroundColor: "#dc3545" }}
                    onClick={handleStep2Next}
                  >
                    Lanjut
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                STEP 3: IDENTITAS PELAPOR & TANDA TANGAN
               ======================================================== */}
            {step === 3 && (
              <div id="formResponden">
                <div className="input-group">
                  <label htmlFor="responder_name">Nama Pelapor / Responden:</label>
                  <input
                    type="text"
                    id="responder_name"
                    placeholder="Masukkan Nama Pelapor Sesuai KTP"
                    value={responderName}
                    onChange={(e) => setResponderName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="responder_nik">NIK Pelapor:</label>
                  <input
                    type="text"
                    id="responder_nik"
                    placeholder="Masukkan 16 Digit NIK Pelapor"
                    maxLength={16}
                    value={responderNik}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      handleNumericInput(val, responderNik, "NIK Pelapor");
                      setResponderNik(val);
                    }}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="responder_address">Alamat Pelapor:</label>
                  <input
                    type="text"
                    id="responder_address"
                    placeholder="Masukkan Alamat Pelapor Sesuai KTP"
                    value={responderAddress}
                    onChange={(e) => setResponderAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="responder_contact">Nomor WhatsApp Pelapor:</label>
                  <div className="input-group-contact">
                    <div className="input-group-prepend">
                      <span className="input-group-text">+62</span>
                    </div>
                    <input
                      type="text"
                      id="responder_contact"
                      placeholder="8xxxxxxxxxx"
                      maxLength={14}
                      value={responderContact}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "");
                        if (val.startsWith("62")) val = val.slice(2);
                        if (val.startsWith("0")) val = val.slice(1);
                        setResponderContact(val);
                      }}
                      required
                    />
                  </div>
                  <small className="description" style={{ textAlign: "left", marginTop: 4, display: "block" }}>
                    Masukkan nomor WhatsApp aktif untuk konfirmasi tindak lanjut.
                  </small>
                </div>

                <div className="input-group">
                  <label htmlFor="responder_email">Email Pelapor:</label>
                  <input
                    type="email"
                    id="responder_email"
                    placeholder="nama@email.com"
                    value={responderEmail}
                    onChange={(e) => setResponderEmail(e.target.value)}
                    required
                  />
                  <small className="description" style={{ textAlign: "left", marginTop: 4, display: "block" }}>
                    Pastikan email valid. Cek folder inbox/spam secara berkala maksimal 3x24 jam.
                  </small>
                </div>

                <div className="input-group">
                  <label htmlFor="ktp_pelapor">Scan / Foto KTP Pelapor:</label>
                  <input
                    type="file"
                    id="ktp_pelapor"
                    accept=".jpg, .jpeg, .png, .pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      if (f && f.size > 2.5 * 1024 * 1024) {
                        Swal.fire({ icon: "error", title: "Ukuran File Terlalu Besar (Maks 2MB)!" });
                        e.target.value = "";
                        return;
                      }
                      setKtpPelaporFile(f);
                    }}
                    required
                  />
                  {ktpPelaporFile && (
                    <button
                      type="button"
                      className="viewFileButtons"
                      onClick={() => previewFile(ktpPelaporFile)}
                    >
                      <i className="fas fa-eye" style={{ marginRight: 6 }} />
                      Lihat KTP Pelapor ({ktpPelaporFile.name})
                    </button>
                  )}
                </div>

                <div className="input-group">
                  <label>Tanda Tangan Digital Pelapor:</label>
                  <SignaturePadComponent
                    ref={sigPadRef}
                    initialData={signatureData}
                    onChange={(dataUrl) => setSignatureData(dataUrl)}
                  />
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="btn btn-back"
                    onClick={() => setStep(2)}
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    className="btn btn-next"
                    style={{ backgroundColor: "#dc3545" }}
                    onClick={handleStep3Next}
                  >
                    Verifikasi Tanggapan
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                STEP 4: VERIFIKASI & SUBMIT
               ======================================================== */}
            {step === 4 && (
              <div id="verificationSection">
                <div className="alert alert-info">
                  Periksa kembali data yang telah Anda masukkan. Pastikan semua informasi sudah benar sebelum menekan tombol Submit.
                </div>

                <h3 className="verification-title">
                  Verifikasi Tanggapan Masyarakat - Pemilih TMS
                </h3>

                <table className="verification-table">
                  <tbody>
                    <tr>
                      <td>Kategori TMS</td>
                      <td style={{ color: "#dc3545", fontWeight: 700 }}>
                        {selectedTmsDetail?.label || alasanTms}
                      </td>
                    </tr>
                    <tr>
                      <td>Nama Pemilih</td>
                      <td>{voter.nama}</td>
                    </tr>
                    <tr>
                      <td>Nomor KK Pemilih</td>
                      <td>{voter.nkk}</td>
                    </tr>
                    <tr>
                      <td>NIK Pemilih</td>
                      <td>{voter.nik}</td>
                    </tr>
                    <tr>
                      <td>Alamat Pemilih</td>
                      <td>
                        {voter.alamat && voter.alamat !== "-" ? `${voter.alamat}, ` : ""}KEL. {voter.kelurahan}, KEC. {voter.kecamatan}
                      </td>
                    </tr>
                    <tr>
                      <td>File KK</td>
                      <td>
                        {kkFile ? (
                          <button
                            type="button"
                            className="viewFileButtons"
                            onClick={() => previewFile(kkFile)}
                          >
                            Lihat File KK
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>File KTP Pemilih</td>
                      <td>
                        {ktpFile ? (
                          <button
                            type="button"
                            className="viewFileButtons"
                            onClick={() => previewFile(ktpFile)}
                          >
                            Lihat File KTP
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Bukti Dukung TMS</td>
                      <td>
                        {buktiLainFile ? (
                          <button
                            type="button"
                            className="viewFileButtons"
                            onClick={() => previewFile(buktiLainFile)}
                          >
                            Lihat Bukti Dukung
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={2}
                        style={{
                          backgroundColor: "#eee",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        DATA PELAPOR / RESPONDEN
                      </td>
                    </tr>
                    <tr>
                      <td>Nama Pelapor</td>
                      <td>{responderName.toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td>NIK Pelapor</td>
                      <td>{responderNik}</td>
                    </tr>
                    <tr>
                      <td>Alamat Pelapor</td>
                      <td>{responderAddress.toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td>Nomor WhatsApp</td>
                      <td>+62{responderContact}</td>
                    </tr>
                    <tr>
                      <td>Email Pelapor</td>
                      <td>{responderEmail.toLowerCase()}</td>
                    </tr>
                    <tr>
                      <td>File KTP Pelapor</td>
                      <td>
                        {ktpPelaporFile ? (
                          <button
                            type="button"
                            className="viewFileButtons"
                            onClick={() => previewFile(ktpPelaporFile)}
                          >
                            Lihat KTP Pelapor
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Tanda Tangan Preview */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ textAlign: "center", fontSize: 13 }}>
                    <p>
                      Ngawi,{" "}
                      {new Date().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {signatureData && (
                      <img
                        src={signatureData}
                        alt="Tanda Tangan Pelapor"
                        style={{
                          maxWidth: 180,
                          height: "auto",
                          margin: "10px auto",
                          display: "block",
                        }}
                      />
                    )}
                    <p style={{ fontWeight: 600 }}>({responderName.toUpperCase()})</p>
                  </div>
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="btn btn-back"
                    onClick={() => setStep(3)}
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="btn btn-submit"
                    style={{ backgroundColor: "#dc3545" }}
                  >
                    <i className="fas fa-paper-plane" style={{ marginRight: 6 }} />
                    Submit Tanggapan TMS
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Floating Audio Button */}
      <button
        type="button"
        className="floating-btn"
        id="ttsToggle"
        onClick={toggleTts}
        aria-label="Toggle Fitur Suara"
      >
        <i
          className={`fas ${ttsEnabled ? "fa-volume-mute" : "fa-volume-up"} floating-icon`}
        />
      </button>
    </div>
  );
}

export default function PemilihTmsPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ textAlign: "center", padding: 50 }}>
          <p>Memuat formulir pemilih tidak memenuhi syarat...</p>
        </div>
      }
    >
      <PemilihTmsContent />
    </Suspense>
  );
}
