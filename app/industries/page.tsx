import type { Metadata } from "next";
import { Arrow } from "@/components/arrow";
import { MediaPlate } from "@/components/media-plate";
import { ArrowLink, SectionLabel } from "@/components/page-primitives";
import { industryDetails, placeholderImages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries | Star Energies",
  description: "Industrial coal supply discussions for manufacturing, chemicals, power, boilers, brick kilns and other users.",
};

export default function IndustriesPage() {
  return (
    <main>
      <section className="industries-opening" aria-labelledby="industries-page-title">
        <div className="shell-grid industries-opening__grid"><SectionLabel inverse>Industrial applications / 01</SectionLabel><div><p>COAL REQUIREMENTS ARE APPLICATION-SPECIFIC.</p><h1 id="industries-page-title">For operations<br />where <em>the material<br />has a job to do.</em></h1></div><span className="industries-opening__index">APPLICATION INDEX / 06</span></div>
      </section>

      <section className="industry-directory section section--mineral" aria-labelledby="directory-title">
        <div className="shell-grid industry-directory__intro"><SectionLabel>Where we start / 02</SectionLabel><div><h2 id="directory-title">An industry name is only the beginning.</h2><p>Requirements can differ by process, handling setup, material preference and destination. Star Energies works from the actual need rather than a generic category label.</p></div></div>
        <div className="industry-directory__layout">
          <div className="industry-directory__rows">
            {industryDetails.map((industry, index) => <article className="industry-entry" key={industry.title}><span>{industry.number}</span><h3>{industry.title}</h3><p>{industry.description}</p><i>{index % 2 === 0 ? "↗" : "↓"}</i></article>)}
          </div>
          <MediaPlate asset={placeholderImages.industrial} className="industry-directory__media" caption="APPLICATION ENVIRONMENT / DEVELOPMENT PLACEHOLDER" />
        </div>
      </section>

      <section className="industries-logic section section--white" aria-labelledby="industries-logic-title">
        <div className="shell-grid industries-logic__grid"><div><SectionLabel>Requirement logic / 03</SectionLabel><h2 id="industries-logic-title">The question is not simply “what industry?”</h2></div><div className="industries-logic__questions"><p><span>01</span>What does the application require?</p><p><span>02</span>What material information is available?</p><p><span>03</span>Where does the material need to go?</p><p><span>04</span>What sourcing route is commercially feasible?</p></div></div>
      </section>

      <section className="industries-other section section--graphite">
        <div className="shell-grid industries-other__grid"><div><span>NOT LISTED?</span><h2>Your operation<br />doesn’t need to fit<br /><em>our directory.</em></h2></div><div><p>These are customer categories, not limits. If you are an industrial coal user with a clear requirement, a direct discussion is the right place to begin.</p><ArrowLink inverse href="/contact#quote">Discuss your requirement</ArrowLink></div></div>
      </section>

      <section className="page-cta page-cta--light"><div className="shell-grid"><div><span>INDUSTRIAL COAL REQUIREMENT</span><h2>Let’s start<br /><em>with the application.</em></h2></div><a className="button button--dark" href="/contact#quote">Discuss Your Requirement <Arrow diagonal /></a></div></section>
    </main>
  );
}
