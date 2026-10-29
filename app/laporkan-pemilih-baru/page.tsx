"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import SignaturePadComponent, { SignaturePadHandle } from "@/components/SignaturePadComponent";
import Turnstile, { TurnstileHandle } from "@/components/Turnstile";
import { useTTS } from "@/lib/useTTS";

interface WilayahData {
  kecamatan: { id: number; nama: string }[];
  desaByKec: Record<string, { id: number; kec_id: number; nama: string }[]>;
}

export default function PemilihBaruPage() {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [wilayah, setWilayah] = useState<WilayahData | null>(null);

  // Form Fields - Step 1: Pemilih Baru
  const [name, setName] = useState<string>("");
  const [kk, setKk] = useState<string>("");
  const [nik, setNik] = useState<string>("");
  const [placeOfBirth, setPlaceOfBirth] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [rt, setRt] = useState<string>("");
  const [rw, setRw] = useState<string>("");
  const [kecamatan, setKecamatan] = useState<string>("");
  const [kelurahan, setKelurahan] = useState<string>("");
  const [flagBuktiLain, setFlagBuktiLain] = useState<boolean>(false);

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
  const { ttsEnabled, toggleTts, speak, speakAlert, handleNumericInput } = useTTS();

  // Load Wilayah from API
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

  // Restore from localStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem("pb_name");
      if (savedName) setName(savedName);
      const savedKk = localStorage.getItem("pb_kk");
      if (savedKk) setKk(savedKk);
      const savedNik = localStorage.getItem("pb_nik");
      if (savedNik) setNik(savedNik);
      const savedPob = localStorage.getItem("pb_pob");
      if (savedPob) setPlaceOfBirth(savedPob);
      const savedDob = localStorage.getItem("pb_dob");
      if (savedDob) setDateOfBirth(savedDob);
      const savedMarital = localStorage.getItem("pb_marital");
      if (savedMarital) setMaritalStatus(savedMarital);
      const savedGender = localStorage.getItem("pb_gender");
      if (savedGender) setGender(savedGender);
      const savedAddr = localStorage.getItem("pb_address");
      if (savedAddr) setAddress(savedAddr);
      const savedRt = localStorage.getItem("pb_rt");
      if (savedRt) setRt(savedRt);
      const savedRw = localStorage.getItem("pb_rw");
      if (savedRw) setRw(savedRw);
      const savedKec = localStorage.getItem("pb_kecamatan");
      if (savedKec) setKecamatan(savedKec);
      const savedKel = localStorage.getItem("pb_kelurahan");
      if (savedKel) setKelurahan(savedKel);

      const savedRName = localStorage.getItem("pb_responder_name");
      if (savedRName) setResponderName(savedRName);
      const savedRNik = localStorage.getItem("pb_responder_nik");
      if (savedRNik) setResponderNik(savedRNik);
      const savedRAddr = localStorage.getItem("pb_responder_address");
      if (savedRAddr) setResponderAddress(savedRAddr);
      const savedRContact = localStorage.getItem("pb_responder_contact");
      if (savedRContact) setResponderContact(savedRContact);
      const savedREmail = localStorage.getItem("pb_responder_email");
      if (savedREmail) setResponderEmail(savedREmail);

      const params = new URLSearchParams(window.location.search);
      const s = params.get("step");
      if (s) {
        const stepNum = parseInt(s, 10);
        if (stepNum >= 1 && stepNum <= 4) setStep(stepNum);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save changes to localStorage
  const saveField = (key: string, val: string) => {
    try {
      localStorage.setItem(`pb_${key}`, val);
    } catch {
      // ignore
    }
  };

  // Age validation
  const validateAge = (dob: string) => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 17) {
      setFlagBuktiLain(true);
      speakAlert(
        "Pemilih berusia di bawah tujuh belas tahun. Harus dalam kondisi sudah atau pernah menikah dan wajib menyertakan bukti dukung pernikahan di bagian selanjutnya."
      );
      Swal.fire({
        icon: "warning",
        title: "Pemilih Baru di Bawah 17 Tahun",
        html: "Pemilih yang berusia di bawah 17 tahun harus dalam kondisi <strong>pernah atau sudah menikah</strong>.<br>Harap menyertakan <strong>bukti dukung</strong> lainnya pada bagian unggah berkas.",
      });
    } else {
      setFlagBuktiLain(false);
    }
  };

  const handleClearForm = () => {
    Swal.fire({
      title: "Kosongkan Formulir?",
      text: "Tindakan ini akan menghapus semua isian formulir dan tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Kosongkan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        setName("");
        setKk("");
        setNik("");
        setPlaceOfBirth("");
        setDateOfBirth("");
        setMaritalStatus("");
        setGender("");
        setAddress("");
        setRt("");
        setRw("");
        setKecamatan("");
        setKelurahan("");
        setKkFile(null);
        setKtpFile(null);
        setBuktiLainFile(null);
        setResponderName("");
        setResponderNik("");
        setResponderAddress("");
        setResponderContact("");
        setResponderEmail("");
        setKtpPelaporFile(null);
        setSignatureData("");
        sigPadRef.current?.clear();

        try {
          const keys = [
            "name", "kk", "nik", "pob", "dob", "marital", "gender",
            "address", "rt", "rw", "kecamatan", "kelurahan",
            "responder_name", "responder_nik", "responder_address",
            "responder_contact", "responder_email"
          ];
          keys.forEach((k) => localStorage.removeItem(`pb_${k}`));
        } catch {
          // ignore
        }

        setStep(1);
        Swal.fire("Formulir Berhasil Dikosongkan!", "", "success");
      }
    });
  };

  const previewFile = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  // Navigation: Step 1 -> Step 2
  const handleStep1Next = () => {
    if (!name.trim()) {
      Swal.fire({ icon: "error", title: "Nama Pemilih Wajib Diisi!" });
      return;
    }
    if (kk.length !== 16) {
      Swal.fire({ icon: "error", title: "Nomor KK harus 16 digit angka!" });
      return;
    }
    if (nik.length !== 16) {
      Swal.fire({ icon: "error", title: "NIK Pemilih harus 16 digit angka!" });
      return;
    }
    if (!placeOfBirth.trim() || !dateOfBirth) {
      Swal.fire({ icon: "error", title: "Tempat dan Tanggal Lahir Wajib Diisi!" });
      return;
    }
    if (!maritalStatus) {
      Swal.fire({ icon: "error", title: "Pilih Status Perkawinan Pemilih!" });
      return;
    }
    if (!gender) {
      Swal.fire({ icon: "error", title: "Pilih Jenis Kelamin Pemilih!" });
      return;
    }
    if (!address.trim() || !rt.trim() || !rw.trim() || !kecamatan || !kelurahan) {
      Swal.fire({ icon: "error", title: "Alamat, RT, RW, Kecamatan, dan Kelurahan Wajib Diisi Lengkap!" });
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
    if (flagBuktiLain && !buktiLainFile) {
      Swal.fire({
        icon: "error",
        title: "Bukti Dukung Lain Wajib Diunggah!",
        text: "Pemilih di bawah usia 17 tahun wajib menyertakan Akta Pernikahan atau dokumen pendukung peradilan.",
      });
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

  // Submit Laporan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      speakAlert("Harap selesaikan verifikasi keamanan CAPTCHA terlebih dahulu.");
      Swal.fire({
        icon: "warning",
        title: "Verifikasi Keamanan Diperlukan",
        text: "Harap selesaikan verifikasi Turnstile (CAPTCHA) sebelum mengirimkan laporan tanggapan.",
        confirmButtonColor: "#28a745",
      });
      return;
    }

    const swalRes = await Swal.fire({
      title: "Konfirmasi Pengiriman Tanggapan",
      text: "Apakah Anda yakin seluruh data tanggapan pemilih baru sudah benar dan siap dikirim?",
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
      fd.append("name", name);
      fd.append("kk", kk);
      fd.append("nik", nik);
      fd.append("place_of_birth", placeOfBirth);
      fd.append("date_of_birth", dateOfBirth);
      fd.append("marital_status", maritalStatus);
      fd.append("gender", gender);
      fd.append("address", address);
      fd.append("rt", rt);
      fd.append("rw", rw);
      fd.append("kecamatan", kecamatan);
      fd.append("kelurahan", kelurahan);

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

      const res = await fetch("/api/laporkan-pemilih-baru", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      setLoading(false);

      // Reset Turnstile untuk siklus pengiriman berikutnya
      turnstileRef.current?.reset();
      setTurnstileToken("");

      if (json.success) {
        speakAlert("Laporan tanggapan pemilih baru berhasil terkirim. Terima kasih atas partisipasi Anda.");
        await Swal.fire({
          icon: "success",
          title: "Laporan Berhasil Terkirim!",
          html: "Tanggapan masyarakat untuk <strong>Pemilih Baru</strong> telah berhasil dikirim ke KPU Kabupaten Ngawi.<br>Terima kasih atas partisipasi Anda.",
          confirmButtonColor: "#28a745",
        });

        // Clear storage
        try {
          const keys = [
            "name", "kk", "nik", "pob", "dob", "marital", "gender",
            "address", "rt", "rw", "kecamatan", "kelurahan",
            "responder_name", "responder_nik", "responder_address",
            "responder_contact", "responder_email"
          ];
          keys.forEach((k) => localStorage.removeItem(`pb_${k}`));
        } catch {
          // ignore
        }

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

  const desaList = kecamatan && wilayah?.desaByKec ? wilayah.desaByKec[kecamatan] || [] : [];

  return (
    <div className="container">
      {/* Fullscreen Pulse Loader */}
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
        <p className="subtitle" style={{ fontWeight: 600, color: "#f76c26" }}>
          Laporkan Pemilih Baru (Langkah {step} dari 4)
        </p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* ========================================================
              STEP 1: IDENTITAS PEMILIH BARU
             ======================================================== */}
          {step === 1 && (
            <div id="formSection">
              <div className="input-group">
                <label htmlFor="name">Nama Pemilih:</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Masukkan Nama Pemilih"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    saveField("name", e.target.value);
                  }}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="kk">No. Kartu Keluarga (KK):</label>
                <input
                  type="text"
                  id="kk"
                  placeholder="Masukkan 16 Digit No. KK"
                  maxLength={16}
                  value={kk}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    handleNumericInput(val, kk, "Nomor Kartu Keluarga");
                    setKk(val);
                    saveField("kk", val);
                  }}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="nik">NIK Pemilih:</label>
                <input
                  type="text"
                  id="nik"
                  placeholder="Masukkan 16 Digit NIK"
                  maxLength={16}
                  value={nik}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    handleNumericInput(val, nik, "NIK Pemilih");
                    setNik(val);
                    saveField("nik", val);
                  }}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="place_of_birth">Tempat Lahir:</label>
                <input
                  type="text"
                  id="place_of_birth"
                  placeholder="Masukkan Tempat Lahir"
                  value={placeOfBirth}
                  onChange={(e) => {
                    setPlaceOfBirth(e.target.value);
                    saveField("pob", e.target.value);
                  }}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="date_of_birth">Tanggal Lahir:</label>
                <input
                  type="date"
                  id="date_of_birth"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    saveField("dob", e.target.value);
                    validateAge(e.target.value);
                  }}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="marital_status">Status Perkawinan:</label>
                <select
                  id="marital_status"
                  value={maritalStatus}
                  onChange={(e) => {
                    setMaritalStatus(e.target.value);
                    saveField("marital", e.target.value);
                  }}
                  required
                >
                  <option value="" disabled>PILIH STATUS PERKAWINAN</option>
                  <option value="belum_nikah">BELUM MENIKAH</option>
                  <option value="sudah_nikah">SUDAH MENIKAH</option>
                  <option value="pernah_nikah">PERNAH MENIKAH</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="gender">Jenis Kelamin:</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    saveField("gender", e.target.value);
                  }}
                  required
                >
                  <option value="" disabled>PILIH JENIS KELAMIN</option>
                  <option value="laki_laki">LAKI-LAKI</option>
                  <option value="perempuan">PEREMPUAN</option>
                </select>
              </div>

              <div className="address-group">
                <div className="input-group">
                  <label htmlFor="address">Alamat (Jalan / Dusun):</label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Masukkan Alamat Lengkap"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      saveField("address", e.target.value);
                    }}
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: 15 }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label htmlFor="rt">RT:</label>
                    <input
                      type="number"
                      id="rt"
                      placeholder="RT"
                      value={rt}
                      onChange={(e) => {
                        setRt(e.target.value);
                        saveField("rt", e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label htmlFor="rw">RW:</label>
                    <input
                      type="number"
                      id="rw"
                      placeholder="RW"
                      value={rw}
                      onChange={(e) => {
                        setRw(e.target.value);
                        saveField("rw", e.target.value);
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="kecamatan">Kecamatan:</label>
                  <select
                    id="kecamatan"
                    value={kecamatan}
                    onChange={(e) => {
                      setKecamatan(e.target.value);
                      saveField("kecamatan", e.target.value);
                      setKelurahan("");
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
                  <label htmlFor="kelurahan">Kelurahan / Desa:</label>
                  <select
                    id="kelurahan"
                    value={kelurahan}
                    onChange={(e) => {
                      setKelurahan(e.target.value);
                      saveField("kelurahan", e.target.value);
                    }}
                    required
                    disabled={!kecamatan}
                  >
                    <option value="" disabled>
                      {kecamatan ? "PILIH KELURAHAN" : "PILIH KECAMATAN DULU"}
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
                  className="btn btn-delete"
                  onClick={handleClearForm}
                >
                  Kosongkan Formulir
                </button>
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
                <label htmlFor="bukti_lain">
                  Bukti Dukung Lain {flagBuktiLain ? "(Wajib untuk Pemilih < 17 Thn):" : "(Opsional):"}
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
                <div className="alert alert-info" style={{ marginTop: 12, fontSize: 13 }}>
                  <strong>Catatan Bukti Dukung:</strong>
                  <br />
                  1. Akta Pernikahan bagi pemilih baru di bawah 17 tahun (Sudah/Pernah Menikah).
                  <br />
                  2. Surat keterangan domisili atau dokumen pendukung kependudukan lainnya.
                </div>
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
              STEP 3: DATA PELAPOR & DIGITAL SIGNATURE
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
                  onChange={(e) => {
                    setResponderName(e.target.value);
                    saveField("responder_name", e.target.value);
                  }}
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
                    saveField("responder_nik", val);
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
                  onChange={(e) => {
                    setResponderAddress(e.target.value);
                    saveField("responder_address", e.target.value);
                  }}
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
                      saveField("responder_contact", val);
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
                  onChange={(e) => {
                    setResponderEmail(e.target.value);
                    saveField("responder_email", e.target.value);
                  }}
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
                Verifikasi Tanggapan Masyarakat - Pemilih Baru
              </h3>

              <table className="verification-table">
                <tbody>
                  <tr>
                    <td>Nama Pemilih</td>
                    <td>{name.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>Nomor KK</td>
                    <td>{kk}</td>
                  </tr>
                  <tr>
                    <td>NIK Pemilih</td>
                    <td>{nik}</td>
                  </tr>
                  <tr>
                    <td>Tempat, Tanggal Lahir</td>
                    <td>
                      {placeOfBirth.toUpperCase()}, {dateOfBirth}
                    </td>
                  </tr>
                  <tr>
                    <td>Status Perkawinan</td>
                    <td>
                      {maritalStatus === "belum_nikah"
                        ? "BELUM MENIKAH"
                        : maritalStatus === "sudah_nikah"
                        ? "SUDAH MENIKAH"
                        : "PERNAH MENIKAH"}
                    </td>
                  </tr>
                  <tr>
                    <td>Jenis Kelamin</td>
                    <td>{gender === "laki_laki" ? "LAKI-LAKI" : "PEREMPUAN"}</td>
                  </tr>
                  <tr>
                    <td>Alamat Lengkap</td>
                    <td>
                      {address.toUpperCase()}, RT {rt} / RW {rw}, KEL. {kelurahan}, KEC. {kecamatan}
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
                  action="laporkan_pemilih_baru"
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
