import { Arrow } from "@/components/arrow";
import { EditorialLines, LineBreaks } from "@/components/content-text";
import { SectionLabel } from "@/components/page-primitives";
import { getCapabilitiesPage } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return createMetadata((await getCapabilitiesPage()).content.seo);
}

export default async function CapabilitiesPage() {
  const { content, capabilities } = await getCapabilitiesPage();

  return <main>
    <section className="capabilities-opening" aria-labelledby="capabilities-title"><div className="capabilities-opening__rings" aria-hidden="true"><i /><i /><i /></div><div className="shell-grid capabilities-opening__grid"><SectionLabel inverse>{content.opening.label}</SectionLabel><div><h1 id="capabilities-title"><EditorialLines lines={content.opening.heading} /></h1><p>{content.opening.body}</p></div><div className="capabilities-opening__key"><span>{content.opening.key[0]}</span><b><LineBreaks text={content.opening.key[1]} /></b></div></div></section>

    <section className="capability-index section section--white" aria-labelledby="capability-index-title"><div className="shell-grid capability-index__head"><SectionLabel>{content.index.label}</SectionLabel><h2 id="capability-index-title">{content.index.heading}</h2></div><div className="capability-index__list">{capabilities.map((capability, index) => <article key={capability.id}><span>{String(capability.displayOrder).padStart(2, "0")}</span><h3>{capability.title}</h3><p>{capability.shortDescription}</p><b>{index % 2 === 0 ? "↗" : "→"}</b></article>)}</div></section>

    <section className="capabilities-volume section section--stone" aria-labelledby="volume-title"><div className="shell-grid capabilities-volume__grid"><div><SectionLabel>{content.volume.label}</SectionLabel><h2 id="volume-title"><EditorialLines lines={content.volume.heading} /></h2></div><div><p>{content.volume.body}</p><div className="capabilities-volume__axis"><span>{content.volume.axis[0]}</span><i /><span>{content.volume.axis[1]}</span></div></div></div></section>

    <section className="capabilities-commercial section section--ink" aria-labelledby="commercial-title"><div className="shell-grid capabilities-commercial__grid"><div><SectionLabel inverse>{content.commercial.label}</SectionLabel><h2 id="commercial-title"><EditorialLines lines={content.commercial.heading} /></h2></div><div className="capabilities-commercial__table"><div><span>{content.commercial.tableHeadings[0]}</span><span>{content.commercial.tableHeadings[1]}</span></div>{content.commercial.rows.map((row) => <div key={row.id}><b>{row.title}</b><p>{row.description}</p></div>)}</div></div></section>

    <section className="capabilities-direct section section--mineral"><div className="shell-grid capabilities-direct__grid"><p><LineBreaks text={content.direct.eyebrow} /></p><h2><EditorialLines lines={content.direct.heading} /></h2><div><a className="button button--dark" href={content.direct.primaryCTA.href}>{content.direct.primaryCTA.label} <Arrow diagonal /></a><a className="capabilities-direct__phone" href={content.direct.secondaryCTA.href}>{content.direct.secondaryCTA.label} <Arrow diagonal /></a></div></div></section>
  </main>;
}
