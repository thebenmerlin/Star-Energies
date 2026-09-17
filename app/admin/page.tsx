import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminDashboardData } from "@/lib/admin-content";

export default async function AdminDashboardPage() {
  return <AdminDashboard {...(await getAdminDashboardData())} />;
}
