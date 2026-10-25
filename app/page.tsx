"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { useTTS } from "@/lib/useTTS";

// Dynamic import Leaflet map to avoid SSR issues
const TpsMap = dynamic(() => import("@/components/TpsMap"), { ssr: false });

interface PemilihData {
  nik: string;
  maskedNIK: string;
  maskedNKK: string;
  nama: string;
  kelamin: string;
  kecamatan: string;
  kelurahan: string;
  tps: string;
  alamat: string;
  tpsDetails: {
    tps_no: string;
    nama_lokasi: string;
    alamat: string;
    latitude: number;
    longitude: number;
  };
}

export default function LandingPage() {
  const [nikInput, setNikInput] = useState<string>("");
  const [lastNikVal, setLastNikVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<PemilihData | null>(null);

  const { ttsEnabled, toggleTts, speak, speakAlert, handleNumericInput, bacaNarasiHasil } = useTTS();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authError = params.get("auth_error");
      if (authError) {
        Swal.fire({
          icon: "error",
          title: "Autentikasi Gagal",
          text: authError,
          confirmButtonColor: "#550d07",
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, 16);
    handleNumericInput(rawVal, lastNikVal, "NIK");
    setNikInput(rawVal);
    setLastNikVal(rawVal);
  };

  const handleSearch = async () => {
    if (nikInput.length !== 16) {
      const msg = "Nomor Induk Kependudukan harus terdiri dari 16 digit angka!";
      speakAlert("Nomor Induk Kependudukan harus terdiri dari enam belas digit angka.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: msg,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nik: nikInput }),
      });

      const result = await res.json();
      setLoading(false);

      if (result.status === "found") {
        setSearchResult(result.data);
        bacaNarasiHasil({
          maskedNKK: result.data.maskedNKK,
          maskedNIK: result.data.maskedNIK,
          nama: result.data.nama,
          kelurahan: result.data.kelurahan,
          kecamatan: result.data.kecamatan,
          tps: result.data.tps,
        });
      } else {
        const pesan = "Data tidak ditemukan di Daftar Pemilih Tetap Kabupaten Ngawi. Apakah Anda ingin melaporkan sebagai pemilih baru?";
        speakAlert(pesan);

        Swal.fire({
          icon: "warning",
          title: "Data Tidak Ditemukan di DPT Kabupaten Ngawi",
          text: "Apakah Anda ingin melaporkan sebagai pemilih baru?",
          showCancelButton: true,
          confirmButtonText: "Ya, laporkan",
          cancelButtonText: "Tidak",
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#6c757d",
        }).then((swalResult) => {
          if (swalResult.isConfirmed) {
            speakAlert("Membuka formulir pemilih baru.");
            window.location.href = "/laporkan-pemilih-baru";
          }
        });
      }
    } catch (err) {
      setLoading(false);
      speakAlert("Terjadi kesalahan jaringan.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat menghubungkan ke server data.",
      });
    }
  };

  const handleReset = () => {
    setSearchResult(null);
    setNikInput("");
    setLastNikVal("");
  };

  const handleChangeButton = () => {
    Swal.fire({
      title: "Konfirmasi",
      html: `
        <p>Apakah Anda yakin ingin melaporkan tanggapan masyarakat untuk <strong>mengubah data pemilih</strong>?</p>
        <hr style="margin: 15px 0;">
        <div style="text-align: left; margin-bottom: 12px;">
          <label style="font-size: 13px; font-weight: 600;">Masukkan No. KK:</label>
          <input type="text" id="swal-kk" class="swal2-input" placeholder="Masukkan 16 digit No. KK" maxlength="16" style="width: 100%; margin: 6px 0;">
        </div>
        <div style="text-align: left; margin-bottom: 12px;">
          <label style="font-size: 13px; font-weight: 600;">Masukkan NIK:</label>
          <input type="text" id="swal-nik" class="swal2-input" placeholder="Masukkan 16 digit NIK" maxlength="16" style="width: 100%; margin: 6px 0;">
        </div>
        <div style="font-size: 12px; color: #666; text-align: left;">
          <em>Siapkan file KTP, Kartu Keluarga, dan bukti pendukung lainnya.</em>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Lanjutkan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#6c757d",
      preConfirm: () => {
        const kk = (document.getElementById("swal-kk") as HTMLInputElement)?.value.trim();
        const nik = (document.getElementById("swal-nik") as HTMLInputElement)?.value.trim();

        if (!kk || kk.length !== 16 || isNaN(Number(kk))) {
          Swal.showValidationMessage("No. KK harus 16 digit angka!");
          return false;
        }
        if (!nik || nik.length !== 16 || isNaN(Number(nik))) {
          Swal.showValidationMessage("NIK harus 16 digit angka!");
          return false;
        }
        return { kk, nik };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        window.location.href = `/laporkan-pemilih-ubah?nik=${result.value.nik}&kk=${result.value.kk}`;
      }
    });
  };

  const handleNewButton = () => {
    Swal.fire({
      title: "Laporkan Pemilih Baru",
      text: "Formulir ini untuk warga yang telah memenuhi syarat sebagai pemilih namun belum terdaftar di DPT KPU Kabupaten Ngawi.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Buka Formulir",
      cancelButtonText: "Batal",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/laporkan-pemilih-baru";
      }
    });
  };

  const handleNotEligibleButton = () => {
    Swal.fire({
      title: "Konfirmasi Pemilih TMS",
      html: `
        <p>Apakah Anda ingin melaporkan pemilih yang <strong>Tidak Memenuhi Syarat (TMS)</strong> seperti meninggal dunia, pindah domisili, ganda, TNI/Polri, dll.?</p>
        <hr style="margin: 15px 0;">
        <div style="text-align: left; margin-bottom: 12px;">
          <label style="font-size: 13px; font-weight: 600;">Masukkan No. KK:</label>
          <input type="text" id="swal-tms-kk" class="swal2-input" placeholder="Masukkan 16 digit No. KK" maxlength="16" style="width: 100%; margin: 6px 0;">
        </div>
        <div style="text-align: left; margin-bottom: 12px;">
          <label style="font-size: 13px; font-weight: 600;">Masukkan NIK Pemilih:</label>
          <input type="text" id="swal-tms-nik" class="swal2-input" placeholder="Masukkan 16 digit NIK" maxlength="16" style="width: 100%; margin: 6px 0;">
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Lanjutkan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      preConfirm: () => {
        const kk = (document.getElementById("swal-tms-kk") as HTMLInputElement)?.value.trim();
        const nik = (document.getElementById("swal-tms-nik") as HTMLInputElement)?.value.trim();

        if (!kk || kk.length !== 16 || isNaN(Number(kk))) {
          Swal.showValidationMessage("No. KK harus 16 digit angka!");
          return false;
        }
        if (!nik || nik.length !== 16 || isNaN(Number(nik))) {
          Swal.showValidationMessage("NIK harus 16 digit angka!");
          return false;
        }
        return { kk, nik };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        window.location.href = `/laporkan-pemilih-tms?nik=${result.value.nik}&kk=${result.value.kk}`;
      }
    });
  };

  return (
    <>
      {/* Fullscreen Pulse Loader saat pencarian */}
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

      <div className="container">
        {/* Logo KPU Ngawi */}
        <Link href="/" onClick={handleReset}>
          <Image
            src="/images/logo-kpu-ngawi.png"
            alt="Logo KPU Kabupaten Ngawi"
            width={120}
            height={120}
            className="logo-kpu"
            priority
          />
        </Link>

        {/* Dynamic Titles */}
        {searchResult ? (
          <>
            <h1>
              Hasil Pencarian Check NIK <br /> DPT KPU Kabupaten Ngawi
            </h1>
            <p className="subtitle">Informasi Data Pemilih</p>
          </>
        ) : (
          <>
            <h1>
              Tanggapan Masyarakat Online <br /> KPU Kabupaten Ngawi
            </h1>
            <p className="subtitle">Pemutakhiran Data Pemilih Berkelanjutan</p>
          </>
        )}

        {/* Content Section */}
        {searchResult ? (
          <div>
            {/* Tabel Data Pemilih */}
            <table className="result-table">
              <tbody>
                <tr>
                  <th>NKK</th>
                  <td>{searchResult.maskedNKK}</td>
                </tr>
                <tr>
                  <th>NIK</th>
                  <td>{searchResult.maskedNIK}</td>
                </tr>
                <tr>
                  <th>Nama</th>
                  <td>{searchResult.nama}</td>
                </tr>
                <tr>
                  <th>Kelurahan</th>
                  <td>{searchResult.kelurahan}</td>
                </tr>
                <tr>
                  <th>Kecamatan</th>
                  <td>{searchResult.kecamatan}</td>
                </tr>
                <tr>
                  <th>TPS</th>
                  <td>{searchResult.tps}</td>
                </tr>
              </tbody>
            </table>

            {/* TPS & Interactive Map Leaflet */}
            <div className="tps-container">
              <div className="tps-info">
                <h5>TPS / DPT</h5>
                <p>
                  {searchResult.tps} - {searchResult.kelurahan}
                </p>
              </div>

              <TpsMap
                latitude={searchResult.tpsDetails.latitude}
                longitude={searchResult.tpsDetails.longitude}
                tpsLabel={`TPS ${searchResult.tps}`}
                locationName={searchResult.tpsDetails.nama_lokasi}
              />
            </div>

            {/* Tombol Kembali */}
            <div style={{ marginTop: "20px" }}>
              <button type="button" className="btn btn-back" onClick={handleReset} style={{ margin: "0 auto" }}>
                Kembali
              </button>
            </div>
          </div>
        ) : (
          /* Form Pencarian Awal */
          <div>
            <input
              ref={inputRef}
              type="text"
              id="nik"
              name="nik"
              value={nikInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Masukkan Nomor Induk Kependudukan (NIK)"
              maxLength={16}
              autoComplete="off"
            />
            <p className="description">
              Keterangan : Silahkan ketik Nomor Induk Kependudukan (NIK).
            </p>

            <div className="button-container">
              <button
                type="button"
                className="btn btn-search"
                id="searchButton"
                onClick={handleSearch}
              >
                <i className="fas fa-search" /> PENCARIAN
              </button>

              <hr />

              <div className="button-group">
                <button
                  type="button"
                  className="btn btn-report-change"
                  id="changeButton"
                  onClick={handleChangeButton}
                >
                  UBAH
                </button>
                <button
                  type="button"
                  className="btn btn-report"
                  id="newButton"
                  onClick={handleNewButton}
                >
                  BARU
                </button>
                <button
                  type="button"
                  className="btn btn-report-not-eligible"
                  id="notEligibleButton"
                  onClick={handleNotEligibleButton}
                >
                  TMS
                </button>
              </div>
            </div>

            <div className="faq-footer">
              <Link href="/faq">
                <i className="fas fa-question-circle" /> Pusat Informasi &amp; Layanan Bantuan
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Floating Audio TTS Toggle (Bawah Kiri) */}
      <button
        type="button"
        id="ttsToggle"
        className="floating-btn"
        onClick={toggleTts}
        title={ttsEnabled ? "Matikan Panduan Suara" : "Aktifkan Panduan Suara"}
      >
        <i className={`fas ${ttsEnabled ? "fa-volume-up" : "fa-volume-mute"} floating-icon`} />
      </button>

      {/* Floating WhatsApp Helpdesk (Bawah Kanan) */}
      <a
        href="https://wa.me/62859106510645?text=Halo%20saya%20butuh%20bantuan%20mengenai%20formulir%20tanggapan%20masyarakat%20di%20KPU%20Kabupaten%20Ngawi"
        className="whatsapp-button"
        target="_blank"
        rel="noopener noreferrer"
        title="Hubungi Helpdesk WhatsApp KPU Ngawi"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp KPU Ngawi"
        />
      </a>
    </>
  );
}
