import { quoteRoute, routes } from "./routes";
import { siteSettings } from "./site";
import { commercialInformation } from "./commercial";
import type { CapabilitiesPageContent } from "@/types/content";

export const capabilitiesPage = {
  seo: {
    title: "Capabilities | Star Energies",
    description: "Requirement-led coal sourcing, specification discussion, quality information and transport coordination for industrial buyers.",
    canonicalPath: routes.capabilities,
  },
  opening: {
    label: "Capabilities / 01",
    heading: [
      { text: "Capability is", breakAfter: true },
      { text: "how the requirement", emphasis: true, breakAfter: true },
      { text: "is handled." },
    ],
    body: "For an industrial buyer, the useful question is practical: can the requirement be understood, evaluated and coordinated with care?",
    key: ["01—06", "REQUIREMENT\nTO ROUTE"],
  },
  index: {
    label: "Operating capabilities / 02",
    heading: "The commercial work behind a serious enquiry.",
    capabilityIds: [
      "requirement-led-sourcing",
      "specification-discussion",
      "volume-flexibility",
      "quality-information",
      "commercial-flexibility",
      "third-party-transport-coordination",
    ],
  },
  volume: {
    label: "Scale and context / 03",
    heading: [{ text: "From an initial lot", breakAfter: true }, { text: "to several thousand tonnes.", emphasis: true }],
    body: "Typical requirements may range from approximately 100 tonnes to several thousand tonnes. What can be supplied depends on sourcing, availability, destination and commercial feasibility at the time.",
    axis: ["≈100 T", "SEVERAL THOUSAND T"],
  },
  commercial: {
    label: "Commercial discussion / 04",
    heading: [{ text: "Terms considered", breakAfter: true }, { text: "in the transaction.", emphasis: true }],
    tableHeadings: ["COMMERCIAL AREA", "HOW IT IS APPROACHED"],
    rows: [
      { id: "material-route", title: "Material route", description: commercialInformation.materialRoute },
      { id: "quality-information", title: "Quality information", description: commercialInformation.qualityInformation },
      { id: "payment-arrangement", title: "Payment arrangement", description: commercialInformation.paymentArrangement },
      { id: "transportation", title: "Transportation", description: "Third-party coordination can be considered where required." },
    ],
  },
  direct: {
    eyebrow: "DIRECT CUSTOMER COMMUNICATION\nIS PART OF THE CAPABILITY.",
    heading: [{ text: "Bring the requirement.", breakAfter: true }, { text: "We’ll start with the details.", emphasis: true }],
    primaryCTA: { label: "Request a Quote", href: quoteRoute, intent: "quote" },
    secondaryCTA: { label: siteSettings.contact.phoneDisplay, href: siteSettings.contact.phoneHref, intent: "phone", external: true },
  },
} satisfies CapabilitiesPageContent;
