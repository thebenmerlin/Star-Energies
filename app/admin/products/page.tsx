import { ProductsManager } from "@/components/admin/catalogue-management";
import { getAdminProducts } from "@/lib/content";

export default async function AdminProductsPage() {
  return <ProductsManager products={await getAdminProducts()} />;
}
