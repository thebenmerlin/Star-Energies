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

import { IndiaRouteMap } from "@/components/india-route-map";

function OperationsMap({ regions, origin, note }: { regions: readonly CoverageRegion[]; origin: string; note: string }) {
  return (
    <IndiaRouteMap
      className="operations-map"
      regions={regions}
      origin={origin}
      note={note}
      ariaLabel="Diagram showing Wani connected to regions where the business has industry experience"
    />
  );
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
