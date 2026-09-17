import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/catalogue-management";
import { getAdminMediaAssets, getAdminProducts } from "@/lib/content";

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [products, media] = await Promise.all([getAdminProducts(), getAdminMediaAssets()]);
  const product = products.find((item) => item.id === id);
  if (!product) notFound();
  return <ProductEditor initial={product} media={media} />;
}
