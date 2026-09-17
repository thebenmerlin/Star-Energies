import { OperationsContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";

export default function AdminOperationsPage() {
  const { operations, media } = getAdminContentData();
  return <OperationsContentEditor content={operations} media={media} />;
}
