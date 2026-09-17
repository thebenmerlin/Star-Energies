import { ContactContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";

export default function AdminContactContentPage() {
  const { contact } = getAdminContentData();
  return <ContactContentEditor content={contact} />;
}
