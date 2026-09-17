import { AboutContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";

export default async function AdminAboutContentPage() {
  const { about } = await getAdminContentData();
  return <AboutContentEditor content={about} />;
}
