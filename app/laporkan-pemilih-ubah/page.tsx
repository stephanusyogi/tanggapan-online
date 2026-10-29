"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import SignaturePadComponent, { SignaturePadHandle } from "@/components/SignaturePadComponent";
import Turnstile, { TurnstileHandle } from "@/components/Turnstile";
import { useTTS } from "@/lib/useTTS";

interface WilayahData {
  kecamatan: { id: number; nama: string }[];
  desaByKec: Record<string, { id: number; kec_id: number; nama: string }[]>;
}

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

function PemilihUbahContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [wilayah, setWilayah] = useState<WilayahData | null>(null);

  // Initial Voter Lookup State
  const [voter, setVoter] = useState<VoterRecord | null>(null);
  const [lookupNik, setLookupNik] = useState<string>("");
  const [lookupKk, setLookupKk] = useState<string>("");

  // Form Fields - Step 1: Ubah Data Pemilih
  const [nameUbah, setNameUbah] = useState<string>("");
  const [kkUbah, setKkUbah] = useState<string>("");
  const [nikUbah, setNikUbah] = useState<string>("");
  const [placeOfBirthUbah, setPlaceOfBirthUbah] = useState<string>("");
  const [dateOfBirthUbah, setDateOfBirthUbah] = useState<string>("");
  const [maritalStatusUbah, setMaritalStatusUbah] = useState<string>("");
  const [genderUbah, setGenderUbah] = useState<string>("");
  const [addressUbah, setAddressUbah] = useState<string>("");
  const [rtUbah, setRtUbah] = useState<string>("");
  const [rwUbah, setRwUbah] = useState<string>("");
  const [kecamatanUbah, setKecamatanUbah] = useState<string>("");
  const [kelurahanUbah, setKelurahanUbah] = useState<string>("");

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
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const sigPadRef = useRef<SignaturePadHandle>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const { ttsEnabled, toggleTts, speakAlert, handleNumericInput } = useTTS();

  // Load Wilayah
  useEffect(() => {
    fetch("/api/wilayah")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWilayah({
            kecamatan: data.kecamatan,
            desaByKec: data.desaByKec,
          });
        }
      })
      .catch((err) => console.error("Gagal load wilayah:", err));
  }, []);

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
        speakAlert("Data pemilih tidak ditemukan. Anda dapat melaporkan sebagai pemilih baru.");
        const swalRes = await Swal.fire({
          icon: "warning",
          title: "Data Tidak Ditemukan di DPT",
          text: "NIK tidak terdaftar dalam Daftar Pemilih Tetap KPU Kabupaten Ngawi. Apakah ingin melaporkan sebagai Pemilih Baru?",
          showCancelButton: true,
          confirmButtonText: "Ya, Laporkan Pemilih Baru",
          cancelButtonText: "Batal",
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#6c757d",
        });
        if (swalRes.isConfirmed) {
          window.location.href = "/laporkan-pemilih-baru";
        }
        return;
      }

      if (data.success && data.voter) {
        const v = data.voter;
        setVoter(v);
        setNameUbah(v.nama || "");
        setKkUbah(kkToSearch || v.nkk || "");
        setNikUbah(v.nik || "");
        setPlaceOfBirthUbah(v.tempat_lahir || "NGAWI");
        setDateOfBirthUbah(v.tanggal_lahir || "");
        setMaritalStatusUbah(v.status_kawin === "S" ? "sudah_nikah" : v.status_kawin === "P" ? "pernah_nikah" : "belum_nikah");
        setGenderUbah(v.kelamin === "P" ? "perempuan" : "laki_laki");
        setAddressUbah(v.alamat || "");
        setRtUbah(v.rt || "");
        setRwUbah(v.rw || "");
        setKecamatanUbah(v.kecamatan || "");
        setKelurahanUbah(v.kelurahan || "");
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
    if (!nameUbah.trim()) {
      Swal.fire({ icon: "error", title: "Nama Pemilih Wajib Diisi!" });
      return;
    }
    if (kkUbah.length !== 16) {
      Swal.fire({ icon: "error", title: "Nomor KK harus 16 digit angka!" });
      return;
    }
    if (nikUbah.length !== 16) {
      Swal.fire({ icon: "error", title: "NIK Pemilih harus 16 digit angka!" });
      return;
    }
    if (!kecamatanUbah || !kelurahanUbah) {
      Swal.fire({ icon: "error", title: "Kecamatan dan Kelurahan Wajib Dipilih!" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      speakAlert("Silakan unggah dokumen pendukung seperti kartu keluarga dan kartu tanda penduduk.");
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

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      speakAlert("Silakan isi data identitas pelapor dan bubuhkan tanda tangan digital.");
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
      speakAlert("Silakan periksa kembali seluruh data pada halaman verifikasi sebelum mengirim tanggapan.");
    }, 400);
  };

  // Submit Laporan Ubah
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      speakAlert("Harap selesaikan verifikasi keamanan CAPTCHA terlebih dahulu.");
      Swal.fire({
        icon: "warning",
        title: "Verifikasi Keamanan Diperlukan",
        text: "Harap selesaikan verifikasi Turnstile (CAPTCHA) sebelum mengirimkan perubahan data.",
        confirmButtonColor: "#28a745",
      });
      return;
    }

    const swalRes = await Swal.fire({
      title: "Konfirmasi Ubah Data Pemilih",
      text: "Apakah Anda yakin seluruh perubahan data pemilih sudah benar dan siap dikirim?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim Laporan!",
      cancelButtonText: "Periksa Lagi",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    });

    if (!swalRes.isConfirmed) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("original_nik", voter?.nik || lookupNik);
      fd.append("original_nama", voter?.nama || "");

      fd.append("name_ubah", nameUbah);
      fd.append("kk_ubah", kkUbah);
      fd.append("nik_ubah", nikUbah);
      fd.append("place_of_birth_ubah", placeOfBirthUbah);
      fd.append("date_of_birth_ubah", dateOfBirthUbah);
      fd.append("marital_status_ubah", maritalStatusUbah);
      fd.append("gender_ubah", genderUbah);
      fd.append("address_ubah", addressUbah);
      fd.append("rt_ubah", rtUbah);
      fd.append("rw_ubah", rwUbah);
      fd.append("kecamatan_ubah", kecamatanUbah);
      fd.append("kelurahan_ubah", kelurahanUbah);

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
      fd.append("cf-turnstile-response", turnstileToken);
      fd.append("turnstileToken", turnstileToken);

      const res = await fetch("/api/laporkan-pemilih-ubah", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      setLoading(false);

      // Reset Turnstile untuk siklus pengiriman berikutnya
      turnstileRef.current?.reset();
      setTurnstileToken("");

      if (json.success) {
        speakAlert("Laporan perubahan data pemilih berhasil terkirim. Terima kasih atas partisipasi Anda.");
        await Swal.fire({
          icon: "success",
          title: "Laporan Berhasil Terkirim!",
          html: "Tanggapan masyarakat untuk <strong>Ubah Data Pemilih</strong> telah berhasil dikirim ke KPU Kabupaten Ngawi.<br>Terima kasih atas partisipasi Anda.",
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
      turnstileRef.current?.reset();
      setTurnstileToken("");
      Swal.fire({
        icon: "error",
        title: "Kesalahan Sistem",
        text: err.message || "Terjadi kesalahan koneksi ke server.",
      });
    }
  };

  const desaList = kecamatanUbah && wilayah?.desaByKec ? wilayah.desaByKec[kecamatanUbah] || [] : [];

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
        <p className="subtitle" style={{ fontWeight: 600, color: "#007bff" }}>
          Laporkan Ubah Data Pemilih {voter ? `(Langkah ${step} dari 4)` : ""}
        </p>
      </div>

      {/* Lookup Card jika belum ada Voter */}
      {!voter ? (
        <div className="form-container">
          <div className="alert alert-info">
            Masukkan Nomor Kartu Keluarga (KK) dan NIK pemilih yang ingin diubah datanya untuk memuat data dari DPT.
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
                STEP 1: PERBAIKI DATA PEMILIH
               ======================================================== */}
            {step === 1 && (
              <div id="formSection">
                <div className="alert alert-info">
                  Harap perbarui data yang perlu diubah, dan biarkan yang sudah benar. Siapkan file bukti pendukung untuk bagian selanjutnya.
                </div>

                <div className="input-group">
                  <label htmlFor="name_ubah">Nama Pemilih:</label>
                  <input
                    type="text"
                    id="name_ubah"
                    placeholder="Ubah Nama Pemilih"
                    value={nameUbah}
                    onChange={(e) => setNameUbah(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="kk_ubah">No. KK:</label>
                  <input
                    type="text"
                    id="kk_ubah"
                    placeholder="Ubah No. KK"
                    maxLength={16}
                    value={kkUbah}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      handleNumericInput(val, kkUbah, "Nomor Kartu Keluarga");
                      setKkUbah(val);
                    }}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="nik_ubah">NIK:</label>
                  <input
                    type="text"
                    id="nik_ubah"
                    placeholder="Ubah NIK"
                    maxLength={16}
                    value={nikUbah}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      handleNumericInput(val, nikUbah, "NIK Pemilih");
                      setNikUbah(val);
                    }}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="place_of_birth_ubah">Tempat Lahir:</label>
                  <input
                    type="text"
                    id="place_of_birth_ubah"
                    placeholder="Ubah Tempat Lahir"
                    value={placeOfBirthUbah}
                    onChange={(e) => setPlaceOfBirthUbah(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="date_of_birth_ubah">Tanggal Lahir:</label>
                  <input
                    type="date"
                    id="date_of_birth_ubah"
                    value={dateOfBirthUbah}
                    onChange={(e) => setDateOfBirthUbah(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="marital_status_ubah">Status Perkawinan:</label>
                  <select
                    id="marital_status_ubah"
                    value={maritalStatusUbah}
                    onChange={(e) => setMaritalStatusUbah(e.target.value)}
                    required
                  >
                    <option value="" disabled>PILIH STATUS PERKAWINAN</option>
                    <option value="belum_nikah">BELUM MENIKAH</option>
                    <option value="sudah_nikah">SUDAH MENIKAH</option>
                    <option value="pernah_nikah">PERNAH MENIKAH</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="gender_ubah">Jenis Kelamin:</label>
                  <select
                    id="gender_ubah"
                    value={genderUbah}
                    onChange={(e) => setGenderUbah(e.target.value)}
                    required
                  >
                    <option value="" disabled>PILIH JENIS KELAMIN</option>
                    <option value="laki_laki">LAKI-LAKI</option>
                    <option value="perempuan">PEREMPUAN</option>
                  </select>
                </div>

                <div className="address-group">
                  <div className="input-group">
                    <label htmlFor="address_ubah">Alamat:</label>
                    <input
                      type="text"
                      id="address_ubah"
                      placeholder="Ubah Alamat"
                      value={addressUbah}
                      onChange={(e) => setAddressUbah(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: 15 }}>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label htmlFor="rt_ubah">RT:</label>
                      <input
                        type="number"
                        id="rt_ubah"
                        placeholder="RT"
                        value={rtUbah}
                        onChange={(e) => setRtUbah(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label htmlFor="rw_ubah">RW:</label>
                      <input
                        type="number"
                        id="rw_ubah"
                        placeholder="RW"
                        value={rwUbah}
                        onChange={(e) => setRwUbah(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="kecamatan_ubah">Kecamatan:</label>
                    <select
                      id="kecamatan_ubah"
                      value={kecamatanUbah}
                      onChange={(e) => {
                        setKecamatanUbah(e.target.value);
                        setKelurahanUbah("");
                      }}
                      required
                    >
                      <option value="" disabled>PILIH KECAMATAN</option>
                      {wilayah?.kecamatan.map((k) => (
                        <option key={k.id} value={k.nama}>
                          {k.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="kelurahan_ubah">Kelurahan / Desa:</label>
                    <select
                      id="kelurahan_ubah"
                      value={kelurahanUbah}
                      onChange={(e) => setKelurahanUbah(e.target.value)}
                      required
                      disabled={!kecamatanUbah}
                    >
                      <option value="" disabled>
                        {kecamatanUbah ? "PILIH KELURAHAN" : "PILIH KECAMATAN DULU"}
                      </option>
                      {desaList.map((d) => (
                        <option key={d.id} value={d.nama}>
                          {d.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-buttons">
                  <Link href="/" className="btn btn-back">
                    Kembali
                  </Link>
                  <button
                    type="button"
                    className="btn btn-next"
                    onClick={handleStep1Next}
                  >
                    Lanjut
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                STEP 2: UPLOAD BERKAS
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
                  <label htmlFor="bukti_lain">Bukti Dukung Perubahan (Opsional):</label>
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
                    Sertakan bukti pendukung jika terdapat perubahan nama, identitas, atau perpindahan domisili (cth: Surat Pindah / Akta).
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
                  Verifikasi Tanggapan Masyarakat - Ubah Data Pemilih
                </h3>

                <table className="verification-table">
                  <tbody>
                    <tr>
                      <td>Nama Pemilih (Baru)</td>
                      <td>{nameUbah.toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td>Nomor KK</td>
                      <td>{kkUbah}</td>
                    </tr>
                    <tr>
                      <td>NIK Pemilih</td>
                      <td>{nikUbah}</td>
                    </tr>
                    <tr>
                      <td>Tempat, Tanggal Lahir</td>
                      <td>
                        {placeOfBirthUbah.toUpperCase()}, {dateOfBirthUbah}
                      </td>
                    </tr>
                    <tr>
                      <td>Status Perkawinan</td>
                      <td>
                        {maritalStatusUbah === "belum_nikah"
                          ? "BELUM MENIKAH"
                          : maritalStatusUbah === "sudah_nikah"
                          ? "SUDAH MENIKAH"
                          : "PERNAH MENIKAH"}
                      </td>
                    </tr>
                    <tr>
                      <td>Jenis Kelamin</td>
                      <td>{genderUbah === "laki_laki" ? "LAKI-LAKI" : "PEREMPUAN"}</td>
                    </tr>
                    <tr>
                      <td>Alamat Lengkap</td>
                      <td>
                        {addressUbah.toUpperCase()}, RT {rtUbah} / RW {rwUbah}, KEL. {kelurahanUbah}, KEC. {kecamatanUbah}
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
                      <td>Bukti Dukung Lain</td>
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

                {/* Cloudflare Turnstile CAPTCHA Protection */}
                <div
                  className="turnstile-wrapper"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "20px 0 16px 0",
                    minHeight: "65px",
                    width: "100%",
                  }}
                >
                  <Turnstile
                    ref={turnstileRef}
                    action="laporkan_pemilih_ubah"
                    onVerify={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => setTurnstileToken("")}
                  />
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="btn btn-back"
                    onClick={() => setStep(3)}
                  >
                    Kembali
                  </button>
                  <button type="submit" className="btn btn-submit">
                    <i className="fas fa-paper-plane" style={{ marginRight: 6 }} />
                    Submit Tanggapan
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

export default function PemilihUbahPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ textAlign: "center", padding: 50 }}>
          <p>Memuat formulir ubah data pemilih...</p>
        </div>
      }
    >
      <PemilihUbahContent />
    </Suspense>
  );
}
