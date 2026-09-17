import { MediaLibrary } from "@/components/admin/admin-management";
import { getAdminMediaAssets } from "@/lib/content";

export default async function AdminMediaPage() { return <MediaLibrary media={await getAdminMediaAssets()} />; }
