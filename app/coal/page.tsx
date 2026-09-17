import type { Metadata } from "next";
import { Arrow } from "@/components/arrow";
import { MediaPlate } from "@/components/media-plate";
import { ArrowLink, RequirementPrompt, SectionLabel } from "@/components/page-primitives";
import { placeholderImages, qualityParameters, sourcingOptions } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coal & Products | Star Energies",
  description: "Requirement-based coal sourcing across WCL, auctions, e-auctions, steam coal and market suppliers.",
};

export default function CoalPage() {
  return (
    <main>
      <section className="coal-intro" aria-labelledby="coal-title">
        <div className="shell-grid coal-intro__grid">
          <div className="coal-intro__label"><SectionLabel>Coal & products / 01</SectionLabel><p>NO PUBLIC PRICE LIST.<br />NO FIXED ONLINE INVENTORY.</p></div>
          <div className="coal-intro__title"><h1 id="coal-title">Coal sourcing,<br /><em>not catalogue shopping.</em></h1><p>Star Energies evaluates material options around your requirement, rather than asking you to select from a fixed online product list.</p></div>
          <div className="coal-intro__spec"><span>DISCUSSION INPUTS</span><b>GRADE</b><b>GCV</b><b>SIZE</b><b>APPLICATION</b><b>DESTINATION</b></div>
        </div>
      </section>

      <section className="coal-flow section section--graphite" aria-labelledby="coal-flow-title">
        <div className="shell-grid coal-flow__grid"><SectionLabel inverse>How a requirement moves / 02</SectionLabel><h2 id="coal-flow-title">A material discussion<br />with a commercial route.</h2></div>
        <div className="coal-flow__steps" aria-label="Customer requirement sourcing process">
          <div><span>01</span><strong>Customer<br />requirement</strong></div><i>→</i><div><span>02</span><strong>Source<br />matching</strong></div><i>→</i><div><span>03</span><strong>Commercial<br />discussion</strong></div><i>→</i><div><span>04</span><strong>Supply<br />coordination</strong></div>
        </div>
      </section>

      <section className="coal-categories section section--white" aria-labelledby="categories-title">
        <div className="shell-grid coal-categories__head"><SectionLabel>Source categories / 03</SectionLabel><p>Material availability and suitability are considered at the time of your enquiry.</p></div>
        <div className="coal-categories__rows" id="categories-title">
          {sourcingOptions.map((option, index) => (
            <article className="coal-category" key={option.title}>
              <span>{option.number}</span><h2>{option.title}</h2><p>{option.text}</p><div className="coal-category__meta"><small>CONSIDERED AGAINST</small><b>{index === 0 ? "GRADE / DESTINATION" : index === 1 ? "AVAILABILITY / COMMERCIALS" : index === 2 ? "APPLICATION / SIZE" : "YOUR FULL BRIEF"}</b></div><Arrow diagonal />
            </article>
          ))}
        </div>
      </section>

      <section className="coal-material section section--stone">
        <div className="shell-grid coal-material__grid">
          <MediaPlate asset={placeholderImages.coalStudy} className="coal-material__media" caption="MATERIAL STUDY / REPLACE WITH CLIENT PHOTOGRAPHY" />
          <div className="coal-material__copy"><SectionLabel>Material information / 04</SectionLabel><h2>Specify what you know.<br /><em>We can start there.</em></h2><p>Different grades, GCV expectations and coal sizes may be relevant to an enquiry. The information available for a particular material can be discussed in context.</p><ArrowLink href="/contact#quote">Start a requirement discussion</ArrowLink></div>
        </div>
      </section>

      <section className="coal-quality section section--mineral" aria-labelledby="coal-quality-title">
        <div className="shell-grid coal-quality__grid"><div><SectionLabel>Potential quality information / 05</SectionLabel><h2 id="coal-quality-title">Parameters, not promises.</h2><p>Quality or laboratory information can be shared where required and available for the material being considered.</p></div><div className="coal-quality__list">{qualityParameters.map((item) => <div key={item.code}><strong>{item.code}</strong><span>{item.name}</span><em>{item.note}</em></div>)}</div></div>
      </section>

      <section className="coal-requirement section section--ink">
        <div className="shell-grid coal-requirement__grid"><RequirementPrompt inverse /><div><h2>Tell us the brief.<br /><em>We’ll discuss the route.</em></h2><p>Quantity and destination complete the picture. Typical requirements may range from approximately 100 tonnes to several thousand tonnes, subject to sourcing, availability and commercial feasibility.</p><a className="button button--amber" href="/contact#quote">Request a Quote <Arrow diagonal /></a></div></div>
      </section>
    </main>
  );
}
