import type { Metadata } from "next";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tanggapan Masyarakat Online KPU Kabupaten Ngawi",
  description:
    "Website resmi Tanggapan Masyarakat Online KPU Kabupaten Ngawi. Wadah partisipasi masyarakat untuk mendukung transparansi dan akuntabilitas pemilu.",
  keywords: "KPU Ngawi, Komisi Pemilihan Umum Kabupaten Ngawi, Tangmas, Tanggapan Masyarakat, Pemilu Ngawi",
  icons: {
    icon: "/images/logo-kpu-ngawi.png",
  },
  openGraph: {
    title: "Tangmas KPU Ngawi - Tanggapan Masyarakat KPU Kabupaten Ngawi",
    description: "Wadah partisipasi masyarakat untuk mendukung transparansi dan akuntabilitas pemilu di Kabupaten Ngawi.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" type="image/png" href="/images/logo-kpu-ngawi.png" />
        <link rel="shortcut icon" href="/images/logo-kpu-ngawi.png" />
        <link rel="apple-touch-icon" href="/images/logo-kpu-ngawi.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        />
      </head>
      <body>
        {children}
        <AccessibilityToolbar />
      </body>
    </html>
  );
}
