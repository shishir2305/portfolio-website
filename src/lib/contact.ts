export const contactLimits = { name: 80, email: 254, message: 5000 } as const;
export type ContactField = "name" | "email" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;
export type ContactMessage = { name: string; email: string; message: string };
export const emailPattern =
  /^[^\s@<>\x00-\x1f\x7f]+@[^\s@<>\x00-\x1f\x7f]+\.[^\s@<>\x00-\x1f\x7f]+$/;

/** Shared rules keep browser feedback consistent with server validation. */
export function validateContact(
  input: unknown,
): { ok: true; value: ContactMessage } | { ok: false; errors: ContactErrors } {
  const fields =
    input && typeof input === "object" && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  const message =
    typeof fields.message === "string" ? fields.message.trim() : "";
  const errors: ContactErrors = {};
  if (
    name.length < 2 ||
    name.length > contactLimits.name ||
    /[\x00-\x1f\x7f]/.test(name)
  )
    errors.name = "Enter your name (2–80 characters).";
  if (email.length > contactLimits.email || !emailPattern.test(email))
    errors.email = "Enter a valid email address.";
  if (
    message.length < 10 ||
    message.length > contactLimits.message ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(message)
  )
    errors.message = "Write a message between 10 and 5,000 characters.";
  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, value: { name, email, message } };
}
