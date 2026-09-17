"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Arrow } from "./arrow";
import type { QuoteFormContent } from "@/types/content";

type Status = "idle" | "submitting" | "error" | "success";
type DirectContact = { phoneHref: string; whatsappHref: string; emailHref: string };

const newSubmissionId = () => crypto.randomUUID();

export function QuoteForm({ content, directContact }: { content: QuoteFormContent; directContact: DirectContact }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submissionId, setSubmissionId] = useState(newSubmissionId);
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (status === "submitting") return;
    setFieldErrors({});

    if (!formElement.checkValidity()) {
      setMessage(content.validationMessages.incomplete);
      setStatus("error");
      formElement.reportValidity();
      return;
    }

    const form = Object.fromEntries(new FormData(formElement).entries());
    setStatus("submitting");
    setMessage("Sending your requirement…");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clientSubmissionId: submissionId, formStartedAt }),
      });
      const result = await response.json() as { ok?: boolean; message?: string; fields?: Record<string, string> };
      if (!response.ok || !result.ok) {
        setFieldErrors(result.fields ?? {});
        setMessage(result.message ?? "We could not send the enquiry right now. Please try again or contact Star Energies directly.");
        setStatus("error");
        return;
      }

      setMessage(result.message ?? content.validationMessages.success);
      setStatus("success");
      formElement.reset();
      setSubmissionId(newSubmissionId());
      setFormStartedAt(Date.now());
    } catch {
      setMessage("We could not send the enquiry right now. Please try again or contact Star Energies directly.");
      setStatus("error");
    }
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      <div className="quote-form__honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="quote-form__head"><span>{content.heading}</span><p>{content.helperText.split("*")[0]}<b>*</b>{content.helperText.split("*").slice(1).join("*")}</p></div>
      {content.groups.map((group) => (
        <fieldset className="quote-form__group" key={group.id}>
          <legend>{group.label}</legend>
          <div className="quote-form__fields">
            {group.fields.map((field) => (
              <label className={`${field.width === "full" ? "quote-form__field quote-form__field--wide" : "quote-form__field"}${fieldErrors[field.name] ? " quote-form__field--error" : ""}`} key={field.name}>
                <span>{field.label}{(field.required || field.name === "phone") && <b> *</b>}{field.optional && <em> OPTIONAL</em>}</span>
                {field.type === "select" ? (
                  <select name={field.name} defaultValue={field.name === "unit" ? "Tonnes" : ""} required={field.required || field.name === "phone"} aria-invalid={Boolean(fieldErrors[field.name])} aria-describedby={fieldErrors[field.name] ? `${field.name}-error` : undefined}><option value="" disabled>{field.placeholder ?? "Select an option"}</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select>
                ) : <input name={field.name} type={field.type} required={field.required || field.name === "phone"} autoComplete={field.autoComplete} inputMode={field.type === "tel" ? "tel" : field.name === "quantity" ? "decimal" : undefined} aria-invalid={Boolean(fieldErrors[field.name])} aria-describedby={fieldErrors[field.name] ? `${field.name}-error` : undefined} />}
                {fieldErrors[field.name] && <small id={`${field.name}-error`}>{fieldErrors[field.name]}</small>}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <label className={`quote-form__message${fieldErrors.message ? " quote-form__field--error" : ""}`}><span>{content.messageLabel} <em>{content.messageOptionalLabel}</em></span><textarea name="message" rows={5} maxLength={2000} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "message-error" : undefined} />{fieldErrors.message && <small id="message-error">{fieldErrors.message}</small>}</label>
      <div className="quote-form__submit">
        <button className="button button--dark" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending enquiry" : content.submitLabel} <Arrow diagonal /></button>
        {status !== "idle" && <div className={`quote-form__status quote-form__status--${status}`} role={status === "error" ? "alert" : "status"} aria-live="polite"><p>{message}</p>{status === "success" && <div className="quote-form__direct-contact"><a href={directContact.phoneHref}>Call</a><a href={directContact.whatsappHref}>WhatsApp</a><a href={directContact.emailHref}>Email</a></div>}</div>}
      </div>
      <p className="quote-form__privacy">By sending this enquiry, you agree that Star Energies may use the submitted information to respond to your requirement. <Link href="/privacy">Privacy</Link></p>
    </form>
  );
}
