import { SettingsEditor } from "@/components/admin/admin-management";
import { getSiteSettings } from "@/lib/content";

export default function AdminSettingsPage() { return <SettingsEditor initial={getSiteSettings()} />; }
