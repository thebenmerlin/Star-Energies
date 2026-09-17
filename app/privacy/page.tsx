import type { Metadata } from "next";
import { Arrow } from "@/components/arrow";
import { SectionLabel } from "@/components/page-primitives";
import { privacySections, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy | Star Energies",
  description: "Placeholder privacy notice for Star Energies website enquiries and business information.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="privacy-opening"><div className="shell-grid privacy-opening__grid"><SectionLabel>Privacy / launch preparation</SectionLabel><div><h1>Clear information,<br /><em>pending legal review.</em></h1><p>This is a structured placeholder notice for the public website. Final legal wording should be reviewed before the website goes live.</p></div><span>LAST UPDATED<br />SEPTEMBER 2026</span></div></section>
      <section className="privacy-content section section--white"><div className="shell-grid privacy-content__grid"><aside><span>CONTENTS</span>{privacySections.map((section, index) => <a href={`#privacy-${index + 1}`} key={section.title}>{String(index + 1).padStart(2, "0")} {section.title}</a>)}</aside><div>{privacySections.map((section, index) => <article id={`privacy-${index + 1}`} key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2><p>{section.text}</p></article>)}<div className="privacy-content__contact"><p>For privacy-related questions, contact Star Energies directly.</p><a href={siteConfig.contact.emailHref}>{siteConfig.contact.email} <Arrow diagonal /></a></div></div></div></section>
    </main>
  );
}
