import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import BackyardShell from "@/components/backyard/BackyardShell";

export const metadata = {
  title: "Backyard Admin - Tanggapan Masyarakat KPU Ngawi",
  description: "Panel Administrasi Tanggapan Masyarakat KPU Kabupaten Ngawi",
};

export default async function BackyardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login/google");
  }

  return <BackyardShell admin={admin}>{children}</BackyardShell>;
}
