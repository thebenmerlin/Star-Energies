import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { routes } from "@/content/routes";
import { getSiteSettings } from "@/lib/content";

export default async function NotFound() {
  const siteSettings = await getSiteSettings();
  return (
    <main className="not-found-page">
      <div className="not-found-page__top"><span>PAGE STATE / 404</span><span>{siteSettings.brandName}</span></div>
      <div className="not-found-page__grid"><span className="not-found-page__number">404</span><div><p>THE PAGE YOU REQUESTED IS NOT HERE.</p><h1>Let’s get back<br /><em>to the useful work.</em></h1><nav aria-label="Helpful links"><Link href={routes.home}>Home <Arrow diagonal /></Link><Link href={routes.coal}>Coal &amp; Products <Arrow diagonal /></Link><Link href={routes.contact}>Contact <Arrow diagonal /></Link></nav></div></div>
    </main>
  );
}
