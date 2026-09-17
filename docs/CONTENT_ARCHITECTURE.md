# Star Energies content architecture

## Purpose

The approved public-site design remains separated from business content. Phase 5 persists the approved local seed data in Neon Postgres through Drizzle; public pages still access it only through `lib/content/index.ts`, so presentation components remain independent of database details.

## Source of truth

| Domain | Bootstrap seed source | Admin area |
| --- | --- | --- |
| Site settings, contact details, navigation, logo reference | `content/site.ts` | Settings |
| Public paths | `content/routes.ts` | Design-controlled route configuration |
| Replaceable imagery | `content/media.ts` | Media |
| Home page | `content/home.ts` | Home |
| About page | `content/about.ts` | About |
| Coal categories | `content/products.ts` | Products |
| Coal page | `content/coal.ts` | Coal & Products |
| Industries and Industries page | `content/industries.ts`, `content/industries-page.ts` | Industries |
| Capabilities and Capabilities page | `content/capabilities.ts`, `content/capabilities-page.ts` | Capabilities |
| Operations page, coverage, quality parameters | `content/operations.ts`, `content/coverage.ts` | Operations |
| Contact page and enquiry-field configuration | `content/contact.ts` | Contact / Enquiries |
| Privacy page | `content/privacy.ts` | Settings / Legal |

The shared types and validation schemas are in `types/content.ts`.

## Content service boundary

Pages and shared server components must use getters from `lib/content/index.ts`, for example:

```ts
getSiteSettings()
getHomePage()
getProducts()
getIndustries()
getCapabilities()
getOperationsPage()
```

The getters are asynchronous server-side reads from Neon and return published/active content only. `db/seed/index.ts` imports the original approved `content/` files and upserts them into the database. Presentation components continue to receive the same typed shapes.

## Core models

- `SiteSettings`: canonical brand, contact, address, CTA, navigation, logo reference and default SEO. Phone, WhatsApp and email must only be changed here.
- `SeoMetadata`: title, description, optional Open Graph fields, canonical path preparation and `noIndex`.
- `MediaAsset`: stable ID, object-storage key/URL, accessible text, caption/label, asset category and placeholder status. Metadata is stored in Neon while image binaries remain in S3-compatible storage.
- `Product`, `Industry`, `Capability`: stable string ID/slug, public copy, active/featured state, `published` preparation and display order. No product carries public pricing or stock counts.
- `CoverageRegion`: industry-experience geography only. It is not an office-location model.
- `QualityParameter`: reportable parameter labels only; it must not be used to invent ranges, certifications or promises.
- `QuoteFormContent`: approved enquiry fields, labels, optionality and user-facing form messages. Form layout and validation behaviour remain design-controlled.
- Page content models (`HomePageContent`, `AboutPageContent`, `CoalPageContent`, `IndustriesPageContent`, `CapabilitiesPageContent`, `OperationsPageContent`, `ContactPageContent`, `PrivacyPageContent`): explicit, page-specific structures. This is intentionally not a generic page builder.

Zod validates settings, media, entity collections, coverage, quality, requirement dimensions, form configuration and page SEO when the local repository is read. TypeScript `satisfies` checks the richer art-directed page structures at build time. Length limits protect layout-sensitive fields without truncating approved copy.

## Editability classification

### Client editable

- Contact details, address, GSTIN and business hours when supplied
- Approved page copy and SEO copy
- Product, industry and capability descriptions
- Replaceable media assets and their alt text/captions
- Privacy/legal wording after review

### Structured / limited editable

- Active, featured, published and display-order controls
- Coverage regions and quality-parameter labels
- CTA label and destination choices
- Enquiry field labels and optionality within the approved form model

### Design controlled

- Route/page composition and section order
- Typography, colour, spacing, grid, animation and responsive CSS
- SVG map geometry, image crops, visual treatments and component variants
- Input layout, validation logic and any future integration mechanics

The future admin should expose only the first two categories. It must not expose arbitrary HTML, JSON, CSS, React components or drag-and-drop sections.

## Safety rules retained in the data model

- Star Energies is newly established; approximately 25 years refers to underlying industry experience, not company age.
- No mine ownership, transport-fleet ownership, branches, official WCL partnership, capacity, certification, customer or availability claims may be added without evidence.
- Transport is coordinated through third-party providers where required.
- Pan-India supply is subject to sourcing, availability, logistics and commercial feasibility.
- Quality information is requirement-led and only shared where required/available.
- Coal prices must never be added to public product content.

## Known placeholders before launch

- Final phone number, WhatsApp number and email
- Production domain/canonical URL
- GSTIN, if intended for public use
- Final SVG logo
- Client-approved photography for coal, facility, industrial and operations usage
- Final legal review of the privacy notice

The seeded site settings mark contact data as `isPlaceholder: true`; seeded development imagery is marked `placeholder: true`.

## Persistence and publishing

- Fixed page documents have separate draft and published JSONB records in explicit page tables. They are page-specific models, not arbitrary blocks or a page builder.
- Products, industries, capabilities, coverage, quality, requirements, settings, media, SEO, and media references are relational tables with stable IDs/slugs and display order where appropriate.
- The admin console saves drafts, then explicitly publishes public-facing page and SEO changes. Catalogue entries use `published` plus `active` states; inactive/draft entities never reach public getters.
- Media usage is tracked so an image cannot be deleted while a known page or catalogue record references it.

## Phase 6 boundary

The enquiry list and detail interface intentionally remain local demonstration data. Do not add Request a Quote persistence, notifications, anti-spam logic, or enquiry workflows until Phase 6 is authorised.
