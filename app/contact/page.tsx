import type { Metadata } from "next";
import { Arrow } from "@/components/arrow";
import { QuoteForm } from "@/components/quote-form";
import { RequirementPrompt, SectionLabel } from "@/components/page-primitives";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Star Energies",
  description: "Discuss an industrial coal requirement with Star Energies in Wani, Maharashtra.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="contact-opening" aria-labelledby="contact-title">
        <div className="shell-grid contact-opening__grid"><div><SectionLabel>Contact / 01</SectionLabel><h1 id="contact-title">A serious requirement<br /><em>deserves a direct line.</em></h1><p>Call, WhatsApp or email Star Energies. If a quote form is useful, use the structured brief below.</p></div><address className="contact-opening__channels"><a href={siteConfig.contact.phoneHref}><span>PHONE</span>{siteConfig.contact.phoneDisplay}<Arrow diagonal /></a><a href={siteConfig.contact.whatsappHref}><span>WHATSAPP</span>Start a conversation<Arrow diagonal /></a><a href={siteConfig.contact.emailHref}><span>EMAIL</span>{siteConfig.contact.email}<Arrow diagonal /></a><p>{siteConfig.location}</p></address></div>
      </section>

      <section className="contact-form-section section section--stone" id="quote" aria-labelledby="quote-title">
        <div className="shell-grid contact-form-section__grid"><div className="contact-form-section__aside"><SectionLabel>Request a quote / 02</SectionLabel><h2 id="quote-title">Start with<br /><em>what you know.</em></h2><RequirementPrompt /><p>Technical fields are optional because not every buyer will have every detail to hand. We can discuss the missing information directly.</p></div><QuoteForm /></div>
      </section>

      <section className="contact-reassurance section section--ink"><div className="shell-grid contact-reassurance__grid"><span>NO NEED TO WAIT FOR A PERFECT BRIEF.</span><p>If you know the application, quantity and delivery destination, that is enough to start a useful conversation.</p><a className="button button--amber" href={siteConfig.contact.whatsappHref}>WhatsApp Star Energies <Arrow diagonal /></a></div></section>
    </main>
  );
}
