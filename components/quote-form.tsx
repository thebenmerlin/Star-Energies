"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Arrow } from "./arrow";
import {
  companyNameTreatment,
  enquiryCompanyTypes,
  enquiryRequirementFrequencies,
  rolesForCompanyType,
  type EnquiryCompanyType,
  type EnquiryRole,
} from "@/lib/enquiry-rules";
import type { QuoteFormContent } from "@/types/content";

type Status = "idle" | "submitting" | "error" | "success";
type DirectContact = { phoneHref: string; whatsappHref: string; emailHref: string };

const newSubmissionId = () => crypto.randomUUID();
const labReportTypes = "application/pdf,image/jpeg,image/png";

function Field({ name, label, required, optional, error, children, wide = false }: {
  name: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return <label className={`quote-form__field${wide ? " quote-form__field--wide" : ""} quote-form__field--${name}${error ? " quote-form__field--error" : ""}`}>
    <span>{label}{required && <b> *</b>}{optional && <em> OPTIONAL</em>}</span>
    {children}
    {error && <small id={`${name}-error`}>{error}</small>}
  </label>;
}

function FormSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <fieldset className="quote-form__group">
    <legend><b>{number}</b>{title}</legend>
    <div className="quote-form__fields">{children}</div>
  </fieldset>;
}

export function QuoteForm({ content, directContact }: { content: QuoteFormContent; directContact: DirectContact }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submissionId, setSubmissionId] = useState(newSubmissionId);
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [companyType, setCompanyType] = useState<EnquiryCompanyType | "">("");
  const [role, setRole] = useState<EnquiryRole | "">("");

  const roles = useMemo(() => rolesForCompanyType(companyType), [companyType]);
  const companyNameRule = companyType && role ? companyNameTreatment(companyType, role) : "hidden";
  const canShowRequirement = Boolean(companyType && role);
  const formHeading = content.heading === "QUOTE BRIEF / 01" ? "ENQUIRY / 01" : content.heading;
  const helperText = content.helperText === "Fields marked * are required. If you do not know every specification, contact us anyway."
    ? "Fields marked * are required. We only ask for business details that are relevant to your role."
    : content.helperText;
  const messageLabel = content.messageLabel === "Additional Requirement / Message" ? "Additional specifications" : content.messageLabel;
  const submitLabel = content.submitLabel === "Prepare Enquiry" ? "Send Enquiry" : content.submitLabel;

  function resetProgressiveFields() {
    setCompanyType("");
    setRole("");
  }

  function selectCompanyType(value: EnquiryCompanyType | "") {
    setCompanyType(value);
    setRole("");
    setFieldErrors({});
    setStatus("idle");
    setMessage("");
  }

  function selectRole(value: EnquiryRole | "") {
    setRole(value);
    setFieldErrors({});
    setStatus("idle");
    setMessage("");
  }

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

    const form = new FormData(formElement);
    const labReport = form.get("labReport");
    if (labReport instanceof File && labReport.size > 3 * 1024 * 1024) {
      setFieldErrors({ labReport: "Lab reports must be 3 MB or smaller." });
      setMessage("Please choose a smaller lab report and try again.");
      setStatus("error");
      return;
    }

    form.set("clientSubmissionId", submissionId);
    form.set("formStartedAt", String(formStartedAt));
    setStatus("submitting");
    setMessage("Sending your requirement…");
    try {
      const response = await fetch("/api/enquiries", { method: "POST", body: form });
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
      resetProgressiveFields();
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
      <div className="quote-form__head"><span>{formHeading}</span><p>{helperText.split("*")[0]}<b>*</b>{helperText.split("*").slice(1).join("*")}</p></div>

      <FormSection number="01" title="About you">
        <Field name="contactPerson" label="Your name" required error={fieldErrors.contactPerson}>
          <input name="contactPerson" required autoComplete="name" aria-invalid={Boolean(fieldErrors.contactPerson)} aria-describedby={fieldErrors.contactPerson ? "contactPerson-error" : undefined} />
        </Field>
        <Field name="companyType" label="Company type" required error={fieldErrors.companyType}>
          <select name="companyType" value={companyType} required onChange={(event) => selectCompanyType(event.target.value as EnquiryCompanyType | "")} aria-invalid={Boolean(fieldErrors.companyType)} aria-describedby={fieldErrors.companyType ? "companyType-error" : undefined}>
            <option value="" disabled>Select company type</option>
            {enquiryCompanyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </Field>
      </FormSection>

      {companyType && <FormSection number="02" title="Your role">
        <Field name="role" label="Your role" required error={fieldErrors.role} wide>
          <select name="role" value={role} required onChange={(event) => selectRole(event.target.value as EnquiryRole | "")} aria-invalid={Boolean(fieldErrors.role)} aria-describedby={fieldErrors.role ? "role-error" : undefined}>
            <option value="" disabled>Select your role</option>
            {roles.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </Field>
      </FormSection>}

      {canShowRequirement && <>
        <FormSection number="03" title="Business & contact">
          {companyNameRule !== "hidden" && <Field name="companyName" label="Company / firm name" required={companyNameRule === "required"} optional={companyNameRule === "optional"} error={fieldErrors.companyName}>
            <input name="companyName" required={companyNameRule === "required"} autoComplete="organization" aria-invalid={Boolean(fieldErrors.companyName)} aria-describedby={fieldErrors.companyName ? "companyName-error" : undefined} />
          </Field>}
          <Field name="phone" label="Phone" required error={fieldErrors.phone}>
            <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "phone-error" : undefined} />
          </Field>
          <Field name="email" label="Email" optional error={fieldErrors.email}>
            <input name="email" type="email" autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined} />
          </Field>
          <Field name="whatsapp" label="WhatsApp" optional error={fieldErrors.whatsapp}>
            <input name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" aria-invalid={Boolean(fieldErrors.whatsapp)} aria-describedby={fieldErrors.whatsapp ? "whatsapp-error" : undefined} />
          </Field>
        </FormSection>

        <FormSection number="04" title="Coal requirement">
          <Field name="coalRequirement" label="Coal / material required" required error={fieldErrors.coalRequirement} wide>
            <input name="coalRequirement" required aria-invalid={Boolean(fieldErrors.coalRequirement)} aria-describedby={fieldErrors.coalRequirement ? "coalRequirement-error" : undefined} />
          </Field>
          <Field name="gradeGcv" label="Grade / GCV" optional error={fieldErrors.gradeGcv}>
            <input name="gradeGcv" aria-invalid={Boolean(fieldErrors.gradeGcv)} aria-describedby={fieldErrors.gradeGcv ? "gradeGcv-error" : undefined} />
          </Field>
          <Field name="size" label="Size" optional error={fieldErrors.size}>
            <input name="size" aria-invalid={Boolean(fieldErrors.size)} aria-describedby={fieldErrors.size ? "size-error" : undefined} />
          </Field>
          <Field name="quantity" label="Quantity" required error={fieldErrors.quantity}>
            <input name="quantity" required inputMode="decimal" aria-invalid={Boolean(fieldErrors.quantity)} aria-describedby={fieldErrors.quantity ? "quantity-error" : undefined} />
          </Field>
          <Field name="unit" label="Unit" required error={fieldErrors.unit}>
            <select name="unit" defaultValue="Tonnes" required aria-invalid={Boolean(fieldErrors.unit)} aria-describedby={fieldErrors.unit ? "unit-error" : undefined}><option value="Tonnes">Tonnes</option><option value="MT">MT</option><option value="Other">Other</option></select>
          </Field>
          <Field name="requirementFrequency" label="Requirement frequency" required error={fieldErrors.requirementFrequency} wide>
            <select name="requirementFrequency" defaultValue="" required aria-invalid={Boolean(fieldErrors.requirementFrequency)} aria-describedby={fieldErrors.requirementFrequency ? "requirementFrequency-error" : undefined}><option value="" disabled>One-time or regular requirement?</option>{enquiryRequirementFrequencies.map((frequency) => <option key={frequency} value={frequency}>{frequency}</option>)}</select>
          </Field>
        </FormSection>

        <FormSection number="05" title="Delivery & specifications">
          <Field name="deliveryCity" label="Delivery location (city / town)" required error={fieldErrors.deliveryCity} wide>
            <input name="deliveryCity" required autoComplete="address-level2" aria-invalid={Boolean(fieldErrors.deliveryCity)} aria-describedby={fieldErrors.deliveryCity ? "deliveryCity-error" : undefined} />
          </Field>
          <Field name="state" label="State" required error={fieldErrors.state}>
            <input name="state" required autoComplete="address-level1" aria-invalid={Boolean(fieldErrors.state)} aria-describedby={fieldErrors.state ? "state-error" : undefined} />
          </Field>
          <Field name="pincode" label="Pincode" optional error={fieldErrors.pincode}>
            <input name="pincode" autoComplete="postal-code" aria-invalid={Boolean(fieldErrors.pincode)} aria-describedby={fieldErrors.pincode ? "pincode-error" : undefined} />
          </Field>
          <Field name="labReport" label="Lab report" optional error={fieldErrors.labReport} wide>
            <input className="quote-form__file" name="labReport" type="file" accept={labReportTypes} aria-invalid={Boolean(fieldErrors.labReport)} aria-describedby={fieldErrors.labReport ? "labReport-error" : "lab-report-help"} />
            <i id="lab-report-help">PDF, JPEG or PNG · up to 3 MB · shared privately with Star Energies</i>
          </Field>
        </FormSection>
        <label className={`quote-form__message${fieldErrors.message ? " quote-form__field--error" : ""}`}><span>{messageLabel} <em>{content.messageOptionalLabel}</em></span><textarea name="message" rows={5} maxLength={2000} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "message-error" : undefined} />{fieldErrors.message && <small id="message-error">{fieldErrors.message}</small>}</label>
      </>}

      <div className="quote-form__submit">
        <button className="button button--dark" type="submit" disabled={status === "submitting" || !canShowRequirement}>{status === "submitting" ? "Sending enquiry" : submitLabel} <Arrow diagonal /></button>
        {!canShowRequirement && <p className="quote-form__progress-note" aria-live="polite">Select your company type and role to continue.</p>}
        {status !== "idle" && <div className={`quote-form__status quote-form__status--${status}`} role={status === "error" ? "alert" : "status"} aria-live="polite"><p>{message}</p>{status === "success" && <div className="quote-form__direct-contact"><a href={directContact.phoneHref}>Call</a><a href={directContact.whatsappHref}>WhatsApp</a><a href={directContact.emailHref}>Email</a></div>}</div>}
      </div>
      <p className="quote-form__privacy">By sending this enquiry, you agree that Star Energies may use the submitted information to respond to your requirement. <Link href="/privacy">Privacy</Link></p>
    </form>
  );
}
