"use client";

import { useState } from "react";
import Link from "next/link";
import { useTTS } from "@/lib/useTTS";

interface FaqItem {
  q: string;
  a: string | React.ReactNode;
  children?: FaqItem[];
}

interface FaqSection {
  title: string;
  items: FaqItem[];
}

export default function FaqPage() {
  const { ttsEnabled, toggleTts, speak } = useTTS();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "0": true // Default kategori "Umum" terbuka
  });
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleSection = (idx: string) => {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleItem = (key: string, textToSpeak?: string) => {
    setOpenItems((prev) => {
      const next = !prev[key];
      if (next && ttsEnabled && textToSpeak) {
        speak(textToSpeak);
      }
      return { ...prev, [key]: next };
    });
  };

  const FAQ_DATA: FaqSection[] = [
    {
      title: "Umum",
      items: [
        {
          q: "Apa itu Tanggapan Masyarakat Online KPU Kabupaten Ngawi?",
          a: "Platform digital berbasis website resmi bagi masyarakat Kabupaten Ngawi untuk memberikan tanggapan berupa masukan atau koreksi terhadap Daftar Pemilih. Tujuannya adalah untuk memastikan data pemilih di wilayah Kabupaten Ngawi tetap akurat, mutakhir, dan berkualitas."
        },
        {
          q: "Siapa saja yang bisa memberikan tanggapan?",
          a: "Seluruh warga negara yang memiliki KTP-el atau Kartu Keluarga (KK) Kabupaten Ngawi yang sah. Anda dapat menggunakan layanan ini untuk mengecek data pribadi secara mandiri maupun melaporkan perubahan data orang lain, seperti anggota keluarga yang telah meninggal dunia atau pindah domisili."
        },
        {
          q: "Apakah sistem ini berlaku untuk masyarakat Kabupaten Ngawi?",
          a: (
            <>
              <strong>Iya, Tanggapan Masyarakat Online ini hanya diperuntukkan bagi penduduk yang memiliki administrasi kependudukan (KTP-el/KK) di wilayah Kabupaten Ngawi.</strong>
              <br /><br />
              Apabila NIK/KTP Anda beralamat di luar Ngawi, silakan menghubungi KPU Kabupaten/Kota setempat sesuai dengan domisili asal Anda untuk mendapatkan layanan serupa.
            </>
          )
        },
        {
          q: "Apa saja kategori laporan yang bisa saya kirimkan?",
          a: (
            <>
              Terdapat tiga kategori utama laporan yang dapat Anda ajukan:
              <br /><br />
              <span style={{ display: "block", marginLeft: "15px" }}>
                • <strong>BARU:</strong> Bagi warga Ngawi yang sudah memiliki hak pilih (berusia di atas 17 tahun atau di bawah 17 tahun tetapi sudah/pernah menikah, atau Purnawirawan TNI/Polri) namun datanya <strong>tidak ditemukan</strong> dalam sistem.
              </span>
              <span style={{ display: "block", marginLeft: "15px", marginTop: "10px" }}>
                • <strong>UBAH:</strong> Digunakan untuk melaporkan kesalahan penulisan atau perubahan elemen data pemilih seperti nama, alamat, dan data lainnya.
              </span>
              <span style={{ display: "block", marginLeft: "15px", marginTop: "10px" }}>
                • <strong>TMS (Tidak Memenuhi Syarat):</strong> Untuk melaporkan pemilih yang tidak lagi memenuhi syarat sah, seperti meninggal dunia, pindah domisili ke luar Ngawi, menjadi anggota TNI/Polri aktif, atau data ganda.
              </span>
            </>
          )
        }
      ]
    },
    {
      title: "Keamanan & Privasi Data",
      items: [
        {
          q: "Keamanan Data NIK & NKK",
          a: "Apakah data NIK dan NKK saya aman saat melakukan pencarian?\nYa, sistem menerapkan perlindungan privasi pada hasil pencarian data pemilih. Sebagian digit Nomor Induk Kependudukan (NIK) dan Nomor Kartu Keluarga (NKK) akan disensor (ditampilkan dalam bentuk tanda bintang) untuk mencegah penyalahgunaan data pribadi oleh pihak yang tidak berwenang."
        },
        {
          q: "Keamanan Dokumen Unggahan",
          a: "Bagaimana keamanan dokumen (KTP/KK) yang saya unggah?\nDokumen yang diunggah, seperti foto KTP-el atau Kartu Keluarga, digunakan semata-mata sebagai bukti pendukung dalam proses validasi oleh petugas KPU Kabupaten Ngawi. Akses terhadap dokumen tersebut dibatasi secara ketat dan hanya dapat dilihat oleh admin internal yang berwenang."
        },
        {
          q: "Fitur Verifikasi Keamanan (reCAPTCHA)",
          a: "",
          children: [
            {
              q: "Apakah ada fitur verifikasi keamanan pada sistem ini?",
              a: "Ya. Sistem dilengkapi dengan fitur reCAPTCHA yang berfungsi untuk memastikan bahwa akses dilakukan oleh manusia, bukan oleh program otomatis (bot) yang berpotensi menyalahgunakan data."
            },
            {
              q: "Apa manfaat reCAPTCHA bagi saya?",
              a: (
                <>
                  Fitur ini memberikan perlindungan tambahan berupa:<br />
                  • <strong>Pencegahan Penyalahgunaan:</strong> Menghindari pengambilan data NIK secara massal.<br />
                  • <strong>Anti-Spam:</strong> Menghindari pengiriman formulir palsu yang dapat menghambat verifikasi laporan asli.<br />
                  • <strong>Keamanan Transaksi:</strong> Memastikan setiap klik 'Cari' atau 'Submit' adalah aktivitas sah.
                </>
              )
            },
            {
              q: "Apakah reCAPTCHA mengambil data pribadi saya?",
              a: "Tidak. reCAPTCHA bekerja di latar belakang untuk menganalisis pola interaksi (seperti gerakan kursor) hanya untuk memastikan keamanan koneksi tanpa mengambil informasi identitas pribadi Anda."
            }
          ]
        },
        {
          q: "Tanda Tangan Digital & Kerahasiaan",
          a: "",
          children: [
            {
              q: "Mengapa saya harus melakukan Tanda Tangan Digital?",
              a: "Tanda tangan digital berfungsi sebagai pernyataan bahwa data yang Anda sampaikan adalah benar dan dapat dipertanggungjawabkan secara hukum, serta mencegah laporan palsu."
            },
            {
              q: "Apakah laporan saya bersifat rahasia?",
              a: "Ya. KPU Kabupaten Ngawi menjaga kerahasiaan identitas pelapor. Data Anda hanya digunakan untuk keperluan administrasi dan komunikasi jika petugas memerlukan klarifikasi lebih lanjut."
            }
          ]
        }
      ]
    },
    {
      title: "Aksesibilitas & Bantuan",
      items: [
        {
          q: "Fitur Audio (Screen Reader)",
          a: "Apa fungsi ikon Speaker (Suara) di pojok kiri bawah?\nIkon Speaker merupakan fitur Screen Reader. Ketika diklik, sistem akan membacakan teks pada halaman formulir secara otomatis. Fitur ini dirancang untuk membantu pengguna dengan keterbatasan penglihatan atau mereka yang lebih nyaman menerima informasi melalui audio."
        },
        {
          q: "Menu Aksesibilitas (CTRL+F2)",
          a: (
            <>
              <strong>Apa itu tombol &quot;CTRL+F2&quot; di sisi kiri layar?</strong><br />
              Ini adalah fitur aksesibilitas yang memungkinkan Anda untuk:<br />
              • Mengatur kontras warna layar.<br />
              • Memperbesar ukuran teks agar lebih mudah dibaca.<br />
              • Memudahkan navigasi mandiri bagi pengguna disabilitas.
            </>
          )
        },
        {
          q: "Layanan Helpdesk (WhatsApp)",
          a: (
            <>
              <strong>Apa fungsi tombol ikon &quot;WhatsApp&quot; di pojok kanan bawah?</strong><br />
              Tombol ini adalah saluran <strong>Helpdesk</strong> untuk terhubung langsung dengan Admin KPU Kabupaten Ngawi. Gunakan fitur ini jika Anda mengalami kendala seperti:<br />
              • NIK Ngawi tidak terdeteksi sistem.<br />
              • Gagal mengunggah dokumen (KTP/KK).<br />
              • Kendala teknis lainnya saat pengisian formulir.
            </>
          )
        },
        {
          q: "Validasi Laporan",
          a: "Mengapa ada fitur Tanda Tangan Digital di akhir formulir?\nSebagai bentuk validasi bahwa laporan Anda benar dan dapat dipertanggungjawabkan. Anda dapat membubuhkan tanda tangan menggunakan mouse (PC) atau jari tangan (Smartphone) sebelum menekan tombol Submit."
        }
      ]
    },
    {
      title: "Fitur Tanggapan Masyarakat",
      items: [
        {
          q: "Pencarian Data Pemilih",
          a: "",
          children: [
            {
              q: "Bagaimana cara mengecek data saya?",
              a: "Cukup masukkan 16 digit NIK Anda pada kolom yang tersedia, lalu klik tombol 'Pencarian'. Pastikan NIK yang Anda masukkan terdaftar secara resmi sebagai warga ber-KTP Kabupaten Ngawi."
            },
            {
              q: "Apa yang dilakukan jika data ditemukan?",
              a: (
                <>
                  Periksa rincian nama, kelurahan, kecamatan, dan lokasi TPS:<br />
                  • <strong>Data Sudah Benar:</strong> Tidak perlu melakukan tindakan apa pun.<br />
                  • <strong>Ada Kesalahan (Nama/Alamat):</strong> Klik &apos;Kembali&apos; dan pilih menu <strong>UBAH (Biru)</strong>.<br />
                  • <strong>Data Milik Orang yang Meninggal:</strong> Klik &apos;Kembali&apos; dan pilih menu <strong>TMS (Merah)</strong>.
                </>
              )
            },
            {
              q: "Apa arti lokasi TPS di peta?",
              a: "Peta menunjukkan estimasi lokasi TPS tempat Anda memberikan hak pilih. Gunakan tombol 'Buka di Google Maps' untuk mendapatkan petunjuk arah navigasi ke lokasi tersebut."
            },
            {
              q: "Mengapa NIK Tidak Ditemukan?",
              a: (
                <>
                  Jika tidak ditemukan, pastikan:<br />
                  1. NIK sudah benar (16 digit).<br />
                  2. NIK terdaftar sebagai administrasi Kabupaten Ngawi.<br />
                  <strong>Saran:</strong> Jika Anda warga Ngawi tapi data tidak ada, silakan klik &apos;Kembali&apos; dan pilih menu <strong>BARU (Hijau)</strong>.
                </>
              )
            },
            {
              q: "Mengapa NIK & NKK saya disensor?",
              a: "Penyensoran (tanda bintang) dilakukan untuk menjaga privasi dan keamanan data pribadi Anda sesuai ketentuan hukum, guna mencegah penyalahgunaan oleh pihak tidak bertanggung jawab."
            }
          ]
        },
        {
          q: "Pelaporan Pemilih BARU",
          a: "",
          children: [
            {
              q: "Siapa yang dilaporkan dalam kategori BARU?",
              a: (
                <>
                  Kategori BARU digunakan apabila Anda atau warga Kabupaten Ngawi yang Anda laporkan telah memenuhi syarat sebagai pemilih (berusia di atas 17 tahun atau di bawah 17 tahun tetapi sudah/pernah menikah, atau Purnawirawan TNI/Polri), namun <strong>data tidak ditemukan</strong> saat pencarian menggunakan NIK.<br /><br />
                  • Untuk Pemilih Baru yang belum genap 17 tahun tetapi sudah menikah, wajib mengunggah scan <strong>Akta Nikah</strong>.<br />
                  • Untuk Purnawirawan TNI/Polri, wajib mengunggah <strong>Surat Keterangan Purna</strong>.
                </>
              )
            },
            {
              q: "Dokumen yang Wajib Diunggah",
              a: "Format file: .jpg, .jpeg, .png, atau .pdf (Maks. 2MB):\n• File KK: Foto/scan Kartu Keluarga terbaru.\n• File KTP: Foto/scan KTP-el pemilih.\n• Bukti Dukung: Opsional (misal Akta Nikah jika < 17 tahun)."
            }
          ]
        },
        {
          q: "Pelaporan Pemilih Tidak Memenuhi Syarat (TMS)",
          a: (
            <>
              Digunakan jika pemilih yang ditemukan pada fitur pencarian seharusnya dihapus dari Daftar Pemilih Tetap (DPT) dengan alasan:<br />
              • <strong>Meninggal:</strong> Pemilih sudah wafat.<br />
              • <strong>Ganda:</strong> Nama muncul lebih dari satu kali.<br />
              • <strong>Pindah Domisili:</strong> Keluar dari Kabupaten Ngawi.<br />
              • <strong>TNI/POLRI:</strong> Menjadi anggota aktif.<br />
              • <strong>Lainnya:</strong> WNA, Hak Politik dicabut, atau Di Bawah Umur.
            </>
          )
        },
        {
          q: "Pelaporan Ubah Data Pemilih",
          a: (
            <>
              Jika data ditemukan namun ada informasi yang salah, seperti:<br />
              • Kesalahan penulisan nama/tempat/tanggal lahir.<br />
              • Perubahan status perkawinan atau alamat (masih di lingkup Ngawi).<br />
              • Perbaikan data RT/RW, Kelurahan, atau Kecamatan.
            </>
          )
        }
      ]
    }
  ];

  return (
    <>
      <div
        style={{
          maxWidth: "800px",
          margin: "20px auto",
          background: "#fff",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          overflow: "hidden",
          border: "1px solid #e0e6ed"
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#fff",
            padding: "30px 25px",
            textAlign: "center",
            borderBottom: "1px solid #e0e6ed"
          }}
        >
          <h1 style={{ fontSize: "1.4rem", color: "#2c3e50", fontWeight: 700, margin: 0 }}>
            Pusat Informasi &amp; Layanan Bantuan
          </h1>
          <p style={{ color: "#95a5a6", fontSize: "0.85rem", marginTop: "8px" }}>
            Temukan jawaban atas pertanyaan umum seputar layanan kami
          </p>
        </div>

        {/* Accordion Categories */}
        <div>
          {FAQ_DATA.map((section, sIdx) => {
            const isSecOpen = openSections[String(sIdx)];
            return (
              <div key={sIdx} style={{ borderBottom: "1px solid #e0e6ed" }}>
                {/* Level 1: Category Header */}
                <div
                  onClick={() => toggleSection(String(sIdx))}
                  style={{
                    padding: "18px 25px",
                    backgroundColor: isSecOpen ? "#fcfcfc" : "#fff",
                    color: "#2c3e50",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <i
                    className={`fas ${isSecOpen ? "fa-chevron-down" : "fa-chevron-right"}`}
                    style={{ marginRight: "15px", fontSize: "0.8rem", opacity: 0.6 }}
                  />
                  {section.title}
                </div>

                {/* Level 2: Items in Category */}
                {isSecOpen && (
                  <div style={{ backgroundColor: "#f9fafb" }}>
                    {section.items.map((item, iIdx) => {
                      const itemKey = `${sIdx}-${iIdx}`;
                      const isItemOpen = openItems[itemKey];

                      if (item.children && item.children.length > 0) {
                        return (
                          <div key={iIdx} style={{ borderTop: "1px solid #eef2f6" }}>
                            <div
                              onClick={() => toggleItem(itemKey)}
                              style={{
                                padding: "14px 35px",
                                backgroundColor: "#f1f4f8",
                                color: "#4a69bd",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center"
                              }}
                            >
                              <i
                                className={`fas ${isItemOpen ? "fa-chevron-down" : "fa-chevron-right"}`}
                                style={{ marginRight: "12px", fontSize: "0.75rem", opacity: 0.6 }}
                              />
                              {item.q}
                            </div>

                            {/* Level 3: Nested items */}
                            {isItemOpen && (
                              <div>
                                {item.children.map((sub, subIdx) => {
                                  const subKey = `${itemKey}-${subIdx}`;
                                  const isSubOpen = openItems[subKey];
                                  return (
                                    <div key={subIdx} style={{ borderTop: "1px solid #eef2f6" }}>
                                      <div
                                        onClick={() => toggleItem(subKey, typeof sub.a === "string" ? sub.a : undefined)}
                                        style={{
                                          padding: "12px 45px",
                                          backgroundColor: "#fff",
                                          color: "#555",
                                          fontSize: "0.9rem",
                                          fontWeight: 600,
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center"
                                        }}
                                      >
                                        <i
                                          className={`fas ${isSubOpen ? "fa-chevron-down" : "fa-chevron-right"}`}
                                          style={{ marginRight: "10px", fontSize: "0.7rem", opacity: 0.5 }}
                                        />
                                        {sub.q}
                                      </div>
                                      {isSubOpen && (
                                        <div
                                          style={{
                                            padding: "16px 60px",
                                            backgroundColor: "#fafbfc",
                                            color: "#555",
                                            fontSize: "0.9rem",
                                            lineHeight: 1.7,
                                            borderTop: "1px solid #f1f4f8"
                                          }}
                                        >
                                          {sub.a}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div key={iIdx} style={{ borderTop: "1px solid #eef2f6" }}>
                          <div
                            onClick={() => toggleItem(itemKey, typeof item.a === "string" ? item.a : undefined)}
                            style={{
                              padding: "14px 35px",
                              backgroundColor: "#fff",
                              color: "#4a69bd",
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <i
                              className={`fas ${isItemOpen ? "fa-chevron-down" : "fa-chevron-right"}`}
                              style={{ marginRight: "12px", fontSize: "0.75rem", opacity: 0.6 }}
                            />
                            {item.q}
                          </div>
                          {isItemOpen && (
                            <div
                              style={{
                                padding: "16px 50px",
                                backgroundColor: "#fafbfc",
                                color: "#555",
                                fontSize: "0.9rem",
                                lineHeight: 1.7,
                                borderTop: "1px solid #f1f4f8",
                                whiteSpace: "pre-line"
                              }}
                            >
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tombol Kembali ke Halaman Utama */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#7f8c8d",
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            padding: "8px 16px",
            borderRadius: "6px",
            transition: "color 0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#2c3e50")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#7f8c8d")}
        >
          <i className="fas fa-long-arrow-alt-left" /> Kembali ke Halaman Utama
        </Link>
      </div>

      {/* Floating Audio TTS Toggle */}
      <button
        type="button"
        id="ttsToggle"
        className="floating-btn"
        onClick={toggleTts}
        title={ttsEnabled ? "Matikan Panduan Suara" : "Aktifkan Panduan Suara"}
      >
        <i className={`fas ${ttsEnabled ? "fa-volume-up" : "fa-volume-mute"} floating-icon`} />
      </button>

      {/* Floating WhatsApp Helpdesk */}
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
