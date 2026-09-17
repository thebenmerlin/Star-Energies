import { EnquiriesManager } from "@/components/admin/admin-management";
import { getAdminEnquiries } from "@/lib/admin-content";

export default async function AdminEnquiriesPage() { return <EnquiriesManager enquiries={await getAdminEnquiries()} />; }
