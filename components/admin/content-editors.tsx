"use client";

import { useState } from "react";
import type { AboutPageContent, ContactPageContent, HomePageContent, MediaAsset, OperationsPageContent } from "@/types/content";
import { publishPageAction, savePageDraftAction, type AdminActionResult } from "@/app/admin/actions";
import { AdminButton, Field, FormSection, MediaPicker, PageHeader, SaveBar, TextArea, TextInput } from "./admin-primitives";
import { EditorialRichEditor } from "./editorial-rich-editor";
import type { AdminSaveState } from "@/types/admin";

function usePersistentEditor(saveDraft: () => Promise<AdminActionResult>, publish: () => Promise<AdminActionResult>) {
  const [state, setState] = useState<AdminSaveState>("idle");
  const markDirty = () => setState("dirty");
  const save = async () => {
    setState("saving");
    const result = await saveDraft();
    setState(result.ok ? "saved" : "error");
  };
  const publishContent = async () => {
    setState("saving");
    const saved = await saveDraft();
    if (!saved.ok) { setState("error"); return; }
    const result = await publish();
    setState(result.ok ? "published" : "error");
  };
  return { state, markDirty, save, publish: publishContent };
}

function EditorFooter({ editor, route }: { editor: ReturnType<typeof usePersistentEditor>; route: string }) {
  return <SaveBar state={editor.state} onSave={editor.save} onPublish={editor.publish} onPreview={() => window.open(route, "_blank", "noopener,noreferrer")} />;
}

function ContentArea({ label, value, onChange, hint, required, max = 250 }: { label: string; value: string; onChange: (value: string) => void; hint?: string; required?: boolean; max?: number }) {
  const error = required && !value.trim() ? `${label} is required.` : value.length > max ? `Keep this below ${max} characters.` : undefined;
  return <Field label={label} required={required} hint={hint} error={error} count={`${value.length}/${max}`}><TextArea value={value} onChange={(event) => onChange(event.target.value)} maxLength={max + 40} /></Field>;
}

export function HomeContentEditor({ content, media }: { content: HomePageContent; media: MediaAsset[] }) {
  const [copy, setCopy] = useState({
    heroMeta: content.hero.meta.join(" · "),
    heroKicker: content.hero.kicker,
    heroHeading: content.hero.heading,
    primaryLabel: content.hero.primaryCTA.label,
    secondaryLabel: content.hero.secondaryCTA.label,
    processHeading: content.process.heading,
    processBody: content.process.body,
    capabilityHeading: content.capabilityIntro.heading,
    capabilityBody: content.capabilityIntro.body,
    sourcingHeading: content.requirementSourcing.heading,
    resultLabel: content.requirementSourcing.resultLabel,
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
    experienceHeading: content.experience.heading,
    experienceBody: content.experience.body,
    finalHeading: content.finalCTA.heading,
    finalBody: content.finalCTA.body,
  });
  const [heroMediaId, setHeroMediaId] = useState(content.hero.media.id);
  const [facilityMediaId, setFacilityMediaId] = useState(content.facility.media.id);
  const update = <K extends keyof typeof copy>(key: K, value: (typeof copy)[K]) => setCopy((current) => ({ ...current, [key]: value }));
  const document = (): HomePageContent => ({
    ...content,
    hero: { ...content.hero, meta: (() => { const [first, second] = copy.heroMeta.split("·").map((item) => item.trim()); return [first || content.hero.meta[0], second || content.hero.meta[1]] as [string, string]; })(), kicker: copy.heroKicker, heading: copy.heroHeading, primaryCTA: { ...content.hero.primaryCTA, label: copy.primaryLabel }, secondaryCTA: { ...content.hero.secondaryCTA, label: copy.secondaryLabel }, media: media.find((asset) => asset.id === heroMediaId) ?? content.hero.media },
    process: { ...content.process, heading: copy.processHeading, body: copy.processBody },
    capabilityIntro: { ...content.capabilityIntro, heading: copy.capabilityHeading, body: copy.capabilityBody },
    requirementSourcing: { ...content.requirementSourcing, heading: copy.sourcingHeading, body: copy.sourcingBody, resultLabel: copy.resultLabel },
    sourcing: { ...content.sourcing, heading: copy.coalHeading, body: copy.coalBody },
    industries: { ...content.industries, body: copy.industryBody },
    coverage: { ...content.coverage, heading: copy.coverageHeading, body: copy.coverageBody },
    facility: { ...content.facility, heading: copy.facilityHeading, body: copy.facilityBody, media: media.find((asset) => asset.id === facilityMediaId) ?? content.facility.media },
    quality: { ...content.quality, heading: copy.qualityHeading, body: copy.qualityBody },
    experience: { ...content.experience, heading: copy.experienceHeading, body: copy.experienceBody },
    finalCTA: { ...content.finalCTA, heading: copy.finalHeading, body: copy.finalBody },
  });
  const editor = usePersistentEditor(() => savePageDraftAction("home", document()), () => publishPageAction("home"));
  const trackedUpdate = (key: keyof typeof copy, value: string) => { update(key, value); editor.markDirty(); };

  return <>
    <PageHeader eyebrow="WEBSITE CONTENT / HOME" title="Home page" description="Fixed sections protect the approved page composition. Edit copy and photography inside those sections." />
    <div className="admin-editor-layout">
      <div>
        <FormSection eyebrow="01 / HERO" title="The first impression" description="The headline is intentionally short so it retains its editorial scale on every screen.">
          <div className="admin-fields admin-fields--two"><Field label="Eyebrow" required><TextInput value={copy.heroMeta} onChange={(event) => trackedUpdate("heroMeta", event.target.value)} /></Field><Field label="Kicker" required><TextInput value={copy.heroKicker} onChange={(event) => trackedUpdate("heroKicker", event.target.value)} /></Field></div>
          <EditorialRichEditor label="Headline" value={copy.heroHeading} onChange={(lines) => { update("heroHeading", lines); editor.markDirty(); }} required max={80} theme="dark" />
          <div className="admin-fields admin-fields--two"><Field label="Primary action label" required><TextInput value={copy.primaryLabel} onChange={(event) => trackedUpdate("primaryLabel", event.target.value)} /></Field><Field label="Secondary action label" required><TextInput value={copy.secondaryLabel} onChange={(event) => trackedUpdate("secondaryLabel", event.target.value)} /></Field></div>
          <MediaPicker media={media} selectedId={heroMediaId} onSelect={(asset) => { setHeroMediaId(asset.id); editor.markDirty(); }} />
        </FormSection>

        <FormSection eyebrow="02 / HOW IT WORKS" title="The buyer journey" description="The five stages are fixed so every visitor can understand the operating sequence at a glance.">
          <EditorialRichEditor label="Heading" value={copy.processHeading} onChange={(lines) => { update("processHeading", lines); editor.markDirty(); }} required max={100} theme="dark" />
          <ContentArea label="Supporting copy" value={copy.processBody} onChange={(value) => trackedUpdate("processBody", value)} required max={240} />
          <div className="admin-static-list">{content.process.steps.map((step, index) => <div key={step.id}><b>{String(index + 1).padStart(2, "0")}</b><span><strong>{step.title}</strong><small>{step.description}</small></span></div>)}</div>
        </FormSection>

        <FormSection eyebrow="03 / CAPABILITY INTRODUCTION" title="Supply context" description="Introduces the scale and requirement-led nature of the business without presenting a fixed catalogue.">
          <EditorialRichEditor label="Heading" value={copy.capabilityHeading} onChange={(lines) => { update("capabilityHeading", lines); editor.markDirty(); }} required max={120} /><ContentArea label="Body copy" value={copy.capabilityBody} onChange={(value) => trackedUpdate("capabilityBody", value)} required max={300} />
        </FormSection>

        <FormSection eyebrow="04 / REQUIREMENT-BASED SOURCING" title="Customer requirement" description="The Grade, Size, Quantity and Destination visual remains design-controlled.">
          <div className="admin-fields admin-fields--two"><Field label="Section heading" required><TextInput value={copy.sourcingHeading} onChange={(event) => trackedUpdate("sourcingHeading", event.target.value)} /></Field><Field label="Result label"><TextInput value={copy.resultLabel} onChange={(event) => trackedUpdate("resultLabel", event.target.value)} /></Field></div><ContentArea label="Body copy" value={copy.sourcingBody} onChange={(value) => trackedUpdate("sourcingBody", value)} required max={300} />
        </FormSection>

        <FormSection eyebrow="05 / COAL & INDUSTRIES" title="Featured areas" description="Featured product and industry selection is managed in their dedicated areas.">
          <div className="admin-fields admin-fields--two"><ContentArea label="Coal section heading" value={copy.coalHeading} onChange={(value) => trackedUpdate("coalHeading", value)} required max={100} /><ContentArea label="Coal section body" value={copy.coalBody} onChange={(value) => trackedUpdate("coalBody", value)} required max={260} /></div><ContentArea label="Industries introduction" value={copy.industryBody} onChange={(value) => trackedUpdate("industryBody", value)} required max={240} />
        </FormSection>

        <FormSection eyebrow="06 / COVERAGE" title="Geographic experience" description="Coverage regions are edited separately; this section contains only the framing copy.">
          <div className="admin-fields admin-fields--two"><ContentArea label="Heading" value={copy.coverageHeading} onChange={(value) => trackedUpdate("coverageHeading", value)} required max={120} /><ContentArea label="Body copy" value={copy.coverageBody} onChange={(value) => trackedUpdate("coverageBody", value)} required max={300} /></div>
        </FormSection>

        <FormSection eyebrow="07 / WANI FACILITY" title="Physical operation" description="Do not add unsupported capacity, equipment or dispatch claims.">
          <div className="admin-fields admin-fields--two"><ContentArea label="Heading" value={copy.facilityHeading} onChange={(value) => trackedUpdate("facilityHeading", value)} required max={120} /><ContentArea label="Body copy" value={copy.facilityBody} onChange={(value) => trackedUpdate("facilityBody", value)} required max={300} /></div><MediaPicker media={media} selectedId={facilityMediaId} onSelect={(asset) => { setFacilityMediaId(asset.id); editor.markDirty(); }} />
        </FormSection>

        <FormSection eyebrow="08 / QUALITY" title="Quality information" description="Parameter labels are managed in Quality under operations content. Availability language should remain qualified.">
          <div className="admin-fields admin-fields--two"><ContentArea label="Heading" value={copy.qualityHeading} onChange={(value) => trackedUpdate("qualityHeading", value)} required max={120} /><ContentArea label="Body copy" value={copy.qualityBody} onChange={(value) => trackedUpdate("qualityBody", value)} required max={280} /></div>
        </FormSection>

        <FormSection eyebrow="09 / EXPERIENCE" title="New venture, established experience" description="This distinction must remain factual: Star Energies is a new business backed by industry experience.">
          <div className="admin-fields admin-fields--two"><EditorialRichEditor label="Heading" value={copy.experienceHeading} onChange={(lines) => { update("experienceHeading", lines); editor.markDirty(); }} required max={120} theme="dark" /><ContentArea label="Body copy" value={copy.experienceBody} onChange={(value) => trackedUpdate("experienceBody", value)} required max={300} /></div>
        </FormSection>

        <FormSection eyebrow="10 / FINAL CALL TO ACTION" title="Enquiry moment" description="Keeps direct contact available as an alternative to the quote form.">
          <div className="admin-fields admin-fields--two"><EditorialRichEditor label="Heading" value={copy.finalHeading} onChange={(lines) => { update("finalHeading", lines); editor.markDirty(); }} required max={100} /><ContentArea label="Body copy" value={copy.finalBody} onChange={(value) => trackedUpdate("finalBody", value)} required max={260} /></div>
        </FormSection>
      </div>
      <aside className="admin-editor-aside"><p>FIXED PAGE STRUCTURE</p><b>Sections cannot be added, removed or reordered here.</b><span>This protects the approved home page design while leaving genuine business content editable.</span><AdminButton type="button" variant="line" onClick={() => window.open("/", "_blank", "noopener,noreferrer")}>View home page</AdminButton></aside>
    </div>
    <EditorFooter editor={editor} route="/" />
  </>;
}

export function AboutContentEditor({ content }: { content: AboutPageContent }) {
  const [copy, setCopy] = useState({
    opening: content.opening.heading,
    prefix: content.opening.experiencePrefix,
    experienceStatement: `${content.opening.experienceValue} ${content.opening.experienceLabel}`,
    lead: content.distinction.lead,
    distinction: content.distinction.body,
    relationship: content.approach.items[0]?.description ?? "",
    ambition: content.ambition.body,
    leadership: content.people.entries[0]?.description ?? "",
    experience: content.people.entries[1]?.description ?? "",
    cta: content.ambition.cta.label,
  });
  const update = <K extends keyof typeof copy>(key: K, value: (typeof copy)[K]) => setCopy((current) => ({ ...current, [key]: value }));
  const document = (): AboutPageContent => {
    const experienceParts = copy.experienceStatement.trim().split(/\s+/);
    return {
      ...content,
      opening: {
        ...content.opening,
        heading: copy.opening,
        experiencePrefix: copy.prefix,
        experienceValue: experienceParts.shift() || content.opening.experienceValue,
        experienceLabel: experienceParts.join(" ") || content.opening.experienceLabel,
      },
      distinction: { ...content.distinction, lead: copy.lead, body: copy.distinction },
      approach: { ...content.approach, items: content.approach.items.map((item, index) => index === 0 ? { ...item, description: copy.relationship } : item) },
      people: { ...content.people, entries: content.people.entries.map((entry, index) => index === 0 ? { ...entry, description: copy.leadership } : index === 1 ? { ...entry, description: copy.experience } : entry) },
      ambition: { ...content.ambition, body: copy.ambition, cta: { ...content.ambition.cta, label: copy.cta } },
    };
  };
  const editor = usePersistentEditor(() => savePageDraftAction("about", document()), () => publishPageAction("about"));
  const trackedUpdate = (key: keyof typeof copy, value: string) => { update(key, value); editor.markDirty(); };
  return <>
    <PageHeader eyebrow="WEBSITE CONTENT / ABOUT" title="About" description="A new-generation business with a clear, factual distinction between the brand and the experience behind it." />
    <div className="admin-editor-layout"><div>
      <FormSection eyebrow="01 / OPENING" title="Company positioning">
        <EditorialRichEditor label="Editorial heading" value={copy.opening} onChange={(lines) => { update("opening", lines); editor.markDirty(); }} required max={100} theme="dark" />
        <div className="admin-fields admin-fields--two"><Field label="Experience prefix"><TextInput value={copy.prefix} onChange={(event) => trackedUpdate("prefix", event.target.value)} /></Field><Field label="Experience statement"><TextInput value={copy.experienceStatement} onChange={(event) => trackedUpdate("experienceStatement", event.target.value)} /></Field></div>
      </FormSection>
      <FormSection eyebrow="02 / DISTINCTION" title="A new business, built on experience" description="Avoid dates, milestones or claims that imply Star Energies itself is 25 years old."><ContentArea label="Lead statement" value={copy.lead} onChange={(value) => trackedUpdate("lead", value)} required max={220} /><ContentArea label="Supporting copy" value={copy.distinction} onChange={(value) => trackedUpdate("distinction", value)} required max={360} /></FormSection>
      <FormSection eyebrow="03 / PEOPLE & APPROACH" title="Direct business context" description="Use minimal personal naming. These fields are concise context, not long biographies."><div className="admin-fields admin-fields--two"><ContentArea label="Leadership copy" value={copy.leadership} onChange={(value) => trackedUpdate("leadership", value)} required max={280} /><ContentArea label="Experience copy" value={copy.experience} onChange={(value) => trackedUpdate("experience", value)} required max={280} /></div><ContentArea label="Customer relationship approach" value={copy.relationship} onChange={(value) => trackedUpdate("relationship", value)} required max={260} /></FormSection>
      <FormSection eyebrow="04 / AMBITION" title="Long-term direction"><ContentArea label="National ambition copy" value={copy.ambition} onChange={(value) => trackedUpdate("ambition", value)} required max={320} /><Field label="Call to action label"><TextInput value={copy.cta} onChange={(event) => trackedUpdate("cta", event.target.value)} /></Field></FormSection>
    </div><aside className="admin-editor-aside"><p>CLAIM SAFETY</p><b>Keep the distinction clear.</b><span>Star Energies is new. Approximately 25 years refers to the coal-industry experience behind the venture.</span></aside></div>
    <EditorFooter editor={editor} route="/about" />
  </>;
}

export function ContactContentEditor({ content }: { content: ContactPageContent }) {
  const [copy, setCopy] = useState({
    opening: content.opening.heading,
    openingBody: content.opening.body,
    formHeading: content.formIntro.heading,
    helper: content.formIntro.helper,
    submitLabel: content.formIntro.quoteForm.submitLabel,
    messageLabel: content.formIntro.quoteForm.messageLabel,
    reassurance: content.reassurance.body,
  });
  const update = <K extends keyof typeof copy>(key: K, value: (typeof copy)[K]) => setCopy((current) => ({ ...current, [key]: value }));
  const document = (): ContactPageContent => ({ ...content,
    opening: { ...content.opening, heading: copy.opening, body: copy.openingBody },
    formIntro: { ...content.formIntro, heading: copy.formHeading, helper: copy.helper, quoteForm: { ...content.formIntro.quoteForm, submitLabel: copy.submitLabel, messageLabel: copy.messageLabel } },
    reassurance: { ...content.reassurance, body: copy.reassurance },
  });
  const editor = usePersistentEditor(() => savePageDraftAction("contact", document()), () => publishPageAction("contact"));
  const trackedUpdate = (key: keyof typeof copy, value: string) => { update(key, value); editor.markDirty(); };
  return <>
    <PageHeader eyebrow="WEBSITE CONTENT / CONTACT" title="Contact" description="The public page keeps direct phone, WhatsApp and email visible beside the structured quote form." />
    <div className="admin-editor-layout"><div>
      <FormSection eyebrow="01 / OPENING" title="Direct conversation">
        <EditorialRichEditor label="Heading" value={copy.opening} onChange={(lines) => { update("opening", lines); editor.markDirty(); }} required max={100} />
        <ContentArea label="Supporting copy" value={copy.openingBody} onChange={(value) => trackedUpdate("openingBody", value)} required max={280} />
      </FormSection>
      <FormSection eyebrow="02 / QUOTE FORM" title="Requirement helper" description="The form fields themselves remain structured and design-controlled for later enquiry handling.">
        <EditorialRichEditor label="Form heading" value={copy.formHeading} onChange={(lines) => { update("formHeading", lines); editor.markDirty(); }} required max={100} />
        <ContentArea label="Helper text" value={copy.helper} onChange={(value) => trackedUpdate("helper", value)} required max={250} /><div className="admin-fields admin-fields--two"><Field label="Form submit label"><TextInput value={copy.submitLabel} onChange={(event) => trackedUpdate("submitLabel", event.target.value)} /></Field><Field label="Message label"><TextInput value={copy.messageLabel} onChange={(event) => trackedUpdate("messageLabel", event.target.value)} /></Field></div>
      </FormSection>
      <FormSection eyebrow="03 / REASSURANCE" title="If a buyer does not know every detail"><ContentArea label="Reassurance copy" value={copy.reassurance} onChange={(value) => trackedUpdate("reassurance", value)} required max={260} /></FormSection>
    </div><aside className="admin-editor-aside"><p>PUBLIC CONTACT DETAILS</p><b>Phone, WhatsApp and email are managed in Settings.</b><span>Keeping the details in one place prevents conflicting contact information across the site.</span></aside></div>
    <EditorFooter editor={editor} route="/contact" />
  </>;
}

export function OperationsContentEditor({ content, media }: { content: OperationsPageContent; media: MediaAsset[] }) {
  const [copy, setCopy] = useState({
    opening: content.opening.heading,
    openingBody: content.opening.body,
    sequence: content.sequence.heading,
    coverage: content.coverage.heading,
    coverageBody: content.coverage.body,
    transportLead: content.transport.lead,
    transportBody: content.transport.body,
    finalHeading: content.finalCTA.heading,
    finalCta: content.finalCTA.cta.label,
  });
  const [imageId, setImageId] = useState(content.opening.media.id);
  const update = <K extends keyof typeof copy>(key: K, value: (typeof copy)[K]) => setCopy((current) => ({ ...current, [key]: value }));
  const document = (): OperationsPageContent => ({ ...content,
    opening: { ...content.opening, heading: copy.opening, body: copy.openingBody, media: media.find((asset) => asset.id === imageId) ?? content.opening.media },
    sequence: { ...content.sequence, heading: copy.sequence },
    coverage: { ...content.coverage, heading: copy.coverage, body: copy.coverageBody },
    transport: { ...content.transport, lead: copy.transportLead, body: copy.transportBody },
    finalCTA: { ...content.finalCTA, heading: copy.finalHeading, cta: { ...content.finalCTA.cta, label: copy.finalCta } },
  });
  const editor = usePersistentEditor(() => savePageDraftAction("operations", document()), () => publishPageAction("operations"));
  const trackedUpdate = (key: keyof typeof copy, value: string) => { update(key, value); editor.markDirty(); };
  return <>
    <PageHeader eyebrow="OPERATIONS" title="Operations content" description="Manage the factual language around stocking, sourcing coordination and geographic experience." />
    <div className="admin-editor-layout"><div>
      <FormSection eyebrow="01 / WANI STOCKING FACILITY" title="Physical presence" description="Use this section for the Wani facility, without adding unknown capacity or equipment details.">
        <EditorialRichEditor label="Heading" value={copy.opening} onChange={(lines) => { update("opening", lines); editor.markDirty(); }} required max={110} theme="dark" />
        <ContentArea label="Body copy" value={copy.openingBody} onChange={(value) => trackedUpdate("openingBody", value)} required max={320} />
        <MediaPicker media={media} selectedId={imageId} onSelect={(asset) => { setImageId(asset.id); editor.markDirty(); }} />
      </FormSection>
      <FormSection eyebrow="02 / SUPPLY COORDINATION" title="Operational sequence"><ContentArea label="Section heading" value={copy.sequence} onChange={(value) => trackedUpdate("sequence", value)} required max={100} /><div className="admin-static-list">{content.sequence.items.map((item) => <div key={item.id}><b>{String(item.displayOrder).padStart(2, "0")}</b><span><strong>{item.title}</strong><small>{item.description}</small></span></div>)}</div></FormSection>
      <FormSection eyebrow="03 / GEOGRAPHIC EXPERIENCE" title="Coverage framing"><div className="admin-fields admin-fields--two">
        <EditorialRichEditor label="Heading" value={copy.coverage} onChange={(lines) => { update("coverage", lines); editor.markDirty(); }} required max={110} />
        <ContentArea label="Body copy" value={copy.coverageBody} onChange={(value) => trackedUpdate("coverageBody", value)} required max={300} />
      </div></FormSection>
      <FormSection eyebrow="04 / TRANSPORT" title="Third-party coordination" description="This safety statement is intentionally direct."><ContentArea label="Lead statement" value={copy.transportLead} onChange={(value) => trackedUpdate("transportLead", value)} required max={220} /><ContentArea label="Supporting copy" value={copy.transportBody} onChange={(value) => trackedUpdate("transportBody", value)} required max={300} /></FormSection>
      <FormSection eyebrow="05 / FINAL CALL TO ACTION" title="Next conversation"><div className="admin-fields admin-fields--two">
        <EditorialRichEditor label="Heading" value={copy.finalHeading} onChange={(lines) => { update("finalHeading", lines); editor.markDirty(); }} required max={100} theme="dark" />
        <Field label="Action label"><TextInput value={copy.finalCta} onChange={(event) => trackedUpdate("finalCta", event.target.value)} /></Field>
      </div></FormSection>
    </div><aside className="admin-editor-aside"><p>IMPORTANT</p><b>Star Energies does not operate its own transport fleet.</b><span>Transportation may be coordinated through third-party transport providers where required.</span></aside></div>
    <EditorFooter editor={editor} route="/operations" />
  </>;
}
