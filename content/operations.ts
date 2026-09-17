import { mediaById } from "./media";
import { quoteRoute, routes } from "./routes";
import { commercialInformation } from "./commercial";
import type { OperationsPageContent } from "@/types/content";

export const operationsPage = {
  seo: {
    title: "Operations | Star Energies",
    description: "Wani stocking operations, regional industry experience and third-party transport coordination.",
    canonicalPath: routes.operations,
  },
  opening: {
    label: "Operations / 01",
    heading: [{ text: "A working base", breakAfter: true }, { text: "in Wani.", emphasis: true }],
    body: "Star Energies has a stocking facility in Wani, Yavatmal, Maharashtra: a practical point of presence close to the operating context.",
    locationLabel: "WANI / YAVATMAL / MH",
    media: mediaById["wani-yard-placeholder"],
    mediaCaption: "WANI STOCKING FACILITY",
  },
  sequence: {
    label: "Operating context / 02",
    heading: "From material route to customer destination.",
    items: [
      { id: "sourcing-coordination", displayOrder: 1, title: "Sourcing coordination", description: "Material options are considered against the customer requirement and current availability." },
      { id: "stocking-context", displayOrder: 2, title: "Stocking context", description: "Wani gives Star Energies a physical operating base for its stocking activity." },
      { id: "supply-coordination", displayOrder: 3, title: "Supply coordination", description: "Supply planning is discussed around the commercial and logistical context of the requirement." },
      { id: "destination", displayOrder: 4, title: "Destination", description: "Third-party transportation can be coordinated where required." },
    ],
  },
  coverage: {
    label: "Geographic experience / 03",
    heading: [{ text: "A regional foundation", breakAfter: true }, { text: "for an India-wide ambition.", emphasis: true }],
    body: "Current industry experience spans these markets. Pan-India supply remains subject to sourcing, availability, logistics and commercial feasibility.",
    regionIds: ["maharashtra", "telangana-hyderabad", "andhra-visakhapatnam", "karnataka", "gujarat"],
    mapNote: "INDUSTRY EXPERIENCE / NOT OFFICE LOCATIONS",
  },
  transport: {
    eyebrow: "TRANSPORT COORDINATION / 04",
    heading: [{ text: "Coordination,", breakAfter: true }, { text: "not fleet ownership.", emphasis: true }],
    lead: commercialInformation.transportOwnership,
    body: commercialInformation.transportCoordination,
    cta: { label: "Discuss a destination requirement", href: quoteRoute, intent: "quote" },
  },
  finalCTA: {
    eyebrow: "FROM WANI TO YOUR DESTINATION",
    heading: [{ text: "Start with", breakAfter: true }, { text: "the route.", emphasis: true }],
    cta: { label: "Request a Quote", href: quoteRoute, intent: "quote" },
  },
} satisfies OperationsPageContent;
