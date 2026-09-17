import { ProductEditor } from "@/components/admin/catalogue-management";
import { getAdminMediaAssets, getAdminProducts } from "@/lib/content";
import type { Product } from "@/types/content";

const newProduct: Product = { id: "new-product", slug: "", name: "", shortDescription: "", featured: false, active: false, status: "draft", displayOrder: 5, consideredAgainst: "YOUR FULL BRIEF" };

export default async function NewProductPage() {
  const [products, media] = await Promise.all([getAdminProducts(), getAdminMediaAssets()]);
  return <ProductEditor initial={{ ...newProduct, id: crypto.randomUUID(), displayOrder: products.length + 1 }} media={media} isNew />;
}
