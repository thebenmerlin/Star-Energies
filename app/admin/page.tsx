import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminDashboardData } from "@/lib/admin-content";

export default function AdminDashboardPage() {
  return <AdminDashboard {...getAdminDashboardData()} />;
}
