import { routes, quoteRoute } from "./routes";
import type { SiteSettings } from "@/types/content";

/**
 * Canonical business settings. Contact details remain intentionally marked as
 * placeholders until the client supplies production information.
 */
export const siteSettings = {
  businessName: "Star Energies",
  brandName: "STAR ENERGIES",
  tagline: "Industrial coal. Sourced to requirement.",
  shortDescription: "Requirement-led industrial coal sourcing and supply from Wani, Maharashtra.",
  footerDescription: "Requirement-led industrial coal sourcing and supply, based in Wani.",
  footerMeta: "Industrial coal supply · India",
  contact: {
    phoneDisplay: "+91 00000 00000",
    phoneHref: "tel:+910000000000",
    whatsappHref: "https://wa.me/910000000000",
    email: "contact@starenergies.in",
    emailHref: "mailto:contact@starenergies.in",
    isPlaceholder: true,
  },
  address: {
    display: "Wani, Yavatmal, Maharashtra, India",
    city: "Wani",
    district: "Yavatmal",
    state: "Maharashtra",
    country: "India",
  },
  primaryQuoteCTA: { label: "Request a Quote", href: quoteRoute, intent: "quote" },
  secondaryContactCTA: { label: "WhatsApp", href: "https://wa.me/910000000000", intent: "whatsapp", external: true },
  defaultSeo: {
    title: "Star Energies | Industrial Coal, Sourced to Requirement",
    description: "Requirement-led industrial coal sourcing and supply from Wani, Maharashtra.",
    canonicalPath: routes.home,
  },
  logo: {
    assetId: "star-energies-wordmark",
    altText: "Star Energies",
  },
  navigation: [
    { route: "home", label: "Home" },
    { route: "about", label: "About" },
    { route: "coal", label: "Coal & Products" },
    { route: "industries", label: "Industries" },
    { route: "capabilities", label: "Capabilities" },
    { route: "operations", label: "Operations" },
    { route: "contact", label: "Contact" },
  ],
} satisfies SiteSettings;
