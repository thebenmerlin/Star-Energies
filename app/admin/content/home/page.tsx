import { HomeContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";

export default async function AdminHomeContentPage() {
  const { home, media } = await getAdminContentData();
  return <HomeContentEditor content={home} media={media} />;
}
