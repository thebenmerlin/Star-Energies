import { IndustriesManager } from "@/components/admin/catalogue-management";
import { getIndustries } from "@/lib/content";

export default function AdminIndustriesPage() { return <IndustriesManager industries={getIndustries()} />; }
