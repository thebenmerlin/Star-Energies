import { Arrow } from "@/components/arrow";
import { EditorialLines, LineBreaks } from "@/components/content-text";
import { SectionLabel } from "@/components/page-primitives";
import { getPrivacyPage, getSiteSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

const content = getPrivacyPage();
export const metadata = createMetadata(content.seo);

export default function PrivacyPage() {
  const siteSettings = getSiteSettings();

  return <main>
    <section className="privacy-opening"><div className="shell-grid privacy-opening__grid"><SectionLabel>{content.opening.label}</SectionLabel><div><h1><EditorialLines lines={content.opening.heading} /></h1><p>{content.opening.body}</p></div><span><LineBreaks text={content.opening.lastUpdated} /></span></div></section>
    <section className="privacy-content section section--white"><div className="shell-grid privacy-content__grid"><aside><span>CONTENTS</span>{content.sections.map((section) => <a href={`#privacy-${section.id}`} key={section.id}>{String(section.displayOrder).padStart(2, "0")} {section.title}</a>)}</aside><div>{content.sections.map((section) => <article id={`privacy-${section.id}`} key={section.id}><span>{String(section.displayOrder).padStart(2, "0")}</span><h2>{section.title}</h2><p>{section.text}</p></article>)}<div className="privacy-content__contact"><p>{content.contactText}</p><a href={siteSettings.contact.emailHref}>{siteSettings.contact.email} <Arrow diagonal /></a></div></div></div></section>
  </main>;
}
