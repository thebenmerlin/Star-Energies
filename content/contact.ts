import { routes } from "./routes";
import { siteSettings } from "./site";
import type { ContactPageContent } from "@/types/content";

export const contactPage = {
  seo: {
    title: "Contact | Star Energies",
    description: "Discuss an industrial coal requirement with Star Energies in Wani, Maharashtra.",
    canonicalPath: routes.contact,
  },
  opening: {
    label: "Contact / 01",
    heading: [{ text: "A serious requirement", breakAfter: true }, { text: "deserves a direct line.", emphasis: true }],
    body: "Call, WhatsApp or email Star Energies. If a quote form is useful, use the structured brief below.",
    channelLabels: ["PHONE", "WHATSAPP", "EMAIL"],
    whatsappLabel: "Start a conversation",
  },
  formIntro: {
    label: "Request a quote / 02",
    heading: [{ text: "Start with", breakAfter: true }, { text: "what you know.", emphasis: true }],
    helper: "Technical fields are optional because not every buyer will have every detail to hand. We can discuss the missing information directly.",
    requirementPromptLabel: "IF YOU KNOW IT, TELL US",
    requirementDimensionIds: ["grade", "size", "quantity", "destination"],
    quoteForm: {
      heading: "ENQUIRY / 01",
      helperText: "Fields marked * are required. We only ask for business details that are relevant to your role.",
      groups: [
        {
          id: "contact-details",
          label: "01",
          fields: [
            { name: "contactPerson", label: "Contact Person", required: true, type: "text", width: "half", autoComplete: "name" },
            { name: "companyName", label: "Company Name", required: true, type: "text", width: "half", autoComplete: "organization" },
            { name: "phone", label: "Phone", required: true, type: "tel", width: "half", autoComplete: "tel" },
            { name: "email", label: "Email", required: false, type: "email", width: "half", autoComplete: "email" },
            { name: "whatsapp", label: "WhatsApp", required: false, optional: true, type: "tel", width: "full", autoComplete: "tel" },
          ],
        },
        {
          id: "material-requirement",
          label: "02",
          fields: [
            { name: "coalRequirement", label: "Coal Requirement / Type", required: true, type: "text", width: "full" },
            { name: "gradeGcv", label: "Grade or GCV", required: false, optional: true, type: "text", width: "half" },
            { name: "size", label: "Size", required: false, optional: true, type: "text", width: "half" },
            { name: "quantity", label: "Quantity", required: true, type: "text", width: "half" },
            { name: "unit", label: "Unit", required: true, type: "select", width: "half", placeholder: "Select unit", options: ["Tonnes", "MT", "Other"] },
          ],
        },
        {
          id: "delivery-details",
          label: "03",
          fields: [
            { name: "deliveryCity", label: "Delivery City", required: true, type: "text", width: "full", autoComplete: "address-level2" },
            { name: "state", label: "State", required: true, type: "text", width: "half", autoComplete: "address-level1" },
            { name: "pincode", label: "Pincode", required: false, optional: true, type: "text", width: "half", autoComplete: "postal-code" },
            { name: "timeline", label: "Desired Timeline", required: false, optional: true, type: "text", width: "full" },
          ],
        },
      ],
      messageLabel: "Additional specifications",
      messageOptionalLabel: "OPTIONAL",
      submitLabel: "Send Enquiry",
      validationMessages: {
        incomplete: "Please complete the required fields so we can understand the enquiry.",
        contactMethod: "Please add a phone number or email so we can respond.",
        success: "Your requirement has been received. Star Energies will contact you to discuss availability and quotation.",
      },
    },
  },
  reassurance: {
    eyebrow: "NO NEED TO WAIT FOR A PERFECT BRIEF.",
    body: "If you know the application, quantity and delivery destination, that is enough to start a useful conversation.",
    cta: { label: "WhatsApp Star Energies", href: siteSettings.contact.whatsappHref, intent: "whatsapp", external: true },
  },
} satisfies ContactPageContent;
