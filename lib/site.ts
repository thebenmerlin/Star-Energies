export const siteConfig = {
  name: "Star Energies",
  shortName: "STAR ENERGIES",
  description:
    "Requirement-led industrial coal sourcing and supply from Wani, Maharashtra.",
  location: "Wani, Yavatmal, Maharashtra, India",
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
  { label: "About", href: "/about" },
  { label: "Coal & Products", href: "/coal" },
  { label: "Industries", href: "/industries" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Operations", href: "/operations" },
  { label: "Contact", href: "/contact" },
];

export const placeholderImages = {
  coalStudy: {
    src: "/images/placeholder-coal-material.png",
    alt: "Temporary coal material image placeholder",
    label: "DEVELOPMENT IMAGE / COAL MATERIAL",
  },
  yard: {
    src: "/images/placeholder-coal-yard.png",
    alt: "Temporary industrial stocking-yard image placeholder",
    label: "DEVELOPMENT IMAGE / STOCKING YARD",
  },
  industrial: {
    src: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=85",
    alt: "Temporary industrial environment image placeholder",
    label: "DEVELOPMENT IMAGE / INDUSTRIAL ENVIRONMENT",
  },
  process: {
    src: "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=1500&q=85",
    alt: "Temporary industrial process image placeholder",
    label: "DEVELOPMENT IMAGE / PROCESS ENVIRONMENT",
  },
};

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

export const industryDetails = [
  { number: "01", title: "Manufacturing", description: "For manufacturing operations with coal requirements shaped by process, handling and destination." },
  { number: "02", title: "Chemical Industries", description: "For chemical-industry buyers assessing coal against the needs of a specific operation." },
  { number: "03", title: "Power", description: "For power-related industrial requirements considered against the material brief and commercial context." },
  { number: "04", title: "Industrial Boilers", description: "For boiler applications where the customer’s operating requirement guides the conversation." },
  { number: "05", title: "Brick Kilns", description: "For kiln operators discussing sourcing around their material requirement and delivery location." },
  { number: "06", title: "Other Industrial Users", description: "For industrial coal users whose application does not sit neatly inside a standard category." },
];

export const capabilityDetails = [
  { number: "01", title: "Sourcing", description: "Requirement-led evaluation across available WCL, auction, e-auction, trader and supplier routes." },
  { number: "02", title: "Specification", description: "Discussion can begin with grade, GCV, size, application and the material information you have." },
  { number: "03", title: "Volume", description: "Requirements may range from approximately 100 tonnes to several thousand tonnes, subject to feasibility." },
  { number: "04", title: "Quality Information", description: "Quality or laboratory information can be considered where required and available for the material." },
  { number: "05", title: "Commercial Terms", description: "Advance or credit arrangements may be discussed depending on the transaction and commercial assessment." },
  { number: "06", title: "Transport Coordination", description: "Third-party transportation can be coordinated where required; Star Energies does not operate its own fleet." },
];

export const coverageRegions = [
  "Maharashtra",
  "Telangana / Hyderabad",
  "Andhra Pradesh / Visakhapatnam",
  "Karnataka",
  "Gujarat",
];

export const qualityParameters = [
  { code: "GCV", name: "Gross Calorific Value", note: "as available / required" },
  { code: "GR", name: "Grade", note: "as applicable" },
  { code: "ASH", name: "Ash", note: "as available / required" },
  { code: "MST", name: "Moisture", note: "as available / required" },
  { code: "SUL", name: "Sulphur", note: "where required / available" },
];

export const privacySections = [
  {
    title: "Purpose of this notice",
    text: "This placeholder privacy notice explains the general information that may be collected when someone contacts Star Energies. It should be reviewed and replaced with final legal wording before production launch.",
  },
  {
    title: "Enquiries and quotation requests",
    text: "If you contact us by phone, WhatsApp, email or a future enquiry form, information such as your name, company, contact details and requirement details may be used to understand and respond to that business enquiry.",
  },
  {
    title: "Business information shared with us",
    text: "Information about coal requirements, destinations, quantities, technical preferences or commercial context may be handled for the purpose of evaluating and discussing a potential supply requirement.",
  },
  {
    title: "Website analytics",
    text: "Website analytics may be enabled in the future to understand how the site is used. Any final analytics implementation and related disclosures should be reviewed before launch.",
  },
  {
    title: "Updates and contact",
    text: "This notice may be updated as the website and business processes develop. For privacy-related questions, please contact Star Energies using the details on the Contact page.",
  },
];
