"use client";

import { useState } from "react";
import type { AboutPageContent, ContactPageContent, HomePageContent, MediaAsset, OperationsPageContent } from "@/types/content";
import { AdminButton, Field, FormSection, MediaPicker, PageHeader, SaveBar, TextArea, TextInput } from "./admin-primitives";
import type { AdminSaveState } from "@/types/admin";

const lineText = (lines: readonly { text: string }[]) => lines.map((line) => line.text).join(" ");

function useLocalEditor() {
  const [state, setState] = useState<AdminSaveState>("idle");
  const markDirty = () => setState("dirty");
  const save = () => {
    setState("saving");
    window.setTimeout(() => setState("saved"), 420);
  };
  const publish = () => {
    setState("saving");
    window.setTimeout(() => setState("published"), 420);
  };
  return { state, markDirty, save, publish };
}

function EditorFooter({ editor, route }: { editor: ReturnType<typeof useLocalEditor>; route: string }) {
  return <SaveBar state={editor.state} onSave={editor.save} onPublish={editor.publish} onPreview={() => window.open(route, "_blank", "noopener,noreferrer")} />;
}

function ContentArea({ label, value, onChange, hint, required, max = 250 }: { label: string; value: string; onChange: (value: string) => void; hint?: string; required?: boolean; max?: number }) {
  const error = required && !value.trim() ? `${label} is required.` : value.length > max ? `Keep this below ${max} characters.` : undefined;
  return <Field label={label} required={required} hint={hint} error={error} count={`${value.length}/${max}`}><TextArea value={value} onChange={(event) => onChange(event.target.value)} maxLength={max + 40} /></Field>;
}

export function HomeContentEditor({ content, media }: { content: HomePageContent; media: MediaAsset[] }) {
  const editor = useLocalEditor();
  const [copy, setCopy] = useState({
    heroKicker: content.hero.kicker,
    heroHeading: lineText(content.hero.heading),
    capabilityHeading: lineText(content.capabilityIntro.heading),
    capabilityBody: content.capabilityIntro.body,
    sourcingHeading: content.requirementSourcing.heading,
    sourcingBody: content.requirementSourcing.body,
    coalHeading: content.sourcing.heading,
    coalBody: content.sourcing.body,
    industryBody: content.industries.body,
    coverageHeading: content.coverage.heading,
    coverageBody: content.coverage.body,
    facilityHeading: content.facility.heading,
    facilityBody: content.facility.body,
    qualityHeading: content.quality.heading,
    qualityBody: content.quality.body,
    experienceHeading: lineText(content.experience.heading),
    experienceBody: content.experience.body,
    finalHeading: lineText(content.finalCTA.heading),
    finalBody: content.finalCTA.body,
  });
  const [heroMediaId, setHeroMediaId] = useState(content.hero.media.id);
  const [facilityMediaId, setFacilityMediaId] = useState(content.facility.media.id);
  const update = (key: keyof typeof copy, value: string) => { setCopy((current) => ({ ...current, [key]: value })); editor.markDirty(); };

  return <>
    <PageHeader eyebrow="WEBSITE CONTENT / HOME" title="Home page" description="Fixed sections protect the approved page composition. Edit copy and photography inside those sections." />
    <div className="admin-editor-layout">
      <div>
        <FormSection eyebrow="01 / HERO" title="The first impression" description="The headline is intentionally short so it retains its editorial scale on every screen.">
          <div className="admin-fields admin-fields--two"><Field label="Eyebrow" required><TextInput defaultValue={content.hero.meta.join(" · ")} onChange={editor.markDirty} /></Field><Field label="Kicker" required><TextInput value={copy.heroKicker} onChange={(event) => update("heroKicker", event.target.value)} /></Field></div>
          <ContentArea label="Headline" value={copy.heroHeading} onChange={(value) => update("heroHeading", value)} required max={80} />
          <div className="admin-fields admin-fields--two"><Field label="Primary action label" required><TextInput defaultValue={content.hero.primaryCTA.label} onChange={editor.markDirty} /></Field><Field label="Secondary action label" required><TextInput defaultValue={content.hero.secondaryCTA.label} onChange={editor.markDirty} /></Field></div>
          <MediaPicker media={media} selectedId={heroMediaId} onSelect={(asset) => { setHeroMediaId(asset.id); editor.markDirty(); }} />
        </FormSection>

        <FormSection eyebrow="02 / CAPABILITY INTRODUCTION" title="Supply context" description="Introduces the scale and requirement-led nature of the business without presenting a fixed catalogue.">
          <ContentArea label="Heading" value={copy.capabilityHeading} onChange={(value) => update("capabilityHeading", value)} required max={120} /><ContentArea label="Body copy" value={copy.capabilityBody} onChange={(value) => update("capabilityBody", value)} required max={300} />
        </FormSection>

        <FormSection eyebrow="03 / REQUIREMENT-BASED SOURCING" title="Customer requirement" description="The Grade, Size, Quantity and Destination visual remains design-controlled.">
          <div className="admin-fields admin-fields--two"><Field label="Section heading" required><TextInput value={copy.sourcingHeading} onChange={(event) => update("sourcingHeading", event.target.value)} /></Field><Field label="Result label"><TextInput defaultValue={content.requirementSourcing.resultLabel} onChange={editor.markDirty} /></Field></div><ContentArea label="Body copy" value={copy.sourcingBody} onChange={(value) => update("sourcingBody", value)} required max={300} />
        </FormSection>

        <FormSection eyebrow="04 / COAL & INDUSTRIES" title="Featured areas" description="Featured product and industry selection is managed in their dedicated areas.">
          <div className="admin-fields admin-fields--two"><ContentArea label="Coal section heading" value={copy.coalHeading} onChange={(value) => update("coalHeading", value)} required max={100} /><ContentArea label="Coal section body" value={copy.coalBody} onChange={(value) => update("coalBody", value)} required max={260} /></div><ContentArea label="Industries introduction" value={copy.industryBody} onChange={(value) => update("industryBody", value)} required max={240} />
        </FormSection>

        <FormSection eyebrow="05 / COVERAGE" title="Geographic experience" description="Coverage regions are edited separately; this section contains only the framing copy.">
          <div className="admin-fields admin-fields--two"><ContentArea label="Heading" value={copy.coverageHeading} onChange={(value) => update("coverageHeading", value)} required max={120} /><ContentArea label="Body copy" value={copy.coverageBody} onChange={(value) => update("coverageBody", value)} required max={300} /></div>
        </FormSection>

        <FormSection eyebrow="06 / WANI FACILITY" title="Physical operation" description="Do not add unsupported capacity, equipment or dispatch claims.">
          <div className="admin-fields admin-fields--two"><ContentArea label="Heading" value={copy.facilityHeading} onChange={(value) => update("facilityHeading", value)} required max={120} /><ContentArea label="Body copy" value={copy.facilityBody} onChange={(value) => update("facilityBody", value)} required max={300} /></div><MediaPicker media={media} selectedId={facilityMediaId} onSelect={(asset) => { setFacilityMediaId(asset.id); editor.markDirty(); }} />
        </FormSection>

        <FormSection eyebrow="07 / QUALITY" title="Quality information" description="Parameter labels are managed in Quality under operations content. Availability language should remain qualified.">
          <div className="admin-fields admin-fields--two"><ContentArea label="Heading" value={copy.qualityHeading} onChange={(value) => update("qualityHeading", value)} required max={120} /><ContentArea label="Body copy" value={copy.qualityBody} onChange={(value) => update("qualityBody", value)} required max={280} /></div>
        </FormSection>

        <FormSection eyebrow="08 / EXPERIENCE" title="New venture, established experience" description="This distinction must remain factual: Star Energies is a new business backed by industry experience.">
          <div className="admin-fields admin-fields--two"><ContentArea label="Heading" value={copy.experienceHeading} onChange={(value) => update("experienceHeading", value)} required max={120} /><ContentArea label="Body copy" value={copy.experienceBody} onChange={(value) => update("experienceBody", value)} required max={300} /></div>
        </FormSection>

        <FormSection eyebrow="09 / FINAL CALL TO ACTION" title="Enquiry moment" description="Keeps direct contact available as an alternative to the quote form.">
          <div className="admin-fields admin-fields--two"><ContentArea label="Heading" value={copy.finalHeading} onChange={(value) => update("finalHeading", value)} required max={100} /><ContentArea label="Body copy" value={copy.finalBody} onChange={(value) => update("finalBody", value)} required max={260} /></div>
        </FormSection>
      </div>
      <aside className="admin-editor-aside"><p>FIXED PAGE STRUCTURE</p><b>Sections cannot be added, removed or reordered here.</b><span>This protects the approved home page design while leaving genuine business content editable.</span><AdminButton type="button" variant="line" onClick={() => window.open("/", "_blank", "noopener,noreferrer")}>View home page</AdminButton></aside>
    </div>
    <EditorFooter editor={editor} route="/" />
  </>;
}

export function AboutContentEditor({ content, media }: { content: AboutPageContent; media: MediaAsset[] }) {
  const editor = useLocalEditor();
  const [copy, setCopy] = useState({ opening: lineText(content.opening.heading), lead: content.distinction.lead, distinction: content.distinction.body, relationship: content.approach.items[0]?.description ?? "", ambition: content.ambition.body, leadership: content.people.entries[0]?.description ?? "", experience: content.people.entries[1]?.description ?? "", cta: content.ambition.cta.label });
  const [imageId, setImageId] = useState(media.find((asset) => asset.category === "team")?.id);
  const update = (key: keyof typeof copy, value: string) => { setCopy((current) => ({ ...current, [key]: value })); editor.markDirty(); };
  return <>
    <PageHeader eyebrow="WEBSITE CONTENT / ABOUT" title="About" description="A new-generation business with a clear, factual distinction between the brand and the experience behind it." />
    <div className="admin-editor-layout"><div>
      <FormSection eyebrow="01 / OPENING" title="Company positioning"><ContentArea label="Editorial heading" value={copy.opening} onChange={(value) => update("opening", value)} required max={100} /><div className="admin-fields admin-fields--two"><Field label="Experience prefix"><TextInput defaultValue={content.opening.experiencePrefix} onChange={editor.markDirty} /></Field><Field label="Experience statement"><TextInput defaultValue={`${content.opening.experienceValue} ${content.opening.experienceLabel}`} onChange={editor.markDirty} /></Field></div></FormSection>
      <FormSection eyebrow="02 / DISTINCTION" title="A new business, built on experience" description="Avoid dates, milestones or claims that imply Star Energies itself is 25 years old."><ContentArea label="Lead statement" value={copy.lead} onChange={(value) => update("lead", value)} required max={220} /><ContentArea label="Supporting copy" value={copy.distinction} onChange={(value) => update("distinction", value)} required max={360} /></FormSection>
      <FormSection eyebrow="03 / PEOPLE & APPROACH" title="Direct business context" description="Use minimal personal naming. These fields are concise context, not long biographies."><div className="admin-fields admin-fields--two"><ContentArea label="Leadership copy" value={copy.leadership} onChange={(value) => update("leadership", value)} required max={280} /><ContentArea label="Experience copy" value={copy.experience} onChange={(value) => update("experience", value)} required max={280} /></div><ContentArea label="Customer relationship approach" value={copy.relationship} onChange={(value) => update("relationship", value)} required max={260} /><MediaPicker media={media} selectedId={imageId} onSelect={(asset) => { setImageId(asset.id); editor.markDirty(); }} /></FormSection>
      <FormSection eyebrow="04 / AMBITION" title="Long-term direction"><ContentArea label="National ambition copy" value={copy.ambition} onChange={(value) => update("ambition", value)} required max={320} /><Field label="Call to action label"><TextInput value={copy.cta} onChange={(event) => update("cta", event.target.value)} /></Field></FormSection>
    </div><aside className="admin-editor-aside"><p>CLAIM SAFETY</p><b>Keep the distinction clear.</b><span>Star Energies is new. Approximately 25 years refers to the coal-industry experience behind the venture.</span></aside></div>
    <EditorFooter editor={editor} route="/about" />
  </>;
}

export function ContactContentEditor({ content }: { content: ContactPageContent }) {
  const editor = useLocalEditor();
  const [copy, setCopy] = useState({ opening: lineText(content.opening.heading), openingBody: content.opening.body, formHeading: lineText(content.formIntro.heading), helper: content.formIntro.helper, submitLabel: content.formIntro.quoteForm.submitLabel, messageLabel: content.formIntro.quoteForm.messageLabel, reassurance: content.reassurance.body });
  const update = (key: keyof typeof copy, value: string) => { setCopy((current) => ({ ...current, [key]: value })); editor.markDirty(); };
  return <>
    <PageHeader eyebrow="WEBSITE CONTENT / CONTACT" title="Contact" description="The public page keeps direct phone, WhatsApp and email visible beside the structured quote form." />
    <div className="admin-editor-layout"><div>
      <FormSection eyebrow="01 / OPENING" title="Direct conversation"><ContentArea label="Heading" value={copy.opening} onChange={(value) => update("opening", value)} required max={100} /><ContentArea label="Supporting copy" value={copy.openingBody} onChange={(value) => update("openingBody", value)} required max={280} /></FormSection>
      <FormSection eyebrow="02 / QUOTE FORM" title="Requirement helper" description="The form fields themselves remain structured and design-controlled for later enquiry handling."><ContentArea label="Form heading" value={copy.formHeading} onChange={(value) => update("formHeading", value)} required max={100} /><ContentArea label="Helper text" value={copy.helper} onChange={(value) => update("helper", value)} required max={250} /><div className="admin-fields admin-fields--two"><Field label="Form submit label"><TextInput value={copy.submitLabel} onChange={(event) => update("submitLabel", event.target.value)} /></Field><Field label="Message label"><TextInput value={copy.messageLabel} onChange={(event) => update("messageLabel", event.target.value)} /></Field></div></FormSection>
      <FormSection eyebrow="03 / REASSURANCE" title="If a buyer does not know every detail"><ContentArea label="Reassurance copy" value={copy.reassurance} onChange={(value) => update("reassurance", value)} required max={260} /></FormSection>
    </div><aside className="admin-editor-aside"><p>PUBLIC CONTACT DETAILS</p><b>Phone, WhatsApp and email are managed in Settings.</b><span>Keeping the details in one place prevents conflicting contact information across the site.</span></aside></div>
    <EditorFooter editor={editor} route="/contact" />
  </>;
}

export function OperationsContentEditor({ content, media }: { content: OperationsPageContent; media: MediaAsset[] }) {
  const editor = useLocalEditor();
  const [copy, setCopy] = useState({ opening: lineText(content.opening.heading), openingBody: content.opening.body, sequence: content.sequence.heading, coverage: lineText(content.coverage.heading), coverageBody: content.coverage.body, transportLead: content.transport.lead, transportBody: content.transport.body, finalHeading: lineText(content.finalCTA.heading), finalCta: content.finalCTA.cta.label });
  const [imageId, setImageId] = useState(content.opening.media.id);
  const update = (key: keyof typeof copy, value: string) => { setCopy((current) => ({ ...current, [key]: value })); editor.markDirty(); };
  return <>
    <PageHeader eyebrow="OPERATIONS" title="Operations content" description="Manage the factual language around stocking, sourcing coordination and geographic experience." />
    <div className="admin-editor-layout"><div>
      <FormSection eyebrow="01 / WANI STOCKING FACILITY" title="Physical presence" description="Use this section for the Wani facility, without adding unknown capacity or equipment details."><ContentArea label="Heading" value={copy.opening} onChange={(value) => update("opening", value)} required max={110} /><ContentArea label="Body copy" value={copy.openingBody} onChange={(value) => update("openingBody", value)} required max={320} /><MediaPicker media={media} selectedId={imageId} onSelect={(asset) => { setImageId(asset.id); editor.markDirty(); }} /></FormSection>
      <FormSection eyebrow="02 / SUPPLY COORDINATION" title="Operational sequence"><ContentArea label="Section heading" value={copy.sequence} onChange={(value) => update("sequence", value)} required max={100} /><div className="admin-static-list">{content.sequence.items.map((item) => <div key={item.id}><b>{String(item.displayOrder).padStart(2, "0")}</b><span><strong>{item.title}</strong><small>{item.description}</small></span></div>)}</div></FormSection>
      <FormSection eyebrow="03 / GEOGRAPHIC EXPERIENCE" title="Coverage framing"><div className="admin-fields admin-fields--two"><ContentArea label="Heading" value={copy.coverage} onChange={(value) => update("coverage", value)} required max={110} /><ContentArea label="Body copy" value={copy.coverageBody} onChange={(value) => update("coverageBody", value)} required max={300} /></div></FormSection>
      <FormSection eyebrow="04 / TRANSPORT" title="Third-party coordination" description="This safety statement is intentionally direct."><ContentArea label="Lead statement" value={copy.transportLead} onChange={(value) => update("transportLead", value)} required max={220} /><ContentArea label="Supporting copy" value={copy.transportBody} onChange={(value) => update("transportBody", value)} required max={300} /></FormSection>
      <FormSection eyebrow="05 / FINAL CALL TO ACTION" title="Next conversation"><div className="admin-fields admin-fields--two"><ContentArea label="Heading" value={copy.finalHeading} onChange={(value) => update("finalHeading", value)} required max={100} /><Field label="Action label"><TextInput value={copy.finalCta} onChange={(event) => update("finalCta", event.target.value)} /></Field></div></FormSection>
    </div><aside className="admin-editor-aside"><p>IMPORTANT</p><b>Star Energies does not operate its own transport fleet.</b><span>Transportation may be coordinated through third-party transport providers where required.</span></aside></div>
    <EditorFooter editor={editor} route="/operations" />
  </>;
}
