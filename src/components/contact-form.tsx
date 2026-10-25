"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, LoaderCircle } from "lucide-react";
import {
  contactLimits,
  validateContact,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact";

type Status = {
  type: "idle" | "sending" | "success" | "error";
  message?: string;
};
const failure = "Your message couldn’t be sent. Please try again later.";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const pending = useRef<AbortController | null>(null);
  const requestId = useRef<string | null>(null);
  useEffect(() => () => pending.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const result = validateContact(data);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus({ type: "idle" });
      const first = Object.keys(result.errors)[0];
      (
        form.elements.namedItem(first) as HTMLInputElement | HTMLTextAreaElement
      )?.focus();
      return;
    }
    setErrors({});
    setStatus({ type: "sending" });
    const controller = new AbortController();
    pending.current = controller;
    requestId.current ??= crypto.randomUUID();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": requestId.current,
        },
        body: JSON.stringify({ ...result.value, website: data.website ?? "" }),
        signal: controller.signal,
      });
      const body = await response.json();
      if (!response.ok || body.success !== true) {
        if (
          response.status === 400 &&
          body.errors &&
          typeof body.errors === "object"
        ) {
          const fieldErrors: ContactErrors = {};
          for (const field of ["name", "email", "message"] as const)
            if (typeof body.errors[field] === "string")
              fieldErrors[field] = body.errors[field];
          setErrors(fieldErrors);
        }
        setStatus({
          type: "error",
          message: typeof body.message === "string" ? body.message : failure,
        });
        return;
      }
      form.reset();
      requestId.current = null;
      setStatus({
        type: "success",
        message: "Message sent. Thanks for reaching out — I’ll reply by email.",
      });
    } catch {
      setStatus({ type: "error", message: failure });
    } finally {
      clearTimeout(timeout);
      pending.current = null;
    }
  }

  function edit(event: FormEvent<HTMLFormElement>) {
    const field = (event.target as HTMLInputElement).name as ContactField;
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    if (status.type !== "sending") {
      setStatus({ type: "idle" });
      requestId.current = null;
    }
  }

  return (
    <div className="contact-form-container">
      <noscript>
        <style>{`.contact-form { display: none; }`}</style>
        <p>Please enable JavaScript to use the contact form.</p>
      </noscript>
      <form
        className="contact-form"
        aria-label="Send a message"
        action="/api/contact"
        method="post"
        noValidate
        onSubmit={submit}
        onInput={edit}
        aria-busy={status.type === "sending"}
      >
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="contact-name">Your name</label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              disabled={status.type === "sending"}
              placeholder="Full name"
              required
              minLength={2}
              maxLength={contactLimits.name}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            {errors.name && (
              <span className="field-error" id="contact-name-error">
                {errors.name}
              </span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="contact-email">Your email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              disabled={status.type === "sending"}
              placeholder="you@example.com"
              required
              maxLength={contactLimits.email}
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
            />
            {errors.email && (
              <span className="field-error" id="contact-email-error">
                {errors.email}
              </span>
            )}
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="contact-message">Your message</label>
          <textarea
            id="contact-message"
            name="message"
            disabled={status.type === "sending"}
            placeholder="Tell me a little about what you have in mind…"
            rows={5}
            required
            minLength={10}
            maxLength={contactLimits.message}
            aria-invalid={!!errors.message}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
          />
          {errors.message && (
            <span className="field-error" id="contact-message-error">
              {errors.message}
            </span>
          )}
        </div>
        <div className="contact-trap" aria-hidden="true">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            maxLength={200}
          />
        </div>
        <div className="form-actions">
          <span>I’ll reply to the email you provide.</span>
          <button
            className="button button-primary"
            type="submit"
            disabled={status.type === "sending"}
          >
            {status.type === "sending" ? (
              <>
                Sending
                <LoaderCircle size={16} className="sending-spinner" />
              </>
            ) : (
              <>
                Send message
                <ArrowUpRight size={16} />
              </>
            )}
          </button>
        </div>
        {status.type === "success" && (
          <p className="form-feedback form-success" role="status">
            <CheckCircle2 size={16} />
            {status.message}
          </p>
        )}
        {status.type === "error" && (
          <p className="form-feedback form-error" role="alert">
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}
