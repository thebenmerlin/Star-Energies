"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminEnquiry, EnquiryListResult, EnquiryStatus } from "@/types/enquiry";
import type { CoverageRegion, MediaAsset, SeoMetadata, SiteSettings } from "@/types/content";
import { saveCoverageRegionAction, saveSeoAction, saveSiteSettingsAction } from "@/app/admin/actions";
import { addEnquiryNoteAction, updateEnquiryStatusAction } from "@/app/admin/enquiries/actions";
import { AdminButton, AdminLink, ConfirmDialog, EmptyState, Field, FormSection, PageHeader, SaveBar, SelectInput, StatusBadge, TextArea, TextInput, Toggle } from "./admin-primitives";

const mediaCategories = ["All categories", "Hero", "Facility", "Coal", "Loading", "Operations", "Industries", "Team", "General"] as const;
const categoryMap: Record<string, MediaAsset["category"] | undefined> = { Hero: "hero", Facility: "facility", Coal: "coal", Loading: "operations", Operations: "operations", Industries: "industrial", Team: "team", General: "industrial" };
const enquiryStatuses: EnquiryStatus[] = ["new", "contacted", "quoted", "closed", "archived"];
const dateFormat = (date: string, options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" }) => new Intl.DateTimeFormat("en-IN", options).format(new Date(date));

export function CoverageManager({ regions }: { regions: CoverageRegion[] }) {
  const [rows, setRows] = useState(regions);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", state: "", cityOrMarket: "", label: "" });
  const addRegion = async () => {
    if (!draft.name.trim() || !draft.state.trim()) return;
    const region: CoverageRegion = { id: crypto.randomUUID(), name: draft.name, label: draft.label || draft.name, state: draft.state, cityOrMarket: draft.cityOrMarket || undefined, experienceType: "industry-experience", active: true, displayOrder: rows.length + 1, mapLabel: draft.label || draft.name };
    const result = await saveCoverageRegionAction(region);
    if (result.ok) { setRows((current) => [...current, region]); setDraft({ name: "", state: "", cityOrMarket: "", label: "" }); setAdding(false); }
  };
  const setOrder = async (id: string, adjustment: number) => {
    const currentIndex = rows.findIndex((region) => region.id === id);
    const targetIndex = currentIndex + adjustment;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= rows.length) return;
    const next = [...rows];
    [next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]];
    const ordered = next.map((region, index) => ({ ...region, displayOrder: index + 1 }));
    setRows(ordered);
    await Promise.all(ordered.map((region) => saveCoverageRegionAction(region)));
  };
  const setActive = async (region: CoverageRegion, active: boolean) => {
    const next = { ...region, active };
    setRows((current) => current.map((item) => item.id === region.id ? next : item));
    await saveCoverageRegionAction(next);
  };
  return <>
    <PageHeader eyebrow="OPERATIONS / COVERAGE" title="Geographic experience" description="These are markets with current industry experience—not offices, branches or guaranteed service locations." actions={<AdminButton type="button" variant="dark" onClick={() => setAdding(true)}>Add experience area</AdminButton>} />
    <section className="admin-coverage-intro"><b>HOW THIS IS USED</b><span>Public wording distinguishes existing experience from a wider pan-India supply ambition, which remains subject to sourcing, availability, logistics and commercial feasibility.</span></section>
    {adding && <FormSection eyebrow="NEW EXPERIENCE AREA" title="Add coverage entry" description="Use a region or state and optional market. Do not represent this as a physical location."><div className="admin-fields admin-fields--four"><Field label="Region / state" required><TextInput value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></Field><Field label="State" required><TextInput value={draft.state} onChange={(event) => setDraft((current) => ({ ...current, state: event.target.value }))} /></Field><Field label="City / market" hint="Optional"><TextInput value={draft.cityOrMarket} onChange={(event) => setDraft((current) => ({ ...current, cityOrMarket: event.target.value }))} /></Field><Field label="Display label"><TextInput value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} /></Field></div><div className="admin-inline-actions"><AdminButton type="button" variant="line" onClick={() => setAdding(false)}>Cancel</AdminButton><AdminButton type="button" variant="dark" onClick={addRegion} disabled={!draft.name.trim() || !draft.state.trim()}>Add area</AdminButton></div></FormSection>}
    <section className="admin-coverage-list">{rows.sort((first, second) => first.displayOrder - second.displayOrder).map((region) => <article key={region.id}><span className="admin-coverage-list__order">{String(region.displayOrder).padStart(2, "0")}</span><div><b>{region.label}</b><small>{region.state}{region.cityOrMarket ? ` · ${region.cityOrMarket}` : ""}</small></div><span className="admin-coverage-list__type">Existing experience</span><Toggle checked={region.active} onChange={(active) => setActive(region, active)} label={region.active ? "Active" : "Inactive"} /><div className="admin-stepper"><button type="button" onClick={() => setOrder(region.id, -1)} aria-label={`Move ${region.label} up`}>↑</button><button type="button" onClick={() => setOrder(region.id, 1)} aria-label={`Move ${region.label} down`}>↓</button></div></article>)}</section>
  </>;
}

export function MediaLibrary({ media }: { media: MediaAsset[] }) {
  const [assets, setAssets] = useState(media);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [editing, setEditing] = useState<MediaAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => assets.filter((asset) => {
    const matchesQuery = `${asset.title} ${asset.altText} ${asset.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All categories" || asset.category === categoryMap[category];
    return matchesQuery && matchesCategory;
  }), [assets, category, query]);
  const uploadMedia = async (file?: File) => {
    if (!file) return;
    setMessage(null);
    const formData = new FormData();
    formData.set("file", file);
    const selectedCategory = categoryMap[category];
    if (selectedCategory) formData.set("category", selectedCategory);
    const endpoint = replacingId ? `/api/admin/media/${replacingId}` : "/api/admin/media";
    const response = await fetch(endpoint, { method: replacingId ? "PUT" : "POST", body: formData });
    const data = await response.json() as { asset?: MediaAsset; message?: string };
    if (!response.ok || !data.asset) { setMessage(data.message ?? "The image could not be uploaded."); return; }
    const asset = data.asset;
    setAssets((current) => replacingId ? current.map((item) => item.id === asset.id ? asset : item) : [asset, ...current]);
    setEditing(asset);
    setReplacingId(null);
    if (inputRef.current) inputRef.current.value = "";
  };
  const saveMetadata = async (updated: MediaAsset) => {
    const response = await fetch(`/api/admin/media/${updated.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: updated.title, altText: updated.altText, label: updated.label, caption: updated.caption, category: updated.category, placeholder: updated.placeholder }) });
    const data = await response.json() as { asset?: MediaAsset; message?: string };
    if (!response.ok || !data.asset) { setMessage(data.message ?? "The media details could not be saved."); return; }
    setAssets((current) => current.map((asset) => asset.id === data.asset!.id ? data.asset! : asset));
    setEditing(null);
  };
  const deleteMedia = async () => {
    if (!deleteTarget) return;
    const response = await fetch(`/api/admin/media/${deleteTarget.id}`, { method: "DELETE" });
    const data = await response.json() as { message?: string };
    if (!response.ok) { setMessage(data.message ?? "This media item could not be deleted."); setDeleteTarget(null); return; }
    setAssets((current) => current.filter((asset) => asset.id !== deleteTarget.id));
    setDeleteTarget(null);
  };
  return <>
    <PageHeader eyebrow="MEDIA" title="Photography library" description="Development placeholders are clearly labelled so they can be replaced before production launch." actions={<AdminButton type="button" variant="dark" onClick={() => inputRef.current?.click()}>Upload image</AdminButton>} />
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(event) => uploadMedia(event.target.files?.[0])} />
    {message && <div className="admin-placeholder-alert" role="status"><b>MEDIA ACTION</b><span>{message}</span></div>}
    <section className="admin-media-toolbar"><TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search photography" aria-label="Search photography" /><SelectInput value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter media category">{mediaCategories.map((item) => <option value={item} key={item}>{item}</option>)}</SelectInput><div className="admin-view-switch"><button type="button" className={layout === "grid" ? "is-active" : ""} onClick={() => setLayout("grid")}>Grid</button><button type="button" className={layout === "list" ? "is-active" : ""} onClick={() => setLayout("list")}>List</button></div></section>
    {filtered.length === 0 ? <EmptyState title="No media found" body="Try a different search or category, or add an image to the local library." action={<AdminButton type="button" variant="line" onClick={() => inputRef.current?.click()}>Upload image</AdminButton>} /> : <div className={`admin-media-library admin-media-library--${layout}`}>{filtered.map((asset) => <article key={asset.id}><div className="admin-media-library__image" style={asset.url ? { backgroundImage: `url("${asset.url}")` } : undefined}>{!asset.url && <span>Logo asset pending</span>}<div><StatusBadge status={asset.placeholder ? "draft" : "published"} />{asset.placeholder && <small>Placeholder</small>}</div></div><div className="admin-media-library__details"><span>{asset.category}</span><h3>{asset.title}</h3><p>{asset.altText}</p><div><button type="button" onClick={() => setEditing(asset)}>Edit details</button><button type="button" onClick={() => setDeleteTarget(asset)}>Delete</button></div></div></article>)}</div>}
    {editing && <MediaMetadataEditor asset={editing} onCancel={() => setEditing(null)} onSave={saveMetadata} onReplace={() => { setReplacingId(editing.id); inputRef.current?.click(); }} />}
    <ConfirmDialog open={Boolean(deleteTarget)} title={`Delete ${deleteTarget?.title ?? "this image"}?`} description="Images in use by website content cannot be deleted until they are replaced. Unused uploaded media is removed from storage and the CMS." onCancel={() => setDeleteTarget(null)} onConfirm={deleteMedia} />
  </>;
}

function MediaMetadataEditor({ asset, onCancel, onSave, onReplace }: { asset: MediaAsset; onCancel: () => void; onSave: (asset: MediaAsset) => void | Promise<void>; onReplace: () => void }) {
  const [draft, setDraft] = useState(asset);
  return <div className="admin-dialog-backdrop"><section className="admin-media-editor" role="dialog" aria-modal="true" aria-labelledby="media-editor-title"><header><div><p>MEDIA DETAILS</p><h2 id="media-editor-title">{asset.title}</h2></div><AdminButton type="button" variant="quiet" onClick={onCancel}>Close</AdminButton></header><div className="admin-media-editor__body"><div className="admin-media-editor__preview" style={draft.url ? { backgroundImage: `url("${draft.url}")` } : undefined} /><div><Field label="Title" required><TextInput value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} /></Field><Field label="Alt text" required hint="Describe what is visible, not what the website wants to say."><TextArea value={draft.altText} onChange={(event) => setDraft((current) => ({ ...current, altText: event.target.value }))} /></Field><Field label="Caption" hint="Optional"><TextInput value={draft.caption ?? ""} onChange={(event) => setDraft((current) => ({ ...current, caption: event.target.value || undefined }))} /></Field><Field label="Category"><SelectInput value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value as MediaAsset["category"] }))}><option value="hero">Hero</option><option value="facility">Facility</option><option value="coal">Coal</option><option value="operations">Loading / Operations</option><option value="industrial">Industries / General</option><option value="team">Team</option></SelectInput></Field><Toggle checked={draft.placeholder} onChange={(placeholder) => setDraft((current) => ({ ...current, placeholder }))} label="Development placeholder" detail="Keep enabled until final photography is supplied." /></div></div><footer><AdminButton type="button" variant="line" onClick={onReplace}>Replace image</AdminButton><div><AdminButton type="button" variant="quiet" onClick={onCancel}>Cancel</AdminButton><AdminButton type="button" variant="dark" onClick={() => onSave(draft)}>Save details</AdminButton></div></footer></section></div>;
}

function enquiryHref({ query, status, sort, page }: { query?: string; status?: string; sort?: string; page?: number }) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status && status !== "all") params.set("status", status);
  if (sort === "oldest") params.set("sort", "oldest");
  if (page && page > 1) params.set("page", String(page));
  const value = params.toString();
  return `/admin/enquiries${value ? `?${value}` : ""}`;
}

export function EnquiriesManager({ result, initialQuery = "", initialStatus = "all", initialSort = "newest" }: { result: EnquiryListResult; initialQuery?: string; initialStatus?: string; initialSort?: "newest" | "oldest" }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);
  const [isNavigating, startTransition] = useTransition();
  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => router.push(enquiryHref({ query: query.trim(), status, sort: initialSort })));
  };
  const toggleSort = () => startTransition(() => router.push(enquiryHref({ query: initialQuery, status: initialStatus, sort: initialSort === "newest" ? "oldest" : "newest" })));
  const rows = result.enquiries;
  return <>
    <PageHeader eyebrow="LEADS / WEBSITE QUOTE FORM" title="Enquiries" description="Private quote requests submitted through the public website. Update the conversation stage as direct contact progresses." />
    <section className="admin-table-panel"><form className="admin-list-toolbar" onSubmit={applyFilters}><TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company, contact, phone or destination" aria-label="Search enquiries" /><SelectInput value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter enquiry status"><option value="all">All statuses</option>{enquiryStatuses.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</SelectInput><AdminButton type="submit" variant="line" disabled={isNavigating}>Apply</AdminButton></form><div className="admin-table-tools"><span>{result.total} {result.total === 1 ? "enquiry" : "enquiries"}</span><button type="button" onClick={toggleSort}>Date: {initialSort === "newest" ? "Newest first" : "Oldest first"}</button></div>{rows.length === 0 ? <EmptyState title="No matching enquiries" body={result.total === 0 && !initialQuery && initialStatus === "all" ? "New quote requests submitted through the public website will appear here." : "Change the filters or search for another company, person, phone number or delivery city."} /> : <><div className="admin-table-wrap"><table className="admin-data-table"><thead><tr><th>Company</th><th>Contact</th><th>Requirement</th><th>Quantity</th><th>Destination</th><th>Date</th><th>Status</th><th /></tr></thead><tbody>{rows.map((enquiry) => <tr key={enquiry.id}><td><b>{enquiry.companyName}</b><small>{enquiry.contactPerson}</small></td><td><span className="admin-table-detail">{enquiry.phone}<br />{enquiry.email ?? "No email provided"}</span></td><td>{enquiry.coalRequirement}</td><td>{enquiry.quantity} {enquiry.unit}</td><td>{enquiry.deliveryCity}, {enquiry.state}</td><td>{dateFormat(enquiry.submittedAt)}</td><td><StatusBadge status={enquiry.status} /></td><td><Link className="admin-table-edit" href={`/admin/enquiries/${enquiry.id}`}>Open</Link></td></tr>)}</tbody></table></div>{result.totalPages > 1 && <nav className="admin-enquiry-pagination" aria-label="Enquiry pages"><span>Page {result.page} of {result.totalPages}</span><div>{result.page > 1 && <Link href={enquiryHref({ query: initialQuery, status: initialStatus, sort: initialSort, page: result.page - 1 })}>Previous</Link>}{result.page < result.totalPages && <Link href={enquiryHref({ query: initialQuery, status: initialStatus, sort: initialSort, page: result.page + 1 })}>Next</Link>}</div></nav>}</>}</section>
  </>;
}

export function EnquiryDetail({ initial }: { initial: AdminEnquiry }) {
  const [enquiry, setEnquiry] = useState(initial);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState("Saved in Neon");
  const [isPending, startTransition] = useTransition();
  const updateStatus = (status: EnquiryStatus) => {
    const previous = enquiry.status;
    setEnquiry((current) => ({ ...current, status }));
    setSaved("Saving status…");
    startTransition(async () => {
      const result = await updateEnquiryStatusAction({ enquiryId: enquiry.id, status });
      if (!result.ok) { setEnquiry((current) => ({ ...current, status: previous })); setSaved(result.message); return; }
      setEnquiry((current) => ({ ...current, status: status, updatedAt: result.data?.updatedAt ?? current.updatedAt }));
      setSaved(result.message);
    });
  };
  const addNote = () => {
    if (!note.trim()) return;
    const text = note.trim();
    setSaved("Saving note…");
    startTransition(async () => {
      const result = await addEnquiryNoteAction({ enquiryId: enquiry.id, note: text });
      if (!result.ok || !result.data) { setSaved(result.message); return; }
      setEnquiry((current) => ({ ...current, notes: [result.data!, ...current.notes] }));
      setNote("");
      setSaved(result.message);
    });
  };
  const whatsappLink = enquiry.whatsapp ? `https://wa.me/${enquiry.whatsapp.replace(/\D/g, "")}` : undefined;
  return <>
    <PageHeader eyebrow={`ENQUIRY / ${enquiry.id.toUpperCase()}`} title={enquiry.companyName} description={`Submitted ${dateFormat(enquiry.submittedAt, { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" })}`} actions={<Link href="/admin/enquiries" className="admin-button admin-button--line">Back to enquiries</Link>} />
    <div className="admin-enquiry-layout"><div><section className="admin-enquiry-hero"><div><p>CURRENT STATUS</p><SelectInput value={enquiry.status} onChange={(event) => updateStatus(event.target.value as EnquiryStatus)} aria-label="Change enquiry status" disabled={isPending}>{enquiryStatuses.map((status) => <option value={status} key={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</SelectInput></div><StatusBadge status={enquiry.status} /><span role="status">{saved}</span></section><DetailSection title="Contact" values={[["Contact person", enquiry.contactPerson], ["Company", enquiry.companyName], ["Phone", <a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a>], ["Email", enquiry.email ? <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a> : "Not provided"], ["WhatsApp", whatsappLink ? <a href={whatsappLink} target="_blank" rel="noreferrer">{enquiry.whatsapp}</a> : "Not provided"]]} /><DetailSection title="Requirement" values={[["Coal requirement", enquiry.coalRequirement], ["Grade / GCV", enquiry.gradeGcv ?? "Not provided"], ["Size", enquiry.size ?? "Not provided"], ["Quantity", `${enquiry.quantity} ${enquiry.unit}`], ["Desired timeline", enquiry.timeline ?? "Not provided"]]} /><DetailSection title="Delivery" values={[["City", enquiry.deliveryCity], ["State", enquiry.state], ["Pincode", enquiry.pincode ?? "Not provided"]]} />{enquiry.message && <DetailSection title="Additional message" values={[["Message", enquiry.message]]} />}<DetailSection title="System" values={[["Submitted", dateFormat(enquiry.submittedAt, { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" })], ["Last updated", dateFormat(enquiry.updatedAt, { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" })], ["Source", "Website quote form"]]} /></div><aside className="admin-enquiry-notes"><p>INTERNAL NOTES</p><h3>Conversation record</h3><TextArea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add an internal note…" maxLength={2000} /><AdminButton type="button" variant="dark" onClick={addNote} disabled={!note.trim() || isPending}>Add note</AdminButton><div>{enquiry.notes.length === 0 ? <span className="admin-note-empty">No internal notes yet.</span> : enquiry.notes.map((item) => <article key={item.id}><time>{dateFormat(item.createdAt, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}</time><b>{item.author}</b><p>{item.text}</p></article>)}</div></aside></div>
  </>;
}

function DetailSection({ title, values }: { title: string; values: [string, React.ReactNode][] }) { return <section className="admin-detail-section"><h3>{title}</h3><dl>{values.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>; }

export function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const [settings, setSettings] = useState(initial); const [state, setState] = useState<"idle" | "dirty" | "saving" | "saved">("idle");
  const dirty = () => setState("dirty"); const save = async () => { setState("saving"); const result = await saveSiteSettingsAction(settings); setState(result.ok ? "saved" : "idle"); };
  const emailError = settings.contact.email && !/^\S+@\S+\.\S+$/.test(settings.contact.email) ? "Enter a valid email address." : undefined;
  return <>
    <PageHeader eyebrow="SYSTEM / SETTINGS" title="Site settings" description="A single canonical source for business identity, direct contact details and site-wide actions." />
    {settings.contact.isPlaceholder && <div className="admin-placeholder-alert"><b>PLACEHOLDER DETAILS IN USE</b><span>Replace the phone number, WhatsApp link and email before public launch. These values are currently shared across the public website.</span></div>}
    <div className="admin-editor-layout"><div><FormSection eyebrow="01 / BUSINESS IDENTITY" title="Business details"><div className="admin-fields admin-fields--two"><Field label="Business name" required><TextInput value={settings.businessName} onChange={(event) => { setSettings((current) => ({ ...current, businessName: event.target.value })); dirty(); }} /></Field><Field label="Public brand name" required><TextInput value={settings.brandName} onChange={(event) => { setSettings((current) => ({ ...current, brandName: event.target.value })); dirty(); }} /></Field><Field label="GSTIN" hint="Optional until confirmed"><TextInput value={settings.gstin ?? ""} onChange={(event) => { setSettings((current) => ({ ...current, gstin: event.target.value || undefined })); dirty(); }} /></Field><Field label="Business hours" hint="Optional"><TextInput value={settings.businessHours ?? ""} onChange={(event) => { setSettings((current) => ({ ...current, businessHours: event.target.value || undefined })); dirty(); }} /></Field></div></FormSection><FormSection eyebrow="02 / CONTACT" title="Direct contact details"><div className="admin-fields admin-fields--two"><Field label="Phone" required><TextInput value={settings.contact.phoneDisplay} onChange={(event) => { const phoneDisplay = event.target.value; setSettings((current) => ({ ...current, contact: { ...current.contact, phoneDisplay, phoneHref: `tel:${phoneDisplay.replace(/\s/g, "")}` } })); dirty(); }} /></Field><Field label="WhatsApp link" required hint="Use the full WhatsApp URL."><TextInput value={settings.contact.whatsappHref} onChange={(event) => { setSettings((current) => ({ ...current, contact: { ...current.contact, whatsappHref: event.target.value } })); dirty(); }} /></Field><Field label="Email" required error={emailError}><TextInput type="email" value={settings.contact.email} onChange={(event) => { const email = event.target.value; setSettings((current) => ({ ...current, contact: { ...current.contact, email, emailHref: `mailto:${email}` } })); dirty(); }} /></Field><Field label="Primary enquiry label" required><TextInput value={settings.primaryQuoteCTA.label} onChange={(event) => { setSettings((current) => ({ ...current, primaryQuoteCTA: { ...current.primaryQuoteCTA, label: event.target.value } })); dirty(); }} /></Field></div></FormSection><FormSection eyebrow="03 / LOCATION" title="Business address"><Field label="Registered / business address" required><TextInput value={settings.address.display} onChange={(event) => { setSettings((current) => ({ ...current, address: { ...current.address, display: event.target.value } })); dirty(); }} /></Field><div className="admin-fields admin-fields--four"><Field label="City"><TextInput value={settings.address.city} onChange={(event) => { setSettings((current) => ({ ...current, address: { ...current.address, city: event.target.value } })); dirty(); }} /></Field><Field label="District"><TextInput value={settings.address.district} onChange={(event) => { setSettings((current) => ({ ...current, address: { ...current.address, district: event.target.value } })); dirty(); }} /></Field><Field label="State"><TextInput value={settings.address.state} onChange={(event) => { setSettings((current) => ({ ...current, address: { ...current.address, state: event.target.value } })); dirty(); }} /></Field><Field label="Postal code"><TextInput value={settings.address.postalCode ?? ""} onChange={(event) => { setSettings((current) => ({ ...current, address: { ...current.address, postalCode: event.target.value || undefined } })); dirty(); }} /></Field></div></FormSection><FormSection eyebrow="04 / SITE BEHAVIOUR" title="Default enquiry action"><div className="admin-fields admin-fields--two"><Field label="Primary enquiry label"><TextInput value={settings.primaryQuoteCTA.label} onChange={(event) => { setSettings((current) => ({ ...current, primaryQuoteCTA: { ...current.primaryQuoteCTA, label: event.target.value } })); dirty(); }} /></Field><Field label="Default contact route" hint="Keep this as an internal website path."><TextInput value={settings.primaryQuoteCTA.href} onChange={(event) => { setSettings((current) => ({ ...current, primaryQuoteCTA: { ...current.primaryQuoteCTA, href: event.target.value } })); dirty(); }} /></Field></div></FormSection><FormSection eyebrow="05 / BRAND ASSETS" title="Logo & favicon" description="Final assets will be connected to storage later; the public layout is already prepared for the final SVG."><div className="admin-brand-placeholder"><div>STAR<br />ENERGIES</div><span><b>Wordmark placeholder</b><small>Final logo and favicon assets pending</small></span><AdminButton type="button" variant="line" onClick={() => setState("saved")}>Mark reviewed locally</AdminButton></div></FormSection></div><aside className="admin-editor-aside"><p>DESIGN-CONTROLLED</p><b>Visual system settings are not editable here.</b><span>Fonts, colour, layout, spacing, animation and responsive rules stay protected by the approved website design.</span></aside></div>
    <SaveBar state={state} onSave={save} onPreview={() => window.open("/contact", "_blank", "noopener,noreferrer")} saveLabel="Save settings" />
  </>;
}

export type SeoPage = { id: string; label: string; path: string; seo: SeoMetadata };
export function SeoManager({ pages }: { pages: SeoPage[] }) {
  const [records, setRecords] = useState(pages); const [activeId, setActiveId] = useState(pages[0]?.id ?? ""); const [state, setState] = useState<"idle" | "dirty" | "saving" | "saved" | "published">("idle");
  const active = records.find((record) => record.id === activeId) ?? records[0];
  if (!active) return <EmptyState title="No page metadata" body="Add a public page before managing search metadata." />;
  const update = (field: keyof SeoMetadata, value: string) => { setRecords((current) => current.map((record) => record.id === active.id ? { ...record, seo: { ...record.seo, [field]: value || undefined } } : record)); setState("dirty"); };
  const save = async () => { setState("saving"); const result = await saveSeoAction(active.id, active.seo); setState(result.ok ? "saved" : "idle"); };
  const publish = async () => { setState("saving"); const result = await saveSeoAction(active.id, active.seo, true); setState(result.ok ? "published" : "idle"); };
  return <>
    <PageHeader eyebrow="SYSTEM / SEO" title="Search metadata" description="Edit page titles and descriptions with the public layout in mind. This screen does not claim rankings or generate artificial scores." />
    <div className="admin-seo-layout"><nav aria-label="Public pages">{records.map((record) => <button className={record.id === active.id ? "is-active" : ""} type="button" key={record.id} onClick={() => setActiveId(record.id)}><b>{record.label}</b><small>{record.path}</small></button>)}</nav><div><FormSection eyebrow={`SEO / ${active.label.toUpperCase()}`} title="Page metadata" description="Required title and description are used for the current public route."><Field label="SEO title" required count={`${active.seo.title.length}/70`} error={active.seo.title.length < 10 ? "Use at least 10 characters." : active.seo.title.length > 70 ? "Keep this below 70 characters." : undefined}><TextInput value={active.seo.title} onChange={(event) => update("title", event.target.value)} /></Field><Field label="Meta description" required count={`${active.seo.description.length}/180`} error={active.seo.description.length < 40 ? "Use at least 40 characters." : active.seo.description.length > 180 ? "Keep this below 180 characters." : undefined}><TextArea value={active.seo.description} onChange={(event) => update("description", event.target.value)} /></Field><div className="admin-fields admin-fields--two"><Field label="Open Graph title" hint="Optional"><TextInput value={active.seo.ogTitle ?? ""} onChange={(event) => update("ogTitle", event.target.value)} /></Field><Field label="Open Graph description" hint="Optional"><TextArea value={active.seo.ogDescription ?? ""} onChange={(event) => update("ogDescription", event.target.value)} /></Field></div></FormSection><section className="admin-serp-preview"><p>SEARCH PREVIEW</p><span>starenergies.in{active.path}</span><h3>{active.seo.title}</h3><div>{active.seo.description}</div></section></div></div>
    <SaveBar state={state} onSave={save} onPublish={publish} onPreview={() => window.open(active.path, "_blank", "noopener,noreferrer")} saveLabel="Save draft" />
  </>;
}
