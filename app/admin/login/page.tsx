import { redirect } from "next/navigation";

import { AdminLogin } from "@/components/admin/admin-login";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <AdminLogin />;
}
