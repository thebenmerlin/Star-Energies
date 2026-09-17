import { MediaLibrary } from "@/components/admin/admin-management";
import { getMediaAssets } from "@/lib/content";

export default function AdminMediaPage() { return <MediaLibrary media={getMediaAssets()} />; }
