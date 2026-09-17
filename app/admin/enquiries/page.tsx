import { EnquiriesManager } from "@/components/admin/admin-management";
import { getAdminEnquiries } from "@/lib/admin-content";

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; sort?: string; page?: string }> }) {
  const params = await searchParams;
  const sort = params.sort === "oldest" ? "oldest" : "newest";
  const page = Number.parseInt(params.page ?? "1", 10);
  const result = await getAdminEnquiries({
    query: params.q,
    status: params.status,
    sort,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });
  return <EnquiriesManager result={result} initialQuery={params.q ?? ""} initialStatus={params.status ?? "all"} initialSort={sort} />;
}
