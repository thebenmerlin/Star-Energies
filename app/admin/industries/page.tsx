import { IndustriesManager } from "@/components/admin/catalogue-management";
import { getAdminIndustries } from "@/lib/content";

export default async function AdminIndustriesPage() { return <IndustriesManager industries={await getAdminIndustries()} />; }
