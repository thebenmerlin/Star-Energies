import { mediaById } from "./media";
import { commercialInformation } from "./commercial";
import { quoteRoute, routes } from "./routes";
import type { CoalPageContent } from "@/types/content";

export const coalPage = {
  seo: {
    title: "Coal & Products | Star Energies",
    description: "Requirement-based coal sourcing across WCL, auctions, e-auctions, steam coal and market suppliers.",
    canonicalPath: routes.coal,
  },
  intro: {
    label: "Coal & products / 01",
    note: "NO PUBLIC PRICE LIST.\nNO FIXED ONLINE INVENTORY.",
    heading: [{ text: "Coal sourcing,", breakAfter: true }, { text: "not catalogue shopping.", emphasis: true }],
    body: "Star Energies evaluates material options around your requirement, rather than asking you to select from a fixed online product list.",
    discussionLabel: "DISCUSSION INPUTS",
    discussionInputs: ["GRADE", "GCV", "SIZE", "APPLICATION", "DESTINATION"],
  },
  flow: {
    label: "How a requirement moves / 02",
    heading: [{ text: "A material discussion", breakAfter: true }, { text: "with a commercial route." }],
    steps: [
      { id: "customer-requirement", displayOrder: 1, label: [{ text: "Customer", breakAfter: true }, { text: "requirement" }] },
      { id: "source-matching", displayOrder: 2, label: [{ text: "Source", breakAfter: true }, { text: "matching" }] },
      { id: "commercial-discussion", displayOrder: 3, label: [{ text: "Commercial", breakAfter: true }, { text: "discussion" }] },
      { id: "supply-coordination", displayOrder: 4, label: [{ text: "Supply", breakAfter: true }, { text: "coordination" }] },
    ],
  },
  categories: {
    label: "Source categories / 03",
    body: "Material availability and suitability are considered at the time of your enquiry.",
    productIds: ["wcl-coal", "auction-e-auction-coal", "steam-coal", "requirement-based-sourcing"],
  },
  material: {
    label: "Material information / 04",
    heading: [{ text: "Specify what you know.", breakAfter: true }, { text: "We can start there.", emphasis: true }],
    body: "Different grades, GCV expectations and coal sizes may be relevant to an enquiry. The information available for a particular material can be discussed in context.",
    cta: { label: "Start a requirement discussion", href: quoteRoute, intent: "quote" },
    media: mediaById["coal-material-placeholder"],
    mediaCaption: "MATERIAL STUDY / COAL MATERIAL",
  },
  quality: {
    label: "Potential quality information / 05",
    heading: "Parameters, not promises.",
    body: "Quality or laboratory information can be shared where required and available for the material being considered.",
    parameterIds: ["gcv", "grade", "ash", "moisture", "sulphur"],
  },
  requirement: {
    promptLabel: "IF YOU KNOW IT, TELL US",
    heading: [{ text: "Tell us the brief.", breakAfter: true }, { text: "We’ll discuss the route.", emphasis: true }],
    body: `Quantity and destination complete the picture. ${commercialInformation.volumeQualification}`,
    cta: { label: "Request a Quote", href: quoteRoute, intent: "quote" },
  },
} satisfies CoalPageContent;
