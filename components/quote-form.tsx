"use client";

import { FormEvent, useState } from "react";
import { Arrow } from "./arrow";

type Status = "idle" | "error" | "success";

const fieldGroups = [
  [
    { name: "contactPerson", label: "Contact Person", required: true, type: "text" },
    { name: "companyName", label: "Company Name", required: true, type: "text" },
    { name: "phone", label: "Phone", required: false, type: "tel" },
    { name: "email", label: "Email", required: false, type: "email" },
    { name: "whatsapp", label: "WhatsApp", required: false, type: "tel", optional: true },
  ],
  [
    { name: "coalRequirement", label: "Coal Requirement / Type", required: true, type: "text" },
    { name: "gradeGcv", label: "Grade or GCV", required: false, type: "text", optional: true },
    { name: "size", label: "Size", required: false, type: "text", optional: true },
    { name: "quantity", label: "Quantity", required: true, type: "text" },
    { name: "unit", label: "Unit", required: true, type: "select" },
  ],
  [
    { name: "deliveryCity", label: "Delivery City", required: true, type: "text" },
    { name: "state", label: "State", required: true, type: "text" },
    { name: "pincode", label: "Pincode", required: false, type: "text", optional: true },
    { name: "timeline", label: "Desired Timeline", required: false, type: "text", optional: true },
  ],
];

export function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (!formElement.checkValidity()) {
      setMessage("Please complete the required fields so we can understand the enquiry.");
      setStatus("error");
      formElement.reportValidity();
      return;
    }

    const form = new FormData(formElement);
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();

    if (!phone && !email) {
      setMessage("Please add a phone number or email so we can respond.");
      setStatus("error");
      return;
    }

    setMessage("Your requirement is ready to send. Enquiry delivery will be connected in a later phase; for now, please call, WhatsApp or email us directly.");
    setStatus("success");
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      <div className="quote-form__head"><span>QUOTE BRIEF / 01</span><p>Fields marked <b>*</b> are required. If you do not know every specification, contact us anyway.</p></div>
      {fieldGroups.map((group, groupIndex) => (
        <fieldset className="quote-form__group" key={groupIndex}>
          <legend>{String(groupIndex + 1).padStart(2, "0")}</legend>
          <div className="quote-form__fields">
            {group.map((field) => (
              <label className={field.name === "coalRequirement" || field.name === "deliveryCity" ? "quote-form__field quote-form__field--wide" : "quote-form__field"} key={field.name}>
                <span>{field.label}{field.required && <b> *</b>}{field.optional && <em> OPTIONAL</em>}</span>
                {field.type === "select" ? (
                  <select name={field.name} defaultValue="" required={field.required}><option value="" disabled>Select unit</option><option>Tonnes</option><option>MT</option><option>Other</option></select>
                ) : <input name={field.name} type={field.type} required={field.required} autoComplete={field.name === "email" ? "email" : undefined} />}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <label className="quote-form__message"><span>Additional Requirement / Message <em>OPTIONAL</em></span><textarea name="message" rows={5} /></label>
      <div className="quote-form__submit">
        <button className="button button--dark" type="submit">Prepare Enquiry <Arrow diagonal /></button>
        {status !== "idle" && <p className={`quote-form__status quote-form__status--${status}`} role="status">{message}</p>}
      </div>
    </form>
  );
}
