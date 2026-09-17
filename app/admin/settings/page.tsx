import { SettingsEditor } from "@/components/admin/admin-management";
import { getAdminSiteSettings } from "@/lib/content";

export default async function AdminSettingsPage() { return <SettingsEditor initial={await getAdminSiteSettings()} />; }
