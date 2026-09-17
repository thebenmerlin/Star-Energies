import { HomeContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";

export default function AdminHomeContentPage() {
  const { home, media } = getAdminContentData();
  return <HomeContentEditor content={home} media={media} />;
}
