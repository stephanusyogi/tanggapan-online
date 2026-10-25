import pool from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import AdminClient, { type AdminRow } from "@/components/backyard/AdminClient";


export const metadata = {
  title: "Administrator - Backyard KPU Ngawi",
};

export default async function AdministratorPage() {
  const currentAdmin = await getCurrentAdmin();

  let adminList: AdminRow[] = [];
  try {
    const [rows]: any = await pool.execute(
      "SELECT id, name, email, avatar, created_at FROM users ORDER BY id ASC"
    );

    adminList = (rows || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      avatar: r.avatar,
      created_at: String(r.created_at),
    }));
  } catch (err) {
    console.error("Error fetching admin list:", err);
  }

  return (
    <AdminClient
      initialAdmins={adminList}
      currentAdminId={currentAdmin ? currentAdmin.id : 0}
    />
  );
}
