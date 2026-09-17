import { routes, quoteRoute } from "./routes";
import { siteSettings } from "./site";
import type { AboutPageContent } from "@/types/content";

export const aboutPage = {
  seo: {
    title: "About | Star Energies",
    description: "A new-generation industrial coal trading business built on deep coal-industry experience.",
    canonicalPath: routes.about,
  },
  opening: {
    label: "About Star Energies / 01",
    statement: "NEW BUSINESS. CLEAR INTENT.",
    heading: [
      { text: "A new-generation", breakAfter: true },
      { text: "coal trading business", emphasis: true, breakAfter: true },
      { text: "from Wani." },
    ],
    experiencePrefix: "APPROX.",
    experienceValue: "25",
    experienceLabel: "YEARS OF COAL-INDUSTRY EXPERIENCE BEHIND THE VENTURE",
    footLabels: ["INDEPENDENT STAR ENERGIES BRAND", "WANI, YAVATMAL / MAHARASHTRA"],
  },
  distinction: {
    label: "Perspective / 02",
    lead: "Star Energies is newly established. The experience behind the people building it is not.",
    body: "It is being developed as an independent business with a practical view of industrial coal: understand the requirement properly, communicate directly, and build customer relationships that have a reason to last.",
    markers: ["NEW", "DEPTH"],
  },
  approach: {
    label: "How we intend to work / 03",
    heading: "A straightforward approach to a commercial requirement.",
    items: [
      { id: "direct-communication", displayOrder: 1, title: "Direct communication", description: "Start with the actual requirement and a clear conversation about the available routes." },
      { id: "requirement-understanding", displayOrder: 2, title: "Requirement understanding", description: "Grade, size, quantity, destination and application help establish what needs to be evaluated." },
      { id: "long-term-orientation", displayOrder: 3, title: "Long-term orientation", description: "Star Energies is being built around repeat industrial relationships rather than one-size-fits-all selling." },
    ],
  },
  people: {
    label: "People behind the work / 04",
    intro: "The leadership picture is intentionally simple: a next-generation business direction supported by established industry knowledge.",
    entries: [
      { id: "aafaq", label: "CURRENT / NEXT-GENERATION BUSINESS LEADERSHIP", name: "Aafaq", description: "Focused on building Star Energies as a responsive, independent industrial trading business." },
      { id: "nahid", label: "UNDERLYING COAL-INDUSTRY EXPERIENCE", name: "Nahid", description: "Bringing approximately 25 years of industry understanding and relationships behind the venture." },
    ],
  },
  ambition: {
    label: "Where we are going / 05",
    heading: [
      { text: "A Wani base.", breakAfter: true },
      { text: "An India-wide customer ambition.", emphasis: true },
    ],
    body: "Star Energies aims to serve industrial coal users across India where sourcing, availability, logistics and commercial feasibility allow.",
    cta: { label: "See the operating context", href: routes.operations, intent: "learn-more" },
    coordinates: ["20.057° N", "78.953° E", "WANI / MAHARASHTRA"],
  },
  finalCTA: {
    eyebrow: "START A REQUIREMENT",
    heading: [{ text: "Talk through", breakAfter: true }, { text: "what you need.", emphasis: true }],
    primaryCTA: { label: "Request a Quote", href: quoteRoute, intent: "quote" },
    secondaryCTA: { label: siteSettings.contact.phoneDisplay, href: siteSettings.contact.phoneHref, intent: "phone", external: true },
  },
} satisfies AboutPageContent;
