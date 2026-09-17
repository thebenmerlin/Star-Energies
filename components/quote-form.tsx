"use client";

import { FormEvent, useState } from "react";
import { Arrow } from "./arrow";
import type { QuoteFormContent } from "@/types/content";

type Status = "idle" | "error" | "success";

export function QuoteForm({ content }: { content: QuoteFormContent }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (!formElement.checkValidity()) {
      setMessage(content.validationMessages.incomplete);
      setStatus("error");
      formElement.reportValidity();
      return;
    }

    const form = new FormData(formElement);
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();

    if (!phone && !email) {
      setMessage(content.validationMessages.contactMethod);
      setStatus("error");
      return;
    }

    setMessage(content.validationMessages.success);
    setStatus("success");
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      <div className="quote-form__head"><span>{content.heading}</span><p>{content.helperText.split("*")[0]}<b>*</b>{content.helperText.split("*").slice(1).join("*")}</p></div>
      {content.groups.map((group) => (
        <fieldset className="quote-form__group" key={group.id}>
          <legend>{group.label}</legend>
          <div className="quote-form__fields">
            {group.fields.map((field) => (
              <label className={field.width === "full" ? "quote-form__field quote-form__field--wide" : "quote-form__field"} key={field.name}>
                <span>{field.label}{field.required && <b> *</b>}{field.optional && <em> OPTIONAL</em>}</span>
                {field.type === "select" ? (
                  <select name={field.name} defaultValue="" required={field.required}><option value="" disabled>{field.placeholder ?? "Select an option"}</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select>
                ) : <input name={field.name} type={field.type} required={field.required} autoComplete={field.autoComplete} />}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <label className="quote-form__message"><span>{content.messageLabel} <em>{content.messageOptionalLabel}</em></span><textarea name="message" rows={5} /></label>
      <div className="quote-form__submit">
        <button className="button button--dark" type="submit">{content.submitLabel} <Arrow diagonal /></button>
        {status !== "idle" && <p className={`quote-form__status quote-form__status--${status}`} role="status">{message}</p>}
      </div>
    </form>
  );
}
