import type { CSSProperties } from "react";
import { Arrow } from "@/components/arrow";
import { EditorialLines, LineBreaks } from "@/components/content-text";
import { ArrowLink, SectionLabel } from "@/components/page-primitives";
import { ScrollHoverList } from "@/components/scroll-hover-list";
import { getHomePage, getSiteSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import type { CoverageRegion } from "@/types/content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return createMetadata((await getHomePage()).content.seo);
}

function CapabilityDiagram({ labels }: { labels: readonly [string, string] }) {
  return <div className="capability-diagram" aria-hidden="true"><div className="capability-diagram__orbit" /><div className="capability-diagram__ring capability-diagram__ring--one" /><div className="capability-diagram__ring capability-diagram__ring--two" /><span className="capability-diagram__label capability-diagram__label--one"><LineBreaks text={labels[0]} /></span><span className="capability-diagram__label capability-diagram__label--two"><LineBreaks text={labels[1]} /></span><span className="capability-diagram__dot capability-diagram__dot--one" /><span className="capability-diagram__dot capability-diagram__dot--two" /></div>;
}

import { IndiaRouteMap } from "@/components/india-route-map";

function RouteDiagram({ regions, note }: { regions: readonly CoverageRegion[]; note: string }) {
  return (
    <IndiaRouteMap
      className="route-diagram"
      regions={regions}
      origin="Wani"
      note={note}
      ariaLabel="Operating experience connecting Wani with industrial regions across India"
    />
  );
}

export default async function HomePage() {
  const [{ content, products, industries, coverageRegions, qualityParameters, requirementDimensions }, siteSettings] = await Promise.all([getHomePage(), getSiteSettings()]);
  const heroMediaStyle = { "--hero-media": `url("${content.hero.media.url}")` } as CSSProperties;
  const sourcingMediaStyle = { "--plate-image": `url("${content.sourcing.media.url}")` } as CSSProperties;
  const facilityMediaStyle = { "--plate-image": `url("${content.facility.media.url}")` } as CSSProperties;

  return <main>
    <section className="hero" aria-labelledby="hero-title"><div className="hero__grid-lines" aria-hidden="true" /><div className="hero__inner"><div className="hero__meta fade-up"><span>{content.hero.meta[0]}</span><span>{content.hero.meta[1]}</span></div><div className="hero__content"><p className="hero__kicker fade-up fade-up--delay-1">{content.hero.kicker}</p><h1 id="hero-title" className="hero__title fade-up fade-up--delay-2"><EditorialLines lines={content.hero.heading} /></h1><div className="hero__actions fade-up fade-up--delay-3"><a className="button button--amber" href={content.hero.primaryCTA.href}>{content.hero.primaryCTA.label} <Arrow diagonal /></a><a className="hero__contact" href={content.hero.secondaryCTA.href}><span>{content.hero.secondaryCTA.label}</span><Arrow diagonal /></a></div></div><div className="hero__scene fade-up fade-up--delay-3" style={heroMediaStyle} role="img" aria-label={content.hero.media.altText} data-media-id={content.hero.media.id}><div className="hero__scene-media" /><div className="hero__scene-grid" /><div className="hero__scene-mass hero__scene-mass--one" /><div className="hero__scene-mass hero__scene-mass--two" /><div className="hero__scene-mass hero__scene-mass--three" /><span className="scene-caption"><LineBreaks text={content.hero.sceneCaption} /></span><span className="scene-scale">{content.hero.sceneScale}</span></div><div className="hero__brief fade-up fade-up--delay-4" aria-label="Key coal requirement parameters">{requirementDimensions.map((dimension) => <span key={dimension.id}>{dimension.label.toUpperCase()}</span>)}</div></div><div className="hero__bottom"><span>{content.hero.scrollLabel}</span><i /><span>{content.hero.progressLabel}</span></div></section>

    <section className="capability section section--mineral" id="capabilities" aria-labelledby="capability-title"><div className="shell-grid capability__grid"><div className="capability__side"><SectionLabel>{content.capabilityIntro.label}</SectionLabel><p className="technical-copy">{content.capabilityIntro.technicalCopy}</p></div><div className="capability__main"><p className="section-intro">{content.capabilityIntro.intro}</p><h2 id="capability-title"><EditorialLines lines={content.capabilityIntro.heading} /></h2><p className="capability__body">{content.capabilityIntro.body}</p><ArrowLink href={content.capabilityIntro.cta.href}>{content.capabilityIntro.cta.label}</ArrowLink></div><CapabilityDiagram labels={content.capabilityIntro.diagramLabels} /></div></section>

    <section className="requirement section section--graphite" id="requirement" aria-labelledby="requirement-title"><div className="shell-grid"><div className="requirement__intro"><SectionLabel inverse>{content.requirementSourcing.label}</SectionLabel><h2 id="requirement-title">{content.requirementSourcing.heading}</h2><p>{content.requirementSourcing.body}</p></div><ScrollHoverList className="requirement__sequence">{requirementDimensions.map((dimension) => <article className="requirement-step" data-scroll-hover-row key={dimension.id}><span className="requirement-step__number">{String(dimension.displayOrder).padStart(2, "0")}</span><div><h3>{dimension.label}</h3><p>{dimension.detail}</p></div><span className="requirement-step__cross" aria-hidden="true">+</span></article>)}<div className="requirement__result"><span>{content.requirementSourcing.resultLabel}</span><strong><EditorialLines lines={content.requirementSourcing.result} /></strong><Arrow diagonal /></div></ScrollHoverList></div></section>

    <section className="sourcing section section--white" id="coal" aria-labelledby="sourcing-title"><div className="shell-grid sourcing__grid"><div className="sourcing__intro"><SectionLabel>{content.sourcing.label}</SectionLabel><h2 id="sourcing-title">{content.sourcing.heading}</h2><p>{content.sourcing.body}</p></div><div className="sourcing__list">{products.map((product) => <article className="source-row" key={product.id}><span>{String(product.displayOrder).padStart(2, "0")}</span><h3>{product.name}</h3><p>{product.shortDescription}</p><Arrow diagonal /></article>)}</div><figure className="sourcing__media image-plate image-plate--coal" style={sourcingMediaStyle} role="img" aria-label={content.sourcing.media.altText} data-media-id={content.sourcing.media.id}><div className="image-plate__grain" /><figcaption><span>{content.sourcing.mediaCaption[0]}</span><span>{content.sourcing.mediaCaption[1]}</span></figcaption></figure></div></section>

    <section className="industries section section--ink" id="industries" aria-labelledby="industries-title"><div className="shell-grid industries__top"><SectionLabel inverse>{content.industries.label}</SectionLabel><p>{content.industries.body}</p></div><ScrollHoverList className="industries__list" id="industries-title">{industries.map((industry) => <div className="industry-line" data-scroll-hover-row key={industry.id}><span>{String(industry.displayOrder).padStart(2, "0")}</span><h2>{industry.name}</h2><i /></div>)}</ScrollHoverList><div className="shell-grid industries__foot"><span>{content.industries.footLabels[0]}</span><span>{content.industries.footLabels[1]}</span></div></section>

    <section className="routes section section--mineral" aria-labelledby="routes-title"><div className="shell-grid routes__grid"><div className="routes__copy"><SectionLabel>{content.coverage.label}</SectionLabel><h2 id="routes-title">{content.coverage.heading}</h2><p>{content.coverage.body}</p><p className="technical-copy">{content.coverage.qualification}</p></div><div className="routes__diagram"><RouteDiagram regions={coverageRegions} note={content.coverage.mapNote} /></div></div></section>

    <section className="operations section section--white" id="operations" aria-labelledby="operations-title"><figure className="operations__media image-plate image-plate--yard" style={facilityMediaStyle} role="img" aria-label={content.facility.media.altText} data-media-id={content.facility.media.id}><div className="operations__overlay"><span>{content.facility.mediaCaption[0]}</span><span>{content.facility.mediaCaption[1]}</span></div><figcaption>{content.facility.figureCaption}<br />{siteSettings.address.city}, {siteSettings.address.state}</figcaption></figure><div className="operations__copy"><SectionLabel>{content.facility.label}</SectionLabel><h2 id="operations-title">{content.facility.heading}</h2><p>{content.facility.body}</p><div className="operations__note"><span>{content.facility.logisticsNoteLabel}</span><p>{content.facility.logisticsNote}</p></div></div></section>

    <section className="quality section section--stone" aria-labelledby="quality-title"><div className="shell-grid quality__grid"><div className="quality__intro"><SectionLabel>{content.quality.label}</SectionLabel><h2 id="quality-title">{content.quality.heading}</h2><p>{content.quality.body}</p></div><div className="quality__table" role="table" aria-label="Potential quality information parameters"><div className="quality__table-head" role="row"><span>{content.quality.tableHeadings[0]}</span><span>{content.quality.tableHeadings[1]}</span><span>{content.quality.tableHeadings[2]}</span></div>{qualityParameters.map((parameter) => <div className="quality-row" role="row" key={parameter.id}><strong>{parameter.shortLabel}</strong><span>{parameter.name}</span><em>{parameter.description}</em></div>)}</div></div><div className="quality__foot shell-grid"><span>{content.quality.footLabels[0]}</span><span>{content.quality.footLabels[1]}</span></div></section>

    <section className="experience section section--graphite" id="experience" aria-labelledby="experience-title"><div className="experience__measure" aria-hidden="true"><span>{content.experience.measure[0]}</span><i /><span>{content.experience.measure[1]}</span><i /><span>{content.experience.measure[2]}</span></div><div className="shell-grid experience__grid"><div><SectionLabel inverse>{content.experience.label}</SectionLabel></div><div className="experience__copy"><p className="experience__pretitle">{content.experience.pretitle}</p><h2 id="experience-title"><EditorialLines lines={content.experience.heading} /></h2><p>{content.experience.body}</p></div></div></section>

    <section className="enquire section" id="enquire" aria-labelledby="enquire-title"><div className="enquire__rule" /><div className="shell-grid enquire__grid"><div><SectionLabel>{content.finalCTA.label}</SectionLabel></div><div className="enquire__main"><h2 id="enquire-title"><EditorialLines lines={content.finalCTA.heading} /></h2><p>{content.finalCTA.body}</p><div className="enquire__actions"><a className="button button--dark" href={content.finalCTA.primaryCTA.href}>{content.finalCTA.primaryCTA.label} <Arrow diagonal /></a><a className="button button--line" href={content.finalCTA.secondaryCTA.href}>{content.finalCTA.secondaryCTA.label} <Arrow diagonal /></a></div></div><address className="enquire__contact"><a href={siteSettings.contact.phoneHref}><span>{content.finalCTA.contactLabels[0]}</span>{siteSettings.contact.phoneDisplay}</a><a href={siteSettings.contact.emailHref}><span>{content.finalCTA.contactLabels[1]}</span>{siteSettings.contact.email}</a><p>{siteSettings.address.display}</p></address></div></section>
  </main>;
}
