"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Capability, Industry, MediaAsset, Product } from "@/types/content";
import type { AdminSaveState } from "@/types/admin";
import { AdminButton, AdminLink, ConfirmDialog, EmptyState, Field, FormSection, MediaPicker, PageHeader, SaveBar, SelectInput, StatusBadge, TextArea, TextInput, Toggle } from "./admin-primitives";

type EntityKind = "products" | "industries" | "capabilities";
type ListItem = Product | Industry | Capability;

const dateLabel = "17 Sep 2026";

function ListToolbar({ query, onQuery, status, onStatus, createHref, createLabel }: { query: string; onQuery: (value: string) => void; status: string; onStatus: (value: string) => void; createHref: string; createLabel: string }) {
  return <div className="admin-list-toolbar"><TextInput value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search entries" aria-label="Search entries" /><SelectInput value={status} onChange={(event) => onStatus(event.target.value)} aria-label="Filter by status"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="inactive">Inactive</option></SelectInput><AdminLink href={createHref} variant="dark">{createLabel}</AdminLink></div>;
}

function EntityList({ kind, items }: { kind: EntityKind; items: ListItem[] }) {
  const [rows, setRows] = useState(items);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<"order" | "name">("order");
  const copy = kind === "products" ? { title: "Coal & Products", description: "Source categories—not online inventory. Availability and technical fields stay qualified.", create: "Add product", column: "Type / source" } : kind === "industries" ? { title: "Industries", description: "The application index helps customers identify where a requirement conversation can begin.", create: "Add industry", column: "Application" } : { title: "Capabilities", description: "Operational strengths are kept factual and editable without turning them into guarantees.", create: "Add capability", column: "Capability" };
  const filtered = useMemo(() => rows.filter((item) => {
    const title = "title" in item ? item.title : item.name;
    const matchesQuery = `${title} ${item.slug}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || (status === "inactive" ? !item.active : item.status === status);
    return matchesQuery && matchesStatus;
  }).sort((first, second) => {
    if (sort === "name") return ("title" in first ? first.title : first.name).localeCompare("title" in second ? second.title : second.name);
    return first.displayOrder - second.displayOrder;
  }), [query, rows, sort, status]);
  const updateLocal = (id: string, key: "active" | "featured", value: boolean) => setRows((current) => current.map((item) => item.id === id ? { ...item, [key]: value } as ListItem : item));
  const basePath = `/admin/${kind}`;

  return <>
    <PageHeader eyebrow="CATALOGUE" title={copy.title} description={copy.description} />
    <section className="admin-table-panel">
      <ListToolbar query={query} onQuery={setQuery} status={status} onStatus={setStatus} createHref={`${basePath}/new`} createLabel={copy.create} />
      <div className="admin-table-tools"><span>{filtered.length} {filtered.length === 1 ? "entry" : "entries"}</span><button type="button" onClick={() => setSort((current) => current === "order" ? "name" : "order")}>Sort: {sort === "order" ? "Display order" : "Name"}</button></div>
      {filtered.length === 0 ? <EmptyState title="No matching entries" body="Adjust the search or status filter, or add a new entry." action={<AdminLink href={`${basePath}/new`} variant="line">{copy.create}</AdminLink>} /> : <div className="admin-table-wrap"><table className="admin-data-table"><thead><tr><th>Name</th><th>{copy.column}</th><th>Featured</th><th>Status</th><th>Order</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filtered.map((item) => {
        const name = "title" in item ? item.title : item.name;
        const detail = "sourceType" in item ? item.sourceType ?? "Requirement-led" : "shortDescription" in item ? item.shortDescription : "";
        return <tr key={item.id}><td><b>{name}</b><small>/{item.slug}</small></td><td><span className="admin-table-detail">{detail}</span></td><td><button className={`admin-feature-toggle ${item.featured ? "is-on" : ""}`} type="button" onClick={() => updateLocal(item.id, "featured", !item.featured)} aria-label={`${item.featured ? "Remove" : "Make"} ${name} featured`}>{item.featured ? "Yes" : "—"}</button></td><td><button type="button" className="admin-status-button" onClick={() => updateLocal(item.id, "active", !item.active)}><StatusBadge status={item.active ? item.status : "inactive"} /></button></td><td>{String(item.displayOrder).padStart(2, "0")}</td><td>{dateLabel}</td><td><Link className="admin-table-edit" href={`${basePath}/${item.id}`}>Edit</Link></td></tr>;
      })}</tbody></table></div>}
    </section>
  </>;
}

export function ProductsManager({ products }: { products: Product[] }) { return <EntityList kind="products" items={products} />; }
export function IndustriesManager({ industries }: { industries: Industry[] }) { return <EntityList kind="industries" items={industries} />; }
export function CapabilitiesManager({ capabilities }: { capabilities: Capability[] }) { return <EntityList kind="capabilities" items={capabilities} />; }

function useEditorState() {
  const [state, setState] = useState<AdminSaveState>("idle");
  return {
    state,
    markDirty: () => setState("dirty"),
    save: () => { setState("saving"); window.setTimeout(() => setState("saved"), 420); },
    publish: () => { setState("saving"); window.setTimeout(() => setState("published"), 420); },
  };
}

function CommaListField({ label, values, onChange, hint }: { label: string; values?: string[]; onChange: (values: string[]) => void; hint?: string }) {
  return <Field label={label} hint={hint}><TextInput value={values?.join(", ") ?? ""} onChange={(event) => onChange(event.target.value.split(",").map((value) => value.trim()).filter(Boolean))} placeholder="Add values separated by commas" /></Field>;
}

function SeoFields({ title, description, onChange }: { title?: string; description?: string; onChange: () => void }) {
  return <div className="admin-fields admin-fields--two"><Field label="SEO title" hint="Recommended: 10–70 characters" count={`${title?.length ?? 0}/70`}><TextInput defaultValue={title} onChange={onChange} /></Field><Field label="Meta description" hint="Recommended: 40–180 characters" count={`${description?.length ?? 0}/180`}><TextArea defaultValue={description} onChange={onChange} /></Field></div>;
}

function EditorActions({ state, onSave, onPublish, route }: { state: AdminSaveState; onSave: () => void; onPublish: () => void; route: string }) {
  return <SaveBar state={state} onSave={onSave} onPublish={onPublish} onPreview={() => window.open(route, "_blank", "noopener,noreferrer")} />;
}

export function ProductEditor({ initial, media, isNew = false }: { initial: Product; media: MediaAsset[]; isNew?: boolean }) {
  const router = useRouter();
  const editor = useEditorState();
  const [product, setProduct] = useState(initial);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const update = <K extends keyof Product>(key: K, value: Product[K]) => { setProduct((current) => ({ ...current, [key]: value })); editor.markDirty(); };
  const nameError = !product.name.trim() ? "Name is required." : undefined;
  const slugError = product.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug) ? "Use lowercase words separated by hyphens." : undefined;
  return <>
    <PageHeader eyebrow={`COAL & PRODUCTS / ${isNew ? "NEW ENTRY" : "EDIT ENTRY"}`} title={isNew ? "Add coal category" : product.name} description="Fields are deliberately open where technical information is not yet known." actions={!isNew ? <AdminButton type="button" variant="quiet" onClick={() => setDeleteOpen(true)}>Delete</AdminButton> : undefined} />
    <div className="admin-editor-layout"><div>
      <FormSection eyebrow="01 / IDENTITY" title="Category details"><div className="admin-fields admin-fields--two"><Field label="Name" required error={nameError}><TextInput value={product.name} onChange={(event) => update("name", event.target.value)} /></Field><Field label="Slug" required hint="Used in future internal links." error={slugError}><TextInput value={product.slug} onChange={(event) => update("slug", event.target.value)} placeholder="lowercase-hyphenated-slug" /></Field></div><Field label="Short description" required count={`${product.shortDescription.length}/300`}><TextArea value={product.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} /></Field><Field label="Long description" hint="Optional—leave blank if the short description is sufficient." count={`${product.longDescription?.length ?? 0}/700`}><TextArea value={product.longDescription ?? ""} onChange={(event) => update("longDescription", event.target.value || undefined)} /></Field></FormSection>
      <FormSection eyebrow="02 / SOURCING & MATERIAL" title="Requirement context" description="Leave unknown technical information blank. Do not create a fixed online specification catalogue."><Field label="Type / source"><TextInput value={product.sourceType ?? ""} onChange={(event) => update("sourceType", event.target.value || undefined)} /></Field><div className="admin-fields admin-fields--two"><CommaListField label="Grades" values={product.grades} onChange={(value) => update("grades", value.length ? value : undefined)} /><Field label="GCV information"><TextInput value={product.gcvInfo ?? ""} onChange={(event) => update("gcvInfo", event.target.value || undefined)} /></Field><CommaListField label="Sizes" values={product.sizes} onChange={(value) => update("sizes", value.length ? value : undefined)} /><CommaListField label="Applications" values={product.applications} onChange={(value) => update("applications", value.length ? value : undefined)} /></div><Field label="Availability note" hint="Keep availability subject to enquiry and feasibility."><TextArea value={product.availabilityNote ?? ""} onChange={(event) => update("availabilityNote", event.target.value || undefined)} /></Field></FormSection>
      <FormSection eyebrow="03 / MEDIA & VISIBILITY" title="Website presentation"><MediaPicker media={media} selectedId={product.imageId} onSelect={(asset) => update("imageId", asset.id)} /><div className="admin-toggle-group"><Toggle checked={product.featured} onChange={(value) => update("featured", value)} label="Feature on website" detail="Makes this category available to approved featured sections." /><Toggle checked={product.active} onChange={(value) => update("active", value)} label="Active" detail="Inactive entries stay out of the public website." /></div><Field label="Display order"><TextInput type="number" min="0" value={product.displayOrder} onChange={(event) => update("displayOrder", Number(event.target.value))} /></Field></FormSection>
      <FormSection eyebrow="04 / SEARCH" title="Search metadata"><SeoFields title={product.seo?.title} description={product.seo?.description} onChange={editor.markDirty} /></FormSection>
    </div><aside className="admin-editor-aside"><p>PUBLIC STATUS</p><StatusBadge status={product.active ? product.status : "inactive"} /><b>{product.featured ? "Featured category" : "Standard category"}</b><span>Prices, live stock counts and unsupported technical values are not published.</span></aside></div>
    <EditorActions state={editor.state} onSave={editor.save} onPublish={editor.publish} route="/coal" />
    <ConfirmDialog open={deleteOpen} title={`Delete ${product.name}?`} description="This demonstration deletes only the local working state. In production, this action will require a final deletion policy." onCancel={() => setDeleteOpen(false)} onConfirm={() => router.push("/admin/products")} />
  </>;
}

export function IndustryEditor({ initial, media, isNew = false }: { initial: Industry; media: MediaAsset[]; isNew?: boolean }) {
  const router = useRouter();
  const editor = useEditorState();
  const [industry, setIndustry] = useState(initial);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const update = <K extends keyof Industry>(key: K, value: Industry[K]) => { setIndustry((current) => ({ ...current, [key]: value })); editor.markDirty(); };
  return <>
    <PageHeader eyebrow={`INDUSTRIES / ${isNew ? "NEW ENTRY" : "EDIT ENTRY"}`} title={isNew ? "Add industry" : industry.name} description="Use a concise application description; do not imply unsupported fuel specifications." actions={!isNew ? <AdminButton type="button" variant="quiet" onClick={() => setDeleteOpen(true)}>Delete</AdminButton> : undefined} />
    <div className="admin-editor-layout"><div><FormSection eyebrow="01 / IDENTITY" title="Industry entry"><div className="admin-fields admin-fields--two"><Field label="Name" required error={!industry.name ? "Name is required." : undefined}><TextInput value={industry.name} onChange={(event) => update("name", event.target.value)} /></Field><Field label="Slug" required error={industry.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(industry.slug) ? "Use lowercase words separated by hyphens." : undefined}><TextInput value={industry.slug} onChange={(event) => update("slug", event.target.value)} /></Field></div><Field label="Short description" required count={`${industry.shortDescription.length}/300`}><TextArea value={industry.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} /></Field><Field label="Long description" hint="Optional"><TextArea value={industry.longDescription ?? ""} onChange={(event) => update("longDescription", event.target.value || undefined)} /></Field></FormSection><FormSection eyebrow="02 / MEDIA & VISIBILITY" title="Website presentation"><MediaPicker media={media} selectedId={industry.imageId} onSelect={(asset) => update("imageId", asset.id)} /><div className="admin-fields admin-fields--two"><Field label="Icon label" hint="Optional internal reference"><TextInput value={industry.icon ?? ""} onChange={(event) => update("icon", event.target.value || undefined)} /></Field><Field label="Display order"><TextInput type="number" min="0" value={industry.displayOrder} onChange={(event) => update("displayOrder", Number(event.target.value))} /></Field></div><div className="admin-toggle-group"><Toggle checked={industry.featured} onChange={(value) => update("featured", value)} label="Feature on website" /><Toggle checked={industry.active} onChange={(value) => update("active", value)} label="Active" /></div></FormSection><FormSection eyebrow="03 / SEARCH" title="Search metadata"><SeoFields title={industry.seo?.title} description={industry.seo?.description} onChange={editor.markDirty} /></FormSection></div><aside className="admin-editor-aside"><p>APPLICATION INDEX</p><StatusBadge status={industry.active ? industry.status : "inactive"} /><b>Requirement-led discussion</b><span>Industry entries guide the public directory; they do not make sector-specific technical guarantees.</span></aside></div>
    <EditorActions state={editor.state} onSave={editor.save} onPublish={editor.publish} route="/industries" />
    <ConfirmDialog open={deleteOpen} title={`Delete ${industry.name}?`} description="This demonstration removes the entry only from the temporary working screen." onCancel={() => setDeleteOpen(false)} onConfirm={() => router.push("/admin/industries")} />
  </>;
}

export function CapabilityEditor({ initial, media }: { initial: Capability; media: MediaAsset[] }) {
  const router = useRouter();
  const editor = useEditorState();
  const [capability, setCapability] = useState(initial);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const update = <K extends keyof Capability>(key: K, value: Capability[K]) => { setCapability((current) => ({ ...current, [key]: value })); editor.markDirty(); };
  return <>
    <PageHeader eyebrow="CAPABILITIES / EDIT ENTRY" title={capability.title} description="Capabilities are factual operating contexts, not performance promises." actions={<AdminButton type="button" variant="quiet" onClick={() => setDeleteOpen(true)}>Delete</AdminButton>} />
    <div className="admin-editor-layout"><div><FormSection eyebrow="01 / CAPABILITY" title="Core entry"><div className="admin-fields admin-fields--two"><Field label="Title" required><TextInput value={capability.title} onChange={(event) => update("title", event.target.value)} /></Field><Field label="Slug" required><TextInput value={capability.slug} onChange={(event) => update("slug", event.target.value)} /></Field></div><Field label="Short description" required count={`${capability.shortDescription.length}/300`}><TextArea value={capability.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} /></Field><Field label="Long description" hint="Optional"><TextArea value={capability.longDescription ?? ""} onChange={(event) => update("longDescription", event.target.value || undefined)} /></Field></FormSection><FormSection eyebrow="02 / DISPLAY" title="Visual context"><MediaPicker media={media} selectedId={capability.mediaId} onSelect={(asset) => update("mediaId", asset.id)} /><div className="admin-fields admin-fields--two"><Field label="Icon label" hint="Optional"><TextInput value={capability.icon ?? ""} onChange={(event) => update("icon", event.target.value || undefined)} /></Field><Field label="Display order"><TextInput type="number" min="0" value={capability.displayOrder} onChange={(event) => update("displayOrder", Number(event.target.value))} /></Field></div><div className="admin-toggle-group"><Toggle checked={capability.featured} onChange={(value) => update("featured", value)} label="Feature on website" /><Toggle checked={capability.active} onChange={(value) => update("active", value)} label="Active" /></div></FormSection><FormSection eyebrow="03 / SEARCH" title="Search metadata"><SeoFields title={capability.seo?.title} description={capability.seo?.description} onChange={editor.markDirty} /></FormSection></div><aside className="admin-editor-aside"><p>PUBLIC STATUS</p><StatusBadge status={capability.active ? capability.status : "inactive"} /><b>Controlled capability statement</b><span>Leave commercial and transport claims qualified by transaction, availability and feasibility.</span></aside></div>
    <EditorActions state={editor.state} onSave={editor.save} onPublish={editor.publish} route="/capabilities" />
    <ConfirmDialog open={deleteOpen} title={`Delete ${capability.title}?`} description="This demonstration removes the entry only from the temporary working screen." onCancel={() => setDeleteOpen(false)} onConfirm={() => router.push("/admin/capabilities")} />
  </>;
}
