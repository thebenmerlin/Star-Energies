import type { Metadata } from "next";
import { Arrow } from "@/components/arrow";
import { ArrowLink, SectionLabel } from "@/components/page-primitives";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | Star Energies",
  description: "A new-generation industrial coal trading business built on deep coal-industry experience.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="about-opening" aria-labelledby="about-title">
        <div className="shell-grid about-opening__grid">
          <SectionLabel inverse>About Star Energies / 01</SectionLabel>
          <div className="about-opening__statement">
            <p>NEW BUSINESS. CLEAR INTENT.</p>
            <h1 id="about-title">A new-generation<br /><em>coal trading business</em><br />from Wani.</h1>
          </div>
          <div className="about-opening__measure"><span>APPROX.</span><strong>25</strong><span>YEARS OF COAL-INDUSTRY EXPERIENCE BEHIND THE VENTURE</span></div>
        </div>
        <div className="about-opening__foot"><span>INDEPENDENT STAR ENERGIES BRAND</span><span>WANI, YAVATMAL / MAHARASHTRA</span></div>
      </section>

      <section className="about-distinction section section--mineral">
        <div className="shell-grid about-distinction__grid">
          <div><SectionLabel>Perspective / 02</SectionLabel></div>
          <div className="about-distinction__copy">
            <p className="about-distinction__lead">Star Energies is newly established. The experience behind the people building it is not.</p>
            <p>It is being developed as an independent business with a practical view of industrial coal: understand the requirement properly, communicate directly, and build customer relationships that have a reason to last.</p>
          </div>
          <div className="about-distinction__marker"><span>NEW</span><i /><span>DEPTH</span></div>
        </div>
      </section>

      <section className="about-approach section section--white" aria-labelledby="approach-title">
        <div className="shell-grid about-approach__top"><SectionLabel>How we intend to work / 03</SectionLabel><h2 id="approach-title">A straightforward approach to a commercial requirement.</h2></div>
        <div className="about-approach__rows">
          <article><span>01</span><h3>Direct communication</h3><p>Start with the actual requirement and a clear conversation about the available routes.</p></article>
          <article><span>02</span><h3>Requirement understanding</h3><p>Grade, size, quantity, destination and application help establish what needs to be evaluated.</p></article>
          <article><span>03</span><h3>Long-term orientation</h3><p>Star Energies is being built around repeat industrial relationships rather than one-size-fits-all selling.</p></article>
        </div>
      </section>

      <section className="about-people section section--ink" aria-labelledby="people-title">
        <div className="shell-grid about-people__grid">
          <div><SectionLabel inverse>People behind the work / 04</SectionLabel><p className="about-people__intro">The leadership picture is intentionally simple: a next-generation business direction supported by established industry knowledge.</p></div>
          <div className="about-people__names" id="people-title">
            <article><span>CURRENT / NEXT-GENERATION BUSINESS LEADERSHIP</span><h2>Aafaq</h2><p>Focused on building Star Energies as a responsive, independent industrial trading business.</p></article>
            <article><span>UNDERLYING COAL-INDUSTRY EXPERIENCE</span><h2>Nahid</h2><p>Bringing approximately 25 years of industry understanding and relationships behind the venture.</p></article>
          </div>
        </div>
      </section>

      <section className="about-ambition section section--stone" aria-labelledby="ambition-title">
        <div className="shell-grid about-ambition__grid">
          <SectionLabel>Where we are going / 05</SectionLabel>
          <div><h2 id="ambition-title">A Wani base.<br /><em>An India-wide customer ambition.</em></h2><p>Star Energies aims to serve industrial coal users across India where sourcing, availability, logistics and commercial feasibility allow.</p><ArrowLink href="/operations">See the operating context</ArrowLink></div>
          <div className="about-ambition__coordinates"><span>20.057° N</span><i /><span>78.953° E</span><small>WANI / MAHARASHTRA</small></div>
        </div>
      </section>

      <section className="page-cta page-cta--dark">
        <div className="shell-grid"><div><span>START A REQUIREMENT</span><h2>Talk through<br /><em>what you need.</em></h2></div><a className="button button--amber" href="/contact#quote">Request a Quote <Arrow diagonal /></a><a className="page-cta__text" href={siteConfig.contact.phoneHref}>{siteConfig.contact.phoneDisplay} <Arrow diagonal /></a></div>
      </section>
    </main>
  );
}
