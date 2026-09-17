import { SeoManager, type SeoPage } from "@/components/admin/admin-management";
import { getAboutPage, getCapabilitiesPage, getCoalPage, getContactPage, getHomePage, getIndustriesPage, getOperationsPage } from "@/lib/content";

export default function AdminSeoPage() {
  const pages: SeoPage[] = [
    { id: "home", label: "Home", path: "/", seo: getHomePage().content.seo },
    { id: "about", label: "About", path: "/about", seo: getAboutPage().seo },
    { id: "coal", label: "Coal & Products", path: "/coal", seo: getCoalPage().content.seo },
    { id: "industries", label: "Industries", path: "/industries", seo: getIndustriesPage().content.seo },
    { id: "capabilities", label: "Capabilities", path: "/capabilities", seo: getCapabilitiesPage().content.seo },
    { id: "operations", label: "Operations", path: "/operations", seo: getOperationsPage().content.seo },
    { id: "contact", label: "Contact", path: "/contact", seo: getContactPage().content.seo },
  ];
  return <SeoManager pages={pages} />;
}
