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
    sceneCaption: "COAL / STOCKING YARD",
    sceneScale: "01 — 04",
    requirementDimensionIds: ["grade", "size", "quantity", "destination"],
    scrollLabel: "SCROLL TO EXPLORE",
    progressLabel: "STAR ENERGIES / 01",
  },
  process: {
    label: "How it works / 01",
    heading: [
      { text: "From your requirement", breakAfter: true },
      { text: "to dispatch.", emphasis: true },
    ],
    body: "Five considered stages give every buyer a clear picture of the conversation before material is committed.",
    steps: [
      { id: "requirement", title: "Requirement", description: "Material, grade/GCV, size, quantity, frequency and delivery location." },
      { id: "sourcing", title: "Sourcing", description: "Suitable WCL, e-auction, supplier and trader routes are considered against the brief." },
      { id: "quality", title: "Quality & specifications", description: "Relevant material parameters and available reports are clarified for the intended application." },
      { id: "commercials-logistics", title: "Commercials & logistics", description: "The commercial route and third-party delivery coordination are discussed together." },
      { id: "dispatch", title: "Dispatch", description: "Once terms are agreed, dispatch and destination coordination are aligned to the plan." },
    ],
  },
  whyStar: {
    label: "Why Star Energies / 02",
    heading: [
      { text: "A coal source should", breakAfter: true },
      { text: "fit the job.", emphasis: true },
    ],
    body: "The strongest supply conversation brings the material, route and delivery plan into focus around the way your operation actually works.",
    reasons: [
      { id: "requirement-first", signal: "THE STARTING POINT", title: "Requirement before route", description: "Grade/GCV, size, volume, frequency, destination and application frame the sourcing conversation from the outset." },
      { id: "source-options", signal: "THE MARKET VIEW", title: "Routes considered to fit", description: "WCL, auction / e-auction, trader and supplier routes can be assessed against the brief and availability at the time." },
      { id: "specification-context", signal: "THE MATERIAL FIT", title: "Specifications in view", description: "Relevant material parameters and available reports are clarified against the intended industrial application." },
      { id: "stocking-base", signal: "THE PHYSICAL BASE", title: "A Wani stocking facility", description: "A practical operating point in the coal belt gives the business a physical base close to the work." },
      { id: "industry-experience", signal: "THE PERSPECTIVE", title: "Industry-earned understanding", description: "Star Energies is a new business backed by approximately 25 years of coal-industry experience." },
      { id: "supply-coordination", signal: "THE HANDOVER", title: "Commercials and logistics together", description: "The commercial route and third-party delivery coordination are considered together before dispatch is aligned." },
    ],
  },
  capabilityIntro: {
    label: "Capability / 03",
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
    label: "Requirement-led sourcing / 04",
    heading: "A clear brief is where the work starts.",
    body: "Tell us what your operation needs. Star Energies evaluates suitable sourcing routes around that requirement.",
    resultLabel: "YOUR REQUIREMENT",
    result: [{ text: "Suitable sourcing", breakAfter: true }, { text: "options evaluated" }],
  },
  sourcing: {
    label: "Coal & sourcing / 05",
    heading: "Material routes, considered with purpose.",
    body: "We do not put coal into a public shopping basket. Each enquiry is considered against the material and commercial context at that time, including available auction, trader and supplier routes.",
    productIds: ["wcl-coal", "auction-e-auction-coal", "steam-coal", "requirement-based-sourcing"],
    media: mediaById["coal-material-placeholder"],
    mediaCaption: ["MAT. STUDY / 01", "COAL MATERIAL"],
  },
  industries: {
    label: "Industrial applications / 06",
    body: "For businesses that depend on steady heat, process energy and material that fits the job.",
    industryIds: ["manufacturing", "chemical-industries", "power", "industrial-boilers", "brick-kilns", "other-industrial-users"],
    footLabels: ["INDUSTRIAL COAL USERS", "APPLICATION-SPECIFIC DISCUSSION WELCOME"],
  },
  coverage: {
    label: "Operating ambition / 07",
    heading: "Connected to industrial demand beyond one region.",
    body: "Current industry experience includes Maharashtra, Telangana / Hyderabad, Andhra Pradesh / Visakhapatnam, Karnataka and Gujarat.",
    qualification: `${commercialInformation.panIndiaQualification} The diagram reflects experience and operating ambition—not office locations.`,
    mapNote: "REGIONAL INDUSTRY EXPERIENCE",
    regionIds: ["maharashtra", "telangana-hyderabad", "andhra-visakhapatnam", "karnataka", "gujarat"],
  },
  facility: {
    label: "Operations / 08",
    heading: "A physical base at the heart of the coal belt.",
    body: "Star Energies has a stocking facility in Wani, Maharashtra—giving the operation a practical point of presence close to the work.",
    logisticsNoteLabel: "LOGISTICS NOTE",
    logisticsNote: commercialInformation.transportSummary,
    media: mediaById["wani-yard-placeholder"],
    mediaCaption: ["WANI / MH", "STOCKING YARD"],
    figureCaption: "Stocking facility",
  },
  quality: {
    label: "Quality information / 09",
    heading: "Know the parameters that matter to your process.",
    body: "Quality and testing information can be shared according to your requirement and what is available for the material under consideration.",
    parameterIds: ["gcv", "grade", "ash", "moisture", "sulphur"],
    tableHeadings: ["PARAMETER", "DESCRIPTION", "REPORTING CONTEXT"],
    footLabels: ["QUALITY INFORMATION IS REQUIREMENT-LED", "NO UNIVERSAL CERTIFICATION CLAIMED"],
  },
  experience: {
    label: "Experience / 10",
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
    label: "Start a conversation / 11",
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
