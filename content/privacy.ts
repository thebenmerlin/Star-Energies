import { routes } from "./routes";
import type { PrivacyPageContent } from "@/types/content";

export const privacyPage = {
  seo: {
    title: "Privacy | Star Energies",
    description: "Privacy notice for Star Energies website enquiries and business information.",
    canonicalPath: routes.privacy,
    noIndex: true,
  },
  opening: {
    label: "Privacy / launch preparation",
    heading: [{ text: "Clear information,", breakAfter: true }, { text: "pending legal review.", emphasis: true }],
    body: "This notice explains the general information used when someone contacts Star Energies. Final legal wording should be reviewed before the website goes live.",
    lastUpdated: "LAST UPDATED\nSEPTEMBER 2026",
  },
  sections: [
    {
      id: "purpose",
      displayOrder: 1,
      title: "Purpose of this notice",
      text: "This privacy notice explains the general information that may be collected when someone contacts Star Energies. It should be reviewed against final legal wording before production launch.",
    },
    {
      id: "enquiries",
      displayOrder: 2,
      title: "Enquiries and quotation requests",
      text: "If you contact us by phone, WhatsApp, email or the enquiry form, information such as your name, company, contact details and requirement details may be used to understand and respond to that business enquiry.",
    },
    {
      id: "business-information",
      displayOrder: 3,
      title: "Business information shared with us",
      text: "Information about coal requirements, destinations, quantities, technical preferences or commercial context may be handled for the purpose of evaluating and discussing a potential supply requirement.",
    },
    {
      id: "analytics",
      displayOrder: 4,
      title: "Website analytics",
      text: "Website analytics may be enabled in the future to understand how the site is used. Any final analytics implementation and related disclosures should be reviewed before launch.",
    },
    {
      id: "updates-and-contact",
      displayOrder: 5,
      title: "Updates and contact",
      text: "This notice may be updated as the website and business processes develop. For privacy-related questions, please contact Star Energies using the details on the Contact page.",
    },
  ],
  contactText: "For privacy-related questions, contact Star Energies directly.",
} satisfies PrivacyPageContent;
