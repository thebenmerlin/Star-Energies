import { SeoManager, type SeoPage } from "@/components/admin/admin-management";
import { getAdminPageContent } from "@/lib/content";

export default async function AdminSeoPage() {
  const [home, about, coal, industries, capabilities, operations, contact] = await Promise.all([
    getAdminPageContent("home"), getAdminPageContent("about"), getAdminPageContent("coal"), getAdminPageContent("industries"), getAdminPageContent("capabilities"), getAdminPageContent("operations"), getAdminPageContent("contact"),
  ]);
  const pages: SeoPage[] = [
    { id: "home", label: "Home", path: "/", seo: home.seo },
    { id: "about", label: "About", path: "/about", seo: about.seo },
    { id: "coal", label: "Coal & Products", path: "/coal", seo: coal.seo },
    { id: "industries", label: "Industries", path: "/industries", seo: industries.seo },
    { id: "capabilities", label: "Capabilities", path: "/capabilities", seo: capabilities.seo },
    { id: "operations", label: "Operations", path: "/operations", seo: operations.seo },
    { id: "contact", label: "Contact", path: "/contact", seo: contact.seo },
  ];
  return <SeoManager pages={pages} />;
}
