import { mediaById } from "./media";
import { commercialInformation } from "./commercial";
import { siteSettings } from "./site";
import { routes } from "./routes";
import type { HomePageContent } from "@/types/content";

export const homePage = {
  seo: {
    title: "Star Energies | Industrial Coal, Sourced to Requirement",
    description: "Requirement-led industrial coal sourcing and supply from Wani, Maharashtra.",
    canonicalPath: routes.home,
  },
  hero: {
    meta: ["WANI, MAHARASHTRA", "INDUSTRIAL COAL SUPPLY"],
    kicker: "Built around the brief, not a fixed catalogue.",
    heading: [
      { text: "Industrial Coal.", breakAfter: true },
      { text: "Sourced to Requirement.", emphasis: true },
    ],
    primaryCTA: { label: "Request a Quote", href: "#enquire", intent: "quote" },
    secondaryCTA: { label: "WhatsApp or call", href: siteSettings.contact.whatsappHref, intent: "whatsapp", external: true },
    media: mediaById["hero-development-plate"],
    sceneCaption: "DEVELOPMENT IMAGE PLATE\nCOAL / STOCKING YARD",
    sceneScale: "01 — 04",
    requirementDimensionIds: ["grade", "size", "quantity", "destination"],
    scrollLabel: "SCROLL TO EXPLORE",
    progressLabel: "STAR ENERGIES / 01",
  },
  capabilityIntro: {
    label: "Capability / 01",
    technicalCopy: "Sourcing is considered against material availability, the commercial picture and the route to your destination.",
    intro: "For requirements from",
    heading: [
      { text: "≈100 tonnes", breakAfter: true },
      { text: "to several thousand.", emphasis: true },
    ],
    body: "Whether the requirement is an initial industrial lot or a larger volume, we begin with the operational details that matter.",
    cta: { label: "How requirement-led sourcing works", href: "#requirement", intent: "learn-more" },
    diagramLabels: ["INDUSTRIAL\nREQUIREMENT", "SOURCE\nTO FIT"],
  },
  requirementSourcing: {
    label: "Requirement-led sourcing / 02",
    heading: "A clear brief is where the work starts.",
    body: "Tell us what your operation needs. Star Energies evaluates suitable sourcing routes around that requirement.",
    resultLabel: "YOUR REQUIREMENT",
    result: [{ text: "Suitable sourcing", breakAfter: true }, { text: "options evaluated" }],
  },
  sourcing: {
    label: "Coal & sourcing / 03",
    heading: "Material routes, considered with purpose.",
    body: "We do not put coal into a public shopping basket. Each enquiry is considered against the material and commercial context at that time, including available auction, trader and supplier routes.",
    productIds: ["wcl-coal", "auction-e-auction-coal", "steam-coal", "requirement-based-sourcing"],
    media: mediaById["coal-material-placeholder"],
    mediaCaption: ["MAT. STUDY / 01", "REPLACE WITH MATERIAL PHOTOGRAPHY"],
  },
  industries: {
    label: "Industrial applications / 04",
    body: "For businesses that depend on steady heat, process energy and material that fits the job.",
    industryIds: ["manufacturing", "chemical-industries", "power", "industrial-boilers", "brick-kilns", "other-industrial-users"],
    footLabels: ["INDUSTRIAL COAL USERS", "APPLICATION-SPECIFIC DISCUSSION WELCOME"],
  },
  coverage: {
    label: "Operating ambition / 05",
    heading: "Connected to industrial demand beyond one region.",
    body: "Current industry experience includes Maharashtra, Telangana / Hyderabad, Andhra Pradesh / Visakhapatnam, Karnataka and Gujarat.",
    qualification: `${commercialInformation.panIndiaQualification} The diagram reflects experience and operating ambition—not office locations.`,
    mapNote: "REGIONAL INDUSTRY EXPERIENCE",
    regionIds: ["maharashtra", "telangana-hyderabad", "andhra-visakhapatnam", "karnataka", "gujarat"],
  },
  facility: {
    label: "Operations / 06",
    heading: "A physical base at the heart of the coal belt.",
    body: "Star Energies has a stocking facility in Wani, Maharashtra—giving the operation a practical point of presence close to the work.",
    logisticsNoteLabel: "LOGISTICS NOTE",
    logisticsNote: commercialInformation.transportSummary,
    media: mediaById["wani-yard-placeholder"],
    mediaCaption: ["WANI / MH", "PHOTO PLACEHOLDER"],
    figureCaption: "Stocking facility",
  },
  quality: {
    label: "Quality information / 07",
    heading: "Know the parameters that matter to your process.",
    body: "Quality and testing information can be shared according to your requirement and what is available for the material under consideration.",
    parameterIds: ["gcv", "grade", "ash", "moisture", "sulphur"],
    tableHeadings: ["PARAMETER", "DESCRIPTION", "REPORTING CONTEXT"],
    footLabels: ["QUALITY INFORMATION IS REQUIREMENT-LED", "NO UNIVERSAL CERTIFICATION CLAIMED"],
  },
  experience: {
    label: "Experience / 08",
    pretitle: "Star Energies is a new business.",
    heading: [
      { text: "Built with" },
      { text: "approximately 25 years", emphasis: true },
      { text: "of coal-industry experience behind it." },
    ],
    body: "That experience brings market understanding, relationships and a grounded view of how industrial requirements are actually fulfilled. Star Energies is being built as the next chapter: focused, responsive and ready to grow responsibly.",
    measure: ["00", "25", "NOW"],
  },
  finalCTA: {
    label: "Start a conversation / 09",
    heading: [
      { text: "Have a coal requirement?", breakAfter: true },
      { text: "Let’s make it specific.", emphasis: true },
    ],
    body: "Share grade, size, quantity and destination. We’ll start with the details that help determine a suitable route.",
    primaryCTA: { label: "Request a Quote", href: siteSettings.contact.emailHref, intent: "quote", external: true },
    secondaryCTA: { label: "WhatsApp", href: siteSettings.contact.whatsappHref, intent: "whatsapp", external: true },
    contactLabels: ["CALL", "EMAIL"],
  },
} satisfies HomePageContent;
