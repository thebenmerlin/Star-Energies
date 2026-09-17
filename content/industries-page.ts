import { mediaById } from "./media";
import { quoteRoute, routes } from "./routes";
import type { IndustriesPageContent } from "@/types/content";

export const industriesPage = {
  seo: {
    title: "Industries | Star Energies",
    description: "Industrial coal supply discussions for manufacturing, chemicals, power, boilers, brick kilns and other users.",
    canonicalPath: routes.industries,
  },
  opening: {
    label: "Industrial applications / 01",
    statement: "COAL REQUIREMENTS ARE APPLICATION-SPECIFIC.",
    heading: [
      { text: "For operations", breakAfter: true },
      { text: "where the material", emphasis: true, breakAfter: true },
      { text: "has a job to do.", emphasis: true },
    ],
    indexLabel: "APPLICATION INDEX / 06",
  },
  directory: {
    label: "Where we start / 02",
    heading: "An industry name is only the beginning.",
    body: "Requirements can differ by process, handling setup, material preference and destination. Star Energies works from the actual need rather than a generic category label.",
    industryIds: ["manufacturing", "chemical-industries", "power", "industrial-boilers", "brick-kilns", "other-industrial-users"],
    media: mediaById["industrial-environment-placeholder"],
    mediaCaption: "APPLICATION ENVIRONMENT / DEVELOPMENT PLACEHOLDER",
  },
  logic: {
    label: "Requirement logic / 03",
    heading: "The question is not simply “what industry?”",
    questions: [
      "What does the application require?",
      "What material information is available?",
      "Where does the material need to go?",
      "What sourcing route is commercially feasible?",
    ],
  },
  other: {
    eyebrow: "NOT LISTED?",
    heading: [
      { text: "Your operation", breakAfter: true },
      { text: "doesn’t need to fit", breakAfter: true },
      { text: "our directory.", emphasis: true },
    ],
    body: "These are customer categories, not limits. If you are an industrial coal user with a clear requirement, a direct discussion is the right place to begin.",
    cta: { label: "Discuss your requirement", href: quoteRoute, intent: "quote" },
  },
  finalCTA: {
    eyebrow: "INDUSTRIAL COAL REQUIREMENT",
    heading: [{ text: "Let’s start", breakAfter: true }, { text: "with the application.", emphasis: true }],
    cta: { label: "Discuss Your Requirement", href: quoteRoute, intent: "quote" },
  },
} satisfies IndustriesPageContent;
