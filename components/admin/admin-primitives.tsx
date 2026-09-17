"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { AdminSaveState, EnquiryStatus } from "@/types/admin";
import type { MediaAsset } from "@/types/content";
import { Icon } from "./admin-shell";

type PublishStatus = "draft" | "published" | "hidden" | EnquiryStatus | "active" | "inactive";

export function StatusBadge({ status }: { status: PublishStatus }) {
  const label = status === "new" ? "New" : status === "contacted" ? "Contacted" : status === "quoted" ? "Quoted" : status === "closed" ? "Closed" : status === "archived" ? "Archived" : status === "published" ? "Published" : status === "draft" ? "Draft" : status === "active" ? "Active" : status === "inactive" ? "Inactive" : "Hidden";
  return <span className={`admin-status admin-status--${status}`}>{label}</span>;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return <div className="admin-page-header"><div>{eyebrow && <p>{eyebrow}</p>}<h2>{title}</h2>{description && <span>{description}</span>}</div>{actions && <div className="admin-page-header__actions">{actions}</div>}</div>;
}

export function AdminButton({ children, variant = "dark", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "dark" | "line" | "amber" | "quiet" }) {
  return <button className={`admin-button admin-button--${variant} ${className}`} {...props}>{children}</button>;
}

export function AdminLink({ children, variant = "dark", className = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "dark" | "line" | "amber" | "quiet" }) {
  return <a className={`admin-button admin-button--${variant} ${className}`} {...props}>{children}</a>;
}

export function FormSection({ eyebrow, title, description, children, action }: { eyebrow?: string; title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="admin-form-section"><header>{eyebrow && <p>{eyebrow}</p>}<div><h3>{title}</h3>{description && <span>{description}</span>}</div>{action}</header><div className="admin-form-section__body">{children}</div></section>;
}

export function Field({ label, hint, error, required, children, count, className = "" }: { label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode; count?: string; className?: string }) {
  return <label className={`admin-field ${className}`}><span className="admin-field__label">{label}{required && <b>Required</b>}{count && <em>{count}</em>}</span>{children}{error ? <small className="admin-field__error">{error}</small> : hint && <small>{hint}</small>}</label>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="admin-input" {...props} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="admin-textarea" {...props} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="admin-select" {...props} />;
}

export function Toggle({ checked, onChange, label, detail }: { checked: boolean; onChange: (checked: boolean) => void; label: string; detail?: string }) {
  const id = useId();
  return <label className="admin-toggle" htmlFor={id}><span><b>{label}</b>{detail && <small>{detail}</small>}</span><input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>;
}

export function SaveBar({ state, onSave, onPublish, onPreview, saveLabel = "Save draft" }: { state: AdminSaveState; onSave: () => void; onPublish?: () => void; onPreview?: () => void; saveLabel?: string }) {
  const label = state === "dirty" ? "Unsaved changes" : state === "saving" ? "Saving…" : state === "saved" ? "Saved" : state === "published" ? "Published" : state === "error" ? "Could not save — try again" : "No changes";
  return <div className="admin-savebar"><span className={`admin-savebar__state admin-savebar__state--${state}`}><i />{label}</span><div>{onPreview && <AdminButton variant="quiet" type="button" onClick={onPreview}>Preview <Icon name="external" size={14} /></AdminButton>}<AdminButton variant="line" type="button" disabled={state === "idle" || state === "saving"} onClick={onSave}>{saveLabel}</AdminButton>{onPublish && <AdminButton variant="dark" type="button" onClick={onPublish}>Publish <Icon name="arrow" size={15} /></AdminButton>}</div></div>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return <div className="admin-empty-state"><i>—</i><h3>{title}</h3><p>{body}</p>{action}</div>;
}

export function ConfirmDialog({ open, title, description, confirmLabel = "Delete", onCancel, onConfirm }: { open: boolean; title: string; description: string; confirmLabel?: string; onCancel: () => void; onConfirm: () => void }) {
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const onKeydown = (event: KeyboardEvent) => { if (event.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [open, onCancel]);
  if (!open) return null;
  return <div className="admin-dialog-backdrop" role="presentation"><section ref={dialogRef} tabIndex={-1} className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title"><p>CONFIRM ACTION</p><h2 id="confirm-dialog-title">{title}</h2><span>{description}</span><div><AdminButton variant="line" type="button" onClick={onCancel}>Cancel</AdminButton><AdminButton variant="dark" className="admin-button--danger" type="button" onClick={onConfirm}>{confirmLabel}</AdminButton></div></section></div>;
}

export function MediaPicker({ media, selectedId, onSelect }: { media: MediaAsset[]; selectedId?: string; onSelect: (media: MediaAsset) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => media.filter((asset) => `${asset.title} ${asset.category}`.toLowerCase().includes(query.toLowerCase())), [media, query]);
  const selected = media.find((asset) => asset.id === selectedId);
  return <div className="admin-media-picker"><div className="admin-media-picker__selected">{selected?.url ? <div style={{ backgroundImage: `url("${selected.url}")` }} /> : <div className="admin-media-picker__blank">No image</div>}<span><b>{selected?.title ?? "No image selected"}</b><small>{selected?.placeholder ? "Development placeholder" : "Ready for use"}</small></span><AdminButton variant="line" type="button" onClick={() => setOpen(true)}>Change image</AdminButton></div>{open && <div className="admin-dialog-backdrop"><section className="admin-media-dialog" role="dialog" aria-modal="true" aria-label="Choose media"><header><div><p>MEDIA LIBRARY</p><h2>Select an image</h2></div><AdminButton variant="quiet" type="button" onClick={() => setOpen(false)}>Close</AdminButton></header><TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search photography" aria-label="Search media" /> <div className="admin-media-dialog__grid">{filtered.map((asset) => <button className={asset.id === selectedId ? "is-selected" : ""} type="button" key={asset.id} onClick={() => { onSelect(asset); setOpen(false); }}><div style={{ backgroundImage: asset.url ? `url("${asset.url}")` : undefined }}>{!asset.url && <span>Logo placeholder</span>}</div><b>{asset.title}</b><small>{asset.category} · {asset.placeholder ? "Placeholder" : "Media"}</small></button>)}</div></section></div>}</div>;
}
