import { AboutContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";

export default function AdminAboutContentPage() {
  const { about, media } = getAdminContentData();
  return <AboutContentEditor content={about} media={media} />;
}
