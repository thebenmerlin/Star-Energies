import { Arrow } from "@/components/arrow";
import { EditorialLines } from "@/components/content-text";
import { QuoteForm } from "@/components/quote-form";
import { RequirementPrompt, SectionLabel } from "@/components/page-primitives";
import { getContactPage, getSiteSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

const contactData = getContactPage();
export const metadata = createMetadata(contactData.content.seo);

export default function ContactPage() {
  const { content, requirementDimensions } = contactData;
  const siteSettings = getSiteSettings();

  return <main>
    <section className="contact-opening" aria-labelledby="contact-title"><div className="shell-grid contact-opening__grid"><div><SectionLabel>{content.opening.label}</SectionLabel><h1 id="contact-title"><EditorialLines lines={content.opening.heading} /></h1><p>{content.opening.body}</p></div><address className="contact-opening__channels"><a href={siteSettings.contact.phoneHref}><span>{content.opening.channelLabels[0]}</span>{siteSettings.contact.phoneDisplay}<Arrow diagonal /></a><a href={siteSettings.contact.whatsappHref}><span>{content.opening.channelLabels[1]}</span>{content.opening.whatsappLabel}<Arrow diagonal /></a><a href={siteSettings.contact.emailHref}><span>{content.opening.channelLabels[2]}</span>{siteSettings.contact.email}<Arrow diagonal /></a><p>{siteSettings.address.display}</p></address></div></section>

    <section className="contact-form-section section section--stone" id="quote" aria-labelledby="quote-title"><div className="shell-grid contact-form-section__grid"><div className="contact-form-section__aside"><SectionLabel>{content.formIntro.label}</SectionLabel><h2 id="quote-title"><EditorialLines lines={content.formIntro.heading} /></h2><RequirementPrompt label={content.formIntro.requirementPromptLabel} dimensions={requirementDimensions} /><p>{content.formIntro.helper}</p></div><QuoteForm content={content.formIntro.quoteForm} /></div></section>

    <section className="contact-reassurance section section--ink"><div className="shell-grid contact-reassurance__grid"><span>{content.reassurance.eyebrow}</span><p>{content.reassurance.body}</p><a className="button button--amber" href={content.reassurance.cta.href}>{content.reassurance.cta.label} <Arrow diagonal /></a></div></section>
  </main>;
}
