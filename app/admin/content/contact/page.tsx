import { ContactContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";

export default async function AdminContactContentPage() {
  const { contact } = await getAdminContentData();
  return <ContactContentEditor content={contact} />;
}
