export const siteConfig = {
  name: "Star Energies",
  shortName: "STAR ENERGIES",
  description:
    "Requirement-led industrial coal sourcing and supply from Wani, Maharashtra.",
  location: "Wani, Maharashtra, India",
  contact: {
    phoneDisplay: "+91 00000 00000",
    phoneHref: "tel:+910000000000",
    whatsappHref: "https://wa.me/910000000000",
    email: "contact@starenergies.in",
    emailHref: "mailto:contact@starenergies.in",
  },
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "#experience" },
  { label: "Coal & Products", href: "#coal" },
  { label: "Industries", href: "#industries" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Operations", href: "#operations" },
  { label: "Contact", href: "#enquire" },
];

export const requirementFields = [
  {
    index: "01",
    label: "Grade",
    detail: "Specify the coal grade appropriate to your operation.",
  },
  {
    index: "02",
    label: "Size",
    detail: "Share the size fraction or handling requirement.",
  },
  {
    index: "03",
    label: "Quantity",
    detail: "From an initial lot to sustained industrial demand.",
  },
  {
    index: "04",
    label: "Destination",
    detail: "Tell us where material needs to be delivered.",
  },
];

export const sourcingOptions = [
  {
    number: "01",
    title: "WCL Coal",
    text: "Material sourced through available WCL channels, aligned to requirement and commercial feasibility.",
  },
  {
    number: "02",
    title: "Auction / E-auction",
    text: "Auction-led opportunities evaluated against the grade, quantity and destination you need.",
  },
  {
    number: "03",
    title: "Steam Coal",
    text: "Industrial steam-coal requirements considered with the operating context in view.",
  },
  {
    number: "04",
    title: "Requirement-Based Sourcing",
    text: "A sourcing approach shaped around your brief—not a fixed public catalogue.",
  },
];

export const industries = [
  "Manufacturing",
  "Chemicals",
  "Power",
  "Industrial Boilers",
  "Brick Kilns",
  "Other Industrial Users",
];

export const qualityParameters = [
  { code: "GCV", name: "Gross Calorific Value", note: "as available / required" },
  { code: "GR", name: "Grade", note: "as applicable" },
  { code: "ASH", name: "Ash", note: "as available / required" },
  { code: "MST", name: "Moisture", note: "as available / required" },
  { code: "SUL", name: "Sulphur", note: "where required / available" },
];
