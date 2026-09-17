import type { Metadata } from "next";
import { Arrow } from "@/components/arrow";
import { ArrowLink, SectionLabel } from "@/components/page-primitives";
import { capabilityDetails, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Capabilities | Star Energies",
  description: "Requirement-led coal sourcing, specification discussion, quality information and transport coordination for industrial buyers.",
};

export default function CapabilitiesPage() {
  return (
    <main>
      <section className="capabilities-opening" aria-labelledby="capabilities-title">
        <div className="capabilities-opening__rings" aria-hidden="true"><i /><i /><i /></div>
        <div className="shell-grid capabilities-opening__grid"><SectionLabel inverse>Capabilities / 01</SectionLabel><div><h1 id="capabilities-title">Capability is<br /><em>how the requirement</em><br />is handled.</h1><p>For an industrial buyer, the useful question is practical: can the requirement be understood, evaluated and coordinated with care?</p></div><div className="capabilities-opening__key"><span>01—06</span><b>REQUIREMENT<br />TO ROUTE</b></div></div>
      </section>

      <section className="capability-index section section--white" aria-labelledby="capability-index-title">
        <div className="shell-grid capability-index__head"><SectionLabel>Operating capabilities / 02</SectionLabel><h2 id="capability-index-title">The commercial work behind a serious enquiry.</h2></div>
        <div className="capability-index__list">
          {capabilityDetails.map((capability, index) => <article key={capability.title}><span>{capability.number}</span><h3>{capability.title}</h3><p>{capability.description}</p><b>{index % 2 === 0 ? "↗" : "→"}</b></article>)}
        </div>
      </section>

      <section className="capabilities-volume section section--stone" aria-labelledby="volume-title">
        <div className="shell-grid capabilities-volume__grid"><div><SectionLabel>Scale and context / 03</SectionLabel><h2 id="volume-title">From an initial lot<br />to <em>several thousand tonnes.</em></h2></div><div><p>Typical requirements may range from approximately 100 tonnes to several thousand tonnes. What can be supplied depends on sourcing, availability, destination and commercial feasibility at the time.</p><div className="capabilities-volume__axis"><span>≈100 T</span><i /><span>SEVERAL THOUSAND T</span></div></div></div>
      </section>

      <section className="capabilities-commercial section section--ink" aria-labelledby="commercial-title">
        <div className="shell-grid capabilities-commercial__grid"><div><SectionLabel inverse>Commercial discussion / 04</SectionLabel><h2 id="commercial-title">Terms considered<br /><em>in the transaction.</em></h2></div><div className="capabilities-commercial__table"><div><span>COMMERCIAL AREA</span><span>HOW IT IS APPROACHED</span></div><div><b>Material route</b><p>Considered against the brief and current availability.</p></div><div><b>Quality information</b><p>Discussed where information is required and available.</p></div><div><b>Payment arrangement</b><p>Advance or credit arrangements may be discussed depending on the transaction.</p></div><div><b>Transportation</b><p>Third-party coordination can be considered where required.</p></div></div></div>
      </section>

      <section className="capabilities-direct section section--mineral"><div className="shell-grid capabilities-direct__grid"><p>DIRECT CUSTOMER COMMUNICATION<br />IS PART OF THE CAPABILITY.</p><h2>Bring the requirement.<br /><em>We’ll start with the details.</em></h2><div><a className="button button--dark" href="/contact#quote">Request a Quote <Arrow diagonal /></a><a className="capabilities-direct__phone" href={siteConfig.contact.phoneHref}>{siteConfig.contact.phoneDisplay} <Arrow diagonal /></a></div></div></section>
    </main>
  );
}
