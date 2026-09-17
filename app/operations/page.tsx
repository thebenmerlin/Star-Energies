import { Fragment } from "react";
import { Arrow } from "@/components/arrow";
import { EditorialLines } from "@/components/content-text";
import { MediaPlate } from "@/components/media-plate";
import { ArrowLink, SectionLabel } from "@/components/page-primitives";
import { getOperationsPage, getSiteSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import type { CoverageRegion } from "@/types/content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return createMetadata((await getOperationsPage()).content.seo);
}

function OperationsMap({ regions, origin, note }: { regions: readonly CoverageRegion[]; origin: string; note: string }) {
  const labelFor = (id: string) => regions.find((region) => region.id === id)?.mapLabel ?? "";
  return <svg className="operations-map" viewBox="0 0 650 500" role="img" aria-label="Diagram showing Wani connected to regions where the business has industry experience">
    <path className="operations-map__land" d="M310 28 351 50l7 45 42 31-8 42 31 39-17 43 24 48-25 55-6 59-33 20-35-41-21-47-35-26 3-47-37-49 7-61 30-34 18-47 37-18z" />
    <g className="operations-map__routes"><path d="M284 213C211 209 155 200 55 161" /><path d="M284 213C239 134 191 91 152 51" /><path d="M284 213C348 176 440 147 558 140" /><path d="M284 213C369 259 444 293 569 325" /><path d="M284 213C267 296 220 366 125 416" /></g>
    <g className="operations-map__nodes"><circle cx="284" cy="213" r="8" /><circle cx="55" cy="161" r="4" /><circle cx="152" cy="51" r="4" /><circle cx="558" cy="140" r="4" /><circle cx="569" cy="325" r="4" /><circle cx="125" cy="416" r="4" /></g>
    <g className="operations-map__labels"><text x="298" y="207">{origin.toUpperCase()}</text><text x="5" y="148">{labelFor("gujarat")}</text><text x="93" y="35">{labelFor("maharashtra")}</text><text x="480" y="128">{labelFor("andhra-visakhapatnam")}</text><text x="505" y="347">{labelFor("telangana-hyderabad")}</text><text x="61" y="441">{labelFor("karnataka")}</text></g>
    <text className="operations-map__note" x="6" y="480">{note}</text>
  </svg>;
}

export default async function OperationsPage() {
  const [{ content, coverageRegions }, siteSettings] = await Promise.all([getOperationsPage(), getSiteSettings()]);

  return <main>
    <section className="operations-opening" aria-labelledby="operations-title"><MediaPlate asset={content.opening.media} className="operations-opening__media" caption={content.opening.mediaCaption} /><div className="operations-opening__copy"><SectionLabel inverse>{content.opening.label}</SectionLabel><h1 id="operations-title"><EditorialLines lines={content.opening.heading} /></h1><p>{content.opening.body}</p><span>{content.opening.locationLabel}</span></div></section>

    <section className="operations-sequence section section--white" aria-labelledby="operations-sequence-title"><div className="shell-grid operations-sequence__head"><SectionLabel>{content.sequence.label}</SectionLabel><h2 id="operations-sequence-title">{content.sequence.heading}</h2></div><div className="operations-sequence__line">{content.sequence.items.map((item, index) => <Fragment key={item.id}><article><span>{String(item.displayOrder).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></article>{index < content.sequence.items.length - 1 && <i>→</i>}</Fragment>)}</div></section>

    <section className="operations-coverage section section--mineral" aria-labelledby="coverage-title"><div className="shell-grid operations-coverage__grid"><div><SectionLabel>{content.coverage.label}</SectionLabel><h2 id="coverage-title"><EditorialLines lines={content.coverage.heading} /></h2><p>{content.coverage.body}</p><ul>{coverageRegions.map((region) => <li key={region.id}><span>{String(region.displayOrder).padStart(2, "0")}</span>{region.label}</li>)}</ul></div><OperationsMap regions={coverageRegions} origin={siteSettings.address.city} note={content.coverage.mapNote} /></div></section>

    <section className="operations-transport section section--graphite"><div className="shell-grid operations-transport__grid"><div><span>{content.transport.eyebrow}</span><h2><EditorialLines lines={content.transport.heading} /></h2></div><div><p>{content.transport.lead}</p><p>{content.transport.body}</p><ArrowLink inverse href={content.transport.cta.href}>{content.transport.cta.label}</ArrowLink></div></div></section>

    <section className="page-cta page-cta--light"><div className="shell-grid"><div><span>{content.finalCTA.eyebrow}</span><h2><EditorialLines lines={content.finalCTA.heading} /></h2></div><a className="button button--dark" href={content.finalCTA.cta.href}>{content.finalCTA.cta.label} <Arrow diagonal /></a></div></section>
  </main>;
}
