import { Arrow } from "@/components/arrow";
import { EditorialLines } from "@/components/content-text";
import { MediaPlate } from "@/components/media-plate";
import { ArrowLink, SectionLabel } from "@/components/page-primitives";
import { getIndustriesPage } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return createMetadata((await getIndustriesPage()).content.seo);
}

export default async function IndustriesPage() {
  const { content, industries } = await getIndustriesPage();

  return <main>
    <section className="industries-opening" aria-labelledby="industries-page-title"><div className="shell-grid industries-opening__grid"><SectionLabel inverse>{content.opening.label}</SectionLabel><div><p>{content.opening.statement}</p><h1 id="industries-page-title"><EditorialLines lines={content.opening.heading} /></h1></div><span className="industries-opening__index">{content.opening.indexLabel}</span></div></section>

    <section className="industry-directory section section--mineral" aria-labelledby="directory-title"><div className="shell-grid industry-directory__intro"><SectionLabel>{content.directory.label}</SectionLabel><div><h2 id="directory-title">{content.directory.heading}</h2><p>{content.directory.body}</p></div></div><div className="industry-directory__layout"><div className="industry-directory__rows">{industries.map((industry, index) => <article className="industry-entry" key={industry.id}><span>{String(industry.displayOrder).padStart(2, "0")}</span><h3>{industry.name}</h3><p>{industry.shortDescription}</p><i>{index % 2 === 0 ? "↗" : "↓"}</i></article>)}</div><MediaPlate asset={content.directory.media} className="industry-directory__media" caption={content.directory.mediaCaption} /></div></section>

    <section className="industries-logic section section--white" aria-labelledby="industries-logic-title"><div className="shell-grid industries-logic__grid"><div><SectionLabel>{content.logic.label}</SectionLabel><h2 id="industries-logic-title">{content.logic.heading}</h2></div><div className="industries-logic__questions">{content.logic.questions.map((question, index) => <p key={question}><span>{String(index + 1).padStart(2, "0")}</span>{question}</p>)}</div></div></section>

    <section className="industries-other section section--graphite"><div className="shell-grid industries-other__grid"><div><span>{content.other.eyebrow}</span><h2><EditorialLines lines={content.other.heading} /></h2></div><div><p>{content.other.body}</p><ArrowLink inverse href={content.other.cta.href}>{content.other.cta.label}</ArrowLink></div></div></section>

    <section className="page-cta page-cta--light"><div className="shell-grid"><div><span>{content.finalCTA.eyebrow}</span><h2><EditorialLines lines={content.finalCTA.heading} /></h2></div><a className="button button--dark" href={content.finalCTA.cta.href}>{content.finalCTA.cta.label} <Arrow diagonal /></a></div></section>
  </main>;
}
