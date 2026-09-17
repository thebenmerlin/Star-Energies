import { Arrow } from "@/components/arrow";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import {
  industries,
  qualityParameters,
  requirementFields,
  siteConfig,
  sourcingOptions,
} from "@/lib/site";

function SectionLabel({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return <span className={`section-label ${inverse ? "section-label--inverse" : ""}`}><i />{children}</span>;
}

function ArrowLink({ href, children, inverse = false }: { href: string; children: React.ReactNode; inverse?: boolean }) {
  return <a className={`arrow-link ${inverse ? "arrow-link--inverse" : ""}`} href={href}><span>{children}</span><Arrow diagonal /></a>;
}

function CapabilityDiagram() {
  return (
    <div className="capability-diagram" aria-hidden="true">
      <div className="capability-diagram__orbit" />
      <div className="capability-diagram__ring capability-diagram__ring--one" />
      <div className="capability-diagram__ring capability-diagram__ring--two" />
      <span className="capability-diagram__label capability-diagram__label--one">INDUSTRIAL<br />REQUIREMENT</span>
      <span className="capability-diagram__label capability-diagram__label--two">SOURCE<br />TO FIT</span>
      <span className="capability-diagram__dot capability-diagram__dot--one" />
      <span className="capability-diagram__dot capability-diagram__dot--two" />
    </div>
  );
}

function RouteDiagram() {
  return (
    <svg className="route-diagram" viewBox="0 0 620 530" role="img" aria-label="Operating experience connecting Wani with industrial regions across India">
      <defs>
        <pattern id="route-grid" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="0.5" /></pattern>
      </defs>
      <path className="route-diagram__land" d="M310 43 355 64l8 46 43 31-9 43 33 37-17 45 22 51-26 55-7 60-34 21-35-43-23-49-35-25 3-49-38-51 6-62 31-35 19-50 36-17z" />
      <path className="route-diagram__grid" d="M310 43 355 64l8 46 43 31-9 43 33 37-17 45 22 51-26 55-7 60-34 21-35-43-23-49-35-25 3-49-38-51 6-62 31-35 19-50 36-17z" />
      <g className="route-diagram__line">
        <path d="M285 228 C225 218 155 224 75 183" />
        <path d="M285 228 C239 147 193 103 172 77" />
        <path d="M285 228 C348 182 440 161 532 150" />
        <path d="M285 228 C363 267 430 307 535 330" />
        <path d="M285 228 C278 302 235 373 167 415" />
      </g>
      <g className="route-diagram__node">
        <circle cx="285" cy="228" r="7" /><circle cx="75" cy="183" r="4" /><circle cx="172" cy="77" r="4" /><circle cx="532" cy="150" r="4" /><circle cx="535" cy="330" r="4" /><circle cx="167" cy="415" r="4" />
      </g>
      <g className="route-diagram__text">
        <text x="297" y="222">WANI</text><text x="20" y="172">GUJARAT</text><text x="116" y="62">MAHARASHTRA</text><text x="465" y="140">VISAKHAPATNAM</text><text x="478" y="352">HYDERABAD</text><text x="100" y="440">KARNATAKA</text>
      </g>
      <text className="route-diagram__key" x="23" y="496">REGIONAL INDUSTRY EXPERIENCE</text>
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__grid-lines" aria-hidden="true" />
          <div className="hero__inner">
            <div className="hero__meta fade-up"><span>WANI, MAHARASHTRA</span><span>INDUSTRIAL COAL SUPPLY</span></div>
            <div className="hero__content">
              <p className="hero__kicker fade-up fade-up--delay-1">Built around the brief, not a fixed catalogue.</p>
              <h1 id="hero-title" className="hero__title fade-up fade-up--delay-2">Industrial Coal.<br /><em>Sourced to Requirement.</em></h1>
              <div className="hero__actions fade-up fade-up--delay-3">
                <a className="button button--amber" href="#enquire">Request a Quote <Arrow diagonal /></a>
                <a className="hero__contact" href={siteConfig.contact.whatsappHref}><span>WhatsApp or call</span><Arrow diagonal /></a>
              </div>
            </div>
            <div className="hero__scene fade-up fade-up--delay-3" role="img" aria-label="Temporary industrial coal stock placeholder; photography to be replaced">
              <div className="hero__scene-grid" />
              <div className="hero__scene-mass hero__scene-mass--one" />
              <div className="hero__scene-mass hero__scene-mass--two" />
              <div className="hero__scene-mass hero__scene-mass--three" />
              <span className="scene-caption">DEVELOPMENT IMAGE PLATE<br />COAL / STOCKING YARD</span>
              <span className="scene-scale">01 — 04</span>
            </div>
            <div className="hero__brief fade-up fade-up--delay-4" aria-label="Key coal requirement parameters">
              <span>GRADE</span><span>SIZE</span><span>QUANTITY</span><span>DESTINATION</span>
            </div>
          </div>
          <div className="hero__bottom"><span>SCROLL TO EXPLORE</span><i /><span>STAR ENERGIES / 01</span></div>
        </section>

        <section className="capability section section--mineral" id="capabilities" aria-labelledby="capability-title">
          <div className="shell-grid capability__grid">
            <div className="capability__side">
              <SectionLabel>Capability / 01</SectionLabel>
              <p className="technical-copy">Sourcing is considered against material availability, the commercial picture and the route to your destination.</p>
            </div>
            <div className="capability__main">
              <p className="section-intro">For requirements from</p>
              <h2 id="capability-title"><span>≈100 tonnes</span><em>to several thousand.</em></h2>
              <p className="capability__body">Whether the requirement is an initial industrial lot or a larger volume, we begin with the operational details that matter.</p>
              <ArrowLink href="#requirement">How requirement-led sourcing works</ArrowLink>
            </div>
            <CapabilityDiagram />
          </div>
        </section>

        <section className="requirement section section--graphite" id="requirement" aria-labelledby="requirement-title">
          <div className="shell-grid">
            <div className="requirement__intro">
              <SectionLabel inverse>Requirement-led sourcing / 02</SectionLabel>
              <h2 id="requirement-title">A clear brief is where the work starts.</h2>
              <p>Tell us what your operation needs. Star Energies evaluates suitable sourcing routes around that requirement.</p>
            </div>
            <div className="requirement__sequence">
              {requirementFields.map((field) => (
                <article className="requirement-step" key={field.label}>
                  <span className="requirement-step__number">{field.index}</span>
                  <div><h3>{field.label}</h3><p>{field.detail}</p></div>
                  <span className="requirement-step__cross" aria-hidden="true">+</span>
                </article>
              ))}
              <div className="requirement__result"><span>YOUR REQUIREMENT</span><strong>Suitable sourcing<br />options evaluated</strong><Arrow diagonal /></div>
            </div>
          </div>
        </section>

        <section className="sourcing section section--white" id="coal" aria-labelledby="sourcing-title">
          <div className="shell-grid sourcing__grid">
            <div className="sourcing__intro">
              <SectionLabel>Coal & sourcing / 03</SectionLabel>
              <h2 id="sourcing-title">Material routes, considered with purpose.</h2>
              <p>We do not put coal into a public shopping basket. Each enquiry is considered against the material and commercial context at that time, including available auction, trader and supplier routes.</p>
            </div>
            <div className="sourcing__list">
              {sourcingOptions.map((option) => (
                <article className="source-row" key={option.title}>
                  <span>{option.number}</span><h3>{option.title}</h3><p>{option.text}</p><Arrow diagonal />
                </article>
              ))}
            </div>
            <figure className="sourcing__media image-plate image-plate--coal">
              <div className="image-plate__grain" />
              <figcaption><span>MAT. STUDY / 01</span><span>REPLACE WITH MATERIAL PHOTOGRAPHY</span></figcaption>
            </figure>
          </div>
        </section>

        <section className="industries section section--ink" id="industries" aria-labelledby="industries-title">
          <div className="shell-grid industries__top">
            <SectionLabel inverse>Industrial applications / 04</SectionLabel>
            <p>For businesses that depend on steady heat, process energy and material that fits the job.</p>
          </div>
          <div className="industries__list" id="industries-title">
            {industries.map((industry, index) => <div className="industry-line" key={industry}><span>{String(index + 1).padStart(2, "0")}</span><h2>{industry}</h2><i /></div>)}
          </div>
          <div className="shell-grid industries__foot"><span>INDUSTRIAL COAL USERS</span><span>APPLICATION-SPECIFIC DISCUSSION WELCOME</span></div>
        </section>

        <section className="routes section section--mineral" aria-labelledby="routes-title">
          <div className="shell-grid routes__grid">
            <div className="routes__copy">
              <SectionLabel>Operating ambition / 05</SectionLabel>
              <h2 id="routes-title">Connected to industrial demand beyond one region.</h2>
              <p>Current industry experience includes Maharashtra, Telangana / Hyderabad, Andhra Pradesh / Visakhapatnam, Karnataka and Gujarat.</p>
              <p className="technical-copy">Pan-India supply is considered subject to sourcing, availability and commercial feasibility. The diagram reflects experience and operating ambition—not office locations.</p>
            </div>
            <div className="routes__diagram"><RouteDiagram /></div>
          </div>
        </section>

        <section className="operations section section--white" id="operations" aria-labelledby="operations-title">
          <figure className="operations__media image-plate image-plate--yard">
            <div className="operations__overlay"><span>WANI / MH</span><span>PHOTO PLACEHOLDER</span></div>
            <figcaption>Stocking facility<br />Wani, Maharashtra</figcaption>
          </figure>
          <div className="operations__copy">
            <SectionLabel>Operations / 06</SectionLabel>
            <h2 id="operations-title">A physical base at the heart of the coal belt.</h2>
            <p>Star Energies has a stocking facility in Wani, Maharashtra—giving the operation a practical point of presence close to the work.</p>
            <div className="operations__note"><span>LOGISTICS NOTE</span><p>Transportation may be coordinated through third-party providers. Star Energies does not operate its own transport fleet.</p></div>
          </div>
        </section>

        <section className="quality section section--stone" aria-labelledby="quality-title">
          <div className="shell-grid quality__grid">
            <div className="quality__intro">
              <SectionLabel>Quality information / 07</SectionLabel>
              <h2 id="quality-title">Know the parameters that matter to your process.</h2>
              <p>Quality and testing information can be shared according to your requirement and what is available for the material under consideration.</p>
            </div>
            <div className="quality__table" role="table" aria-label="Potential quality information parameters">
              <div className="quality__table-head" role="row"><span>PARAMETER</span><span>DESCRIPTION</span><span>REPORTING CONTEXT</span></div>
              {qualityParameters.map((item) => <div className="quality-row" role="row" key={item.code}><strong>{item.code}</strong><span>{item.name}</span><em>{item.note}</em></div>)}
            </div>
          </div>
          <div className="quality__foot shell-grid"><span>QUALITY INFORMATION IS REQUIREMENT-LED</span><span>NO UNIVERSAL CERTIFICATION CLAIMED</span></div>
        </section>

        <section className="experience section section--graphite" id="experience" aria-labelledby="experience-title">
          <div className="experience__measure" aria-hidden="true"><span>00</span><i /><span>25</span><i /><span>NOW</span></div>
          <div className="shell-grid experience__grid">
            <div><SectionLabel inverse>Experience / 08</SectionLabel></div>
            <div className="experience__copy">
              <p className="experience__pretitle">Star Energies is a new business.</p>
              <h2 id="experience-title">Built with <em>approximately 25 years</em> of coal-industry experience behind it.</h2>
              <p>That experience brings market understanding, relationships and a grounded view of how industrial requirements are actually fulfilled. Star Energies is being built as the next chapter: focused, responsive and ready to grow responsibly.</p>
            </div>
          </div>
        </section>

        <section className="enquire section" id="enquire" aria-labelledby="enquire-title">
          <div className="enquire__rule" />
          <div className="shell-grid enquire__grid">
            <div><SectionLabel>Start a conversation / 09</SectionLabel></div>
            <div className="enquire__main">
              <h2 id="enquire-title">Have a coal requirement?<br /><em>Let’s make it specific.</em></h2>
              <p>Share grade, size, quantity and destination. We’ll start with the details that help determine a suitable route.</p>
              <div className="enquire__actions"><a className="button button--dark" href={siteConfig.contact.emailHref}>Request a Quote <Arrow diagonal /></a><a className="button button--line" href={siteConfig.contact.whatsappHref}>WhatsApp <Arrow diagonal /></a></div>
            </div>
            <address className="enquire__contact">
              <a href={siteConfig.contact.phoneHref}><span>CALL</span>{siteConfig.contact.phoneDisplay}</a>
              <a href={siteConfig.contact.emailHref}><span>EMAIL</span>{siteConfig.contact.email}</a>
              <p>{siteConfig.location}</p>
            </address>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
