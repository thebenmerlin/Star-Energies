import { Arrow } from "@/components/arrow";
import { EditorialLines, LineBreaks } from "@/components/content-text";
import { MediaPlate } from "@/components/media-plate";
import { ArrowLink, RequirementPrompt, SectionLabel } from "@/components/page-primitives";
import { getCoalPage } from "@/lib/content";
import { createMetadata } from "@/lib/seo";

const coalData = getCoalPage();
export const metadata = createMetadata(coalData.content.seo);

export default function CoalPage() {
  const { content, products, qualityParameters, requirementDimensions } = coalData;

  return <main>
    <section className="coal-intro" aria-labelledby="coal-title"><div className="shell-grid coal-intro__grid"><div className="coal-intro__label"><SectionLabel>{content.intro.label}</SectionLabel><p><LineBreaks text={content.intro.note} /></p></div><div className="coal-intro__title"><h1 id="coal-title"><EditorialLines lines={content.intro.heading} /></h1><p>{content.intro.body}</p></div><div className="coal-intro__spec"><span>{content.intro.discussionLabel}</span>{content.intro.discussionInputs.map((input) => <b key={input}>{input}</b>)}</div></div></section>

    <section className="coal-flow section section--graphite" aria-labelledby="coal-flow-title"><div className="shell-grid coal-flow__grid"><SectionLabel inverse>{content.flow.label}</SectionLabel><h2 id="coal-flow-title"><EditorialLines lines={content.flow.heading} /></h2></div><div className="coal-flow__steps" aria-label="Customer requirement sourcing process">{content.flow.steps.map((step, index) => <div key={step.id}><span>{String(step.displayOrder).padStart(2, "0")}</span><strong><EditorialLines lines={step.label} /></strong></div>).flatMap((step, index, steps) => index < steps.length - 1 ? [step, <i key={`arrow-${index}`}>→</i>] : [step])}</div></section>

    <section className="coal-categories section section--white" aria-labelledby="categories-title"><div className="shell-grid coal-categories__head"><SectionLabel>{content.categories.label}</SectionLabel><p>{content.categories.body}</p></div><div className="coal-categories__rows" id="categories-title">{products.map((product) => <article className="coal-category" key={product.id}><span>{String(product.displayOrder).padStart(2, "0")}</span><h2>{product.name}</h2><p>{product.shortDescription}</p><div className="coal-category__meta"><small>CONSIDERED AGAINST</small><b>{product.consideredAgainst}</b></div><Arrow diagonal /></article>)}</div></section>

    <section className="coal-material section section--stone"><div className="shell-grid coal-material__grid"><MediaPlate asset={content.material.media} className="coal-material__media" caption={content.material.mediaCaption} /><div className="coal-material__copy"><SectionLabel>{content.material.label}</SectionLabel><h2><EditorialLines lines={content.material.heading} /></h2><p>{content.material.body}</p><ArrowLink href={content.material.cta.href}>{content.material.cta.label}</ArrowLink></div></div></section>

    <section className="coal-quality section section--mineral" aria-labelledby="coal-quality-title"><div className="shell-grid coal-quality__grid"><div><SectionLabel>{content.quality.label}</SectionLabel><h2 id="coal-quality-title">{content.quality.heading}</h2><p>{content.quality.body}</p></div><div className="coal-quality__list">{qualityParameters.map((parameter) => <div key={parameter.id}><strong>{parameter.shortLabel}</strong><span>{parameter.name}</span><em>{parameter.description}</em></div>)}</div></div></section>

    <section className="coal-requirement section section--ink"><div className="shell-grid coal-requirement__grid"><RequirementPrompt inverse label={content.requirement.promptLabel} dimensions={requirementDimensions} /><div><h2><EditorialLines lines={content.requirement.heading} /></h2><p>{content.requirement.body}</p><a className="button button--amber" href={content.requirement.cta.href}>{content.requirement.cta.label} <Arrow diagonal /></a></div></div></section>
  </main>;
}
