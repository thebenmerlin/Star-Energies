import { notFound } from "next/navigation";
import { CapabilityEditor } from "@/components/admin/catalogue-management";
import { getAdminCapabilities, getAdminMediaAssets } from "@/lib/content";

export default async function CapabilityEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [capabilities, media] = await Promise.all([getAdminCapabilities(), getAdminMediaAssets()]);
  const capability = capabilities.find((item) => item.id === id);
  if (!capability) notFound();
  return <CapabilityEditor initial={capability} media={media} />;
}
