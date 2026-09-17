import { CapabilitiesManager } from "@/components/admin/catalogue-management";
import { getAdminCapabilities } from "@/lib/content";

export default async function AdminCapabilitiesPage() { return <CapabilitiesManager capabilities={await getAdminCapabilities()} />; }
