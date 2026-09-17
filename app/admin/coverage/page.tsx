import { CoverageManager } from "@/components/admin/admin-management";
import { getAdminCoverageRegions } from "@/lib/content";

export default async function AdminCoveragePage() { return <CoverageManager regions={await getAdminCoverageRegions()} />; }
