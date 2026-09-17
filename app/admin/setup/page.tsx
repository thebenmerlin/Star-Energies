import { redirect } from "next/navigation";

import { AdminSetup } from "@/components/admin/admin-setup";
import { isAdminSetupAvailable } from "@/lib/admin-setup";
import { getAdminSession } from "@/lib/auth";

export default async function AdminSetupPage() {
  if (await getAdminSession()) redirect("/admin");
  if (!(await isAdminSetupAvailable())) redirect("/admin/login");
  return <AdminSetup />;
}
