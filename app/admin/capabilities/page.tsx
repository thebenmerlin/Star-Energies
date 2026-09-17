import { CapabilitiesManager } from "@/components/admin/catalogue-management";
import { getCapabilities } from "@/lib/content";

export default function AdminCapabilitiesPage() { return <CapabilitiesManager capabilities={getCapabilities()} />; }
