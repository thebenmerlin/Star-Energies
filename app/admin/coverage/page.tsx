import { CoverageManager } from "@/components/admin/admin-management";
import { getCoverageRegions } from "@/lib/content";

export default function AdminCoveragePage() { return <CoverageManager regions={getCoverageRegions()} />; }
