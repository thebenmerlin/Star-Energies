import { CapabilityEditor } from "@/components/admin/catalogue-management";
import { getCapabilities, getMediaAssets } from "@/lib/content";
import type { Capability } from "@/types/content";

const newCapability: Capability = { id: "new-capability", slug: "", title: "", shortDescription: "", featured: false, active: false, status: "draft", displayOrder: 8 };

export default function NewCapabilityPage() { return <CapabilityEditor initial={{ ...newCapability, displayOrder: getCapabilities().length + 1 }} media={getMediaAssets()} />; }
