import { IndustryEditor } from "@/components/admin/catalogue-management";
import { getIndustries, getMediaAssets } from "@/lib/content";
import type { Industry } from "@/types/content";

const newIndustry: Industry = { id: "new-industry", slug: "", name: "", shortDescription: "", featured: false, active: false, status: "draft", displayOrder: 7 };

export default function NewIndustryPage() { return <IndustryEditor initial={{ ...newIndustry, displayOrder: getIndustries().length + 1 }} media={getMediaAssets()} isNew />; }
