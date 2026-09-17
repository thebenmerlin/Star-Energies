import { Arrow } from "@/components/arrow";
import { EditorialLines } from "@/components/content-text";
import { ArrowLink, SectionLabel } from "@/components/page-primitives";
import { getAboutPage } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return createMetadata((await getAboutPage()).seo);
}

export default async function AboutPage() {
  const content = await getAboutPage();
  return <main>
    <section className="about-opening" aria-labelledby="about-title"><div className="shell-grid about-opening__grid"><SectionLabel inverse>{content.opening.label}</SectionLabel><div className="about-opening__statement"><p>{content.opening.statement}</p><h1 id="about-title"><EditorialLines lines={content.opening.heading} /></h1></div><div className="about-opening__measure"><span>{content.opening.experiencePrefix}</span><strong>{content.opening.experienceValue}</strong><span>{content.opening.experienceLabel}</span></div></div><div className="about-opening__foot"><span>{content.opening.footLabels[0]}</span><span>{content.opening.footLabels[1]}</span></div></section>

    <section className="about-distinction section section--mineral"><div className="shell-grid about-distinction__grid"><div><SectionLabel>{content.distinction.label}</SectionLabel></div><div className="about-distinction__copy"><p className="about-distinction__lead">{content.distinction.lead}</p><p>{content.distinction.body}</p></div><div className="about-distinction__marker"><span>{content.distinction.markers[0]}</span><i /><span>{content.distinction.markers[1]}</span></div></div></section>

    <section className="about-approach section section--white" aria-labelledby="approach-title"><div className="shell-grid about-approach__top"><SectionLabel>{content.approach.label}</SectionLabel><h2 id="approach-title">{content.approach.heading}</h2></div><div className="about-approach__rows">{content.approach.items.map((item) => <article key={item.id}><span>{String(item.displayOrder).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>

    <section className="about-people section section--ink" aria-labelledby="people-title"><div className="shell-grid about-people__grid"><div><SectionLabel inverse>{content.people.label}</SectionLabel><p className="about-people__intro">{content.people.intro}</p></div><div className="about-people__names" id="people-title">{content.people.entries.map((entry) => <article key={entry.id}><span>{entry.label}</span><h2>{entry.name}</h2><p>{entry.description}</p></article>)}</div></div></section>

    <section className="about-ambition section section--stone" aria-labelledby="ambition-title"><div className="shell-grid about-ambition__grid"><SectionLabel>{content.ambition.label}</SectionLabel><div><h2 id="ambition-title"><EditorialLines lines={content.ambition.heading} /></h2><p>{content.ambition.body}</p><ArrowLink href={content.ambition.cta.href}>{content.ambition.cta.label}</ArrowLink></div><div className="about-ambition__coordinates"><span>{content.ambition.coordinates[0]}</span><i /><span>{content.ambition.coordinates[1]}</span><small>{content.ambition.coordinates[2]}</small></div></div></section>

    <section className="page-cta page-cta--dark"><div className="shell-grid"><div><span>{content.finalCTA.eyebrow}</span><h2><EditorialLines lines={content.finalCTA.heading} /></h2></div><a className="button button--amber" href={content.finalCTA.primaryCTA.href}>{content.finalCTA.primaryCTA.label} <Arrow diagonal /></a><a className="page-cta__text" href={content.finalCTA.secondaryCTA.href}>{content.finalCTA.secondaryCTA.label} <Arrow diagonal /></a></div></section>
  </main>;
}
