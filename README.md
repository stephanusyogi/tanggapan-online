# tanggapan-online

Sistem Tanggapan & Masukan Masyarakat - KPU Kabupaten Ngawi (Next.js 16 App Router + MariaDB).

## Fitur Utama
- **Formulir Pengajuan Tanggapan Masyarakat**:
  - Pemilih Baru
  - Pemilih Tidak Memenuhi Syarat (TMS)
  - Perbaikan / Ubah Data Pemilih
- **Fitur Cek Status Tanggapan**: Pelapor dapat melacak status verifikasi pengajuan secara mandiri.
- **Backyard Admin Portal**:
  - Dashboard statistik & filter per tahapan/kecamatan/kelurahan
  - Manajemen verifikasi tanggapan (Diterima / Ditolak dengan catatan)
  - Export data ke format Excel
  - Generate & download otomatis Formulir Model A-Tanggapan Masyarakat (PDF)
  - Notifikasi Email otomatis via SMTP ke Pelapor & Tim KPU Ngawi (`datinkpungawi@gmail.com`)
  - Manajemen User Admin & Token Registrasi
  - Manajemen Master Data (Tahapan, Wilayah, TPS)

---

## Prasyarat Lingkungan (Requirements)
- **Node.js**: Versi 18.17+ atau 20+ LTS
- **Database**: MariaDB 10.5+ / MySQL 8.0+

---

## Konfigurasi Lingkungan (.env)
Salin `.env.example` ke `.env.local` (atau `.env` di server hosting):

```bash
cp .env.example .env.local
```

Sesuaikan parameter koneksi database dan SMTP email:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=tangmas_user
DB_PASSWORD=your_secure_password
DB_NAME=tangmas_db

NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://tangmas.kpungawi.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=datinkpungawi@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME="KPU Kabupaten Ngawi"
SMTP_FROM_EMAIL=datinkpungawi@gmail.com
ADMIN_NOTIFICATION_EMAIL=datinkpungawi@gmail.com
```

---

## Database Migration & Import
File database lengkap beserta data historis tersedia di:
`tangmas_db_dump.sql`

Untuk mengimpor ke database hosting:
1. Buat database baru di phpMyAdmin Hostinger / cPanel (contoh: `tangmas`).
2. Masuk ke phpMyAdmin -> Pilih database -> Klik menu **Import**.
3. Pilih file `tangmas_db_dump.sql` dan klik **Go / Kirim**.

---

## Menjalankan di Mode Development
```bash
npm install
npm run dev
```
Akses di browser: `http://localhost:3000`

---

## Build & Menjalankan di Server Produksi (Hostinger / VPS)
```bash
npm run build
npm start
```
Aplikasi sudah dikonfigurasi dengan `standalone` output dan `server.js` untuk kompatibilitas penuh dengan Node.js App Manager Hostinger / CloudLinux Passenger / PM2.
