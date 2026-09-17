import { OperationsContentEditor } from "@/components/admin/content-editors";
import { getAdminContentData } from "@/lib/admin-content";

export default async function AdminOperationsPage() {
  const { operations, media } = await getAdminContentData();
  return <OperationsContentEditor content={operations} media={media} />;
}
