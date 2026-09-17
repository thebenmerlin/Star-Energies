import type { Metadata } from "next";
import { Arrow } from "@/components/arrow";
import { MediaPlate } from "@/components/media-plate";
import { ArrowLink, SectionLabel } from "@/components/page-primitives";
import { coverageRegions, placeholderImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Operations | Star Energies",
  description: "Wani stocking operations, regional industry experience and third-party transport coordination.",
};

function OperationsMap() {
  return <svg className="operations-map" viewBox="0 0 650 500" role="img" aria-label="Diagram showing Wani connected to regions where the business has industry experience">
    <path className="operations-map__land" d="M310 28 351 50l7 45 42 31-8 42 31 39-17 43 24 48-25 55-6 59-33 20-35-41-21-47-35-26 3-47-37-49 7-61 30-34 18-47 37-18z" />
    <g className="operations-map__routes"><path d="M284 213C211 209 155 200 55 161" /><path d="M284 213C239 134 191 91 152 51" /><path d="M284 213C348 176 440 147 558 140" /><path d="M284 213C369 259 444 293 569 325" /><path d="M284 213C267 296 220 366 125 416" /></g>
    <g className="operations-map__nodes"><circle cx="284" cy="213" r="8" /><circle cx="55" cy="161" r="4" /><circle cx="152" cy="51" r="4" /><circle cx="558" cy="140" r="4" /><circle cx="569" cy="325" r="4" /><circle cx="125" cy="416" r="4" /></g>
    <g className="operations-map__labels"><text x="298" y="207">WANI</text><text x="5" y="148">GUJARAT</text><text x="93" y="35">MAHARASHTRA</text><text x="480" y="128">VISAKHAPATNAM</text><text x="505" y="347">HYDERABAD</text><text x="61" y="441">KARNATAKA</text></g>
    <text className="operations-map__note" x="6" y="480">INDUSTRY EXPERIENCE / NOT OFFICE LOCATIONS</text>
  </svg>;
}

export default function OperationsPage() {
  return (
    <main>
      <section className="operations-opening" aria-labelledby="operations-title">
        <MediaPlate asset={placeholderImages.yard} className="operations-opening__media" caption="WANI STOCKING FACILITY / DEVELOPMENT PLACEHOLDER" />
        <div className="operations-opening__copy"><SectionLabel inverse>Operations / 01</SectionLabel><h1 id="operations-title">A working base<br /><em>in Wani.</em></h1><p>Star Energies has a stocking facility in Wani, Yavatmal, Maharashtra: a practical point of presence close to the operating context.</p><span>WANI / YAVATMAL / MH</span></div>
      </section>

      <section className="operations-sequence section section--white" aria-labelledby="operations-sequence-title">
        <div className="shell-grid operations-sequence__head"><SectionLabel>Operating context / 02</SectionLabel><h2 id="operations-sequence-title">From material route to customer destination.</h2></div>
        <div className="operations-sequence__line"><article><span>01</span><h3>Sourcing coordination</h3><p>Material options are considered against the customer requirement and current availability.</p></article><i /><article><span>02</span><h3>Stocking context</h3><p>Wani gives Star Energies a physical operating base for its stocking activity.</p></article><i /><article><span>03</span><h3>Supply coordination</h3><p>Supply planning is discussed around the commercial and logistical context of the requirement.</p></article><i /><article><span>04</span><h3>Destination</h3><p>Third-party transportation can be coordinated where required.</p></article></div>
      </section>

      <section className="operations-coverage section section--mineral" aria-labelledby="coverage-title">
        <div className="shell-grid operations-coverage__grid"><div><SectionLabel>Geographic experience / 03</SectionLabel><h2 id="coverage-title">A regional foundation<br /><em>for an India-wide ambition.</em></h2><p>Current industry experience spans these markets. Pan-India supply remains subject to sourcing, availability, logistics and commercial feasibility.</p><ul>{coverageRegions.map((region, index) => <li key={region}><span>{String(index + 1).padStart(2, "0")}</span>{region}</li>)}</ul></div><OperationsMap /></div>
      </section>

      <section className="operations-transport section section--graphite"><div className="shell-grid operations-transport__grid"><div><span>TRANSPORT COORDINATION / 04</span><h2>Coordination,<br /><em>not fleet ownership.</em></h2></div><div><p>Star Energies does not operate its own transportation fleet.</p><p>Transportation can be coordinated through third-party providers where required, based on the needs of the transaction and route.</p><ArrowLink inverse href="/contact#quote">Discuss a destination requirement</ArrowLink></div></div></section>

      <section className="page-cta page-cta--light"><div className="shell-grid"><div><span>FROM WANI TO YOUR DESTINATION</span><h2>Start with<br /><em>the route.</em></h2></div><a className="button button--dark" href="/contact#quote">Request a Quote <Arrow diagonal /></a></div></section>
    </main>
  );
}
