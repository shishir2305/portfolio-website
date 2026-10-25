// Node-only module. Never import this file into a client component.
import { createHash, randomUUID } from "node:crypto";
import { profile } from "../content/portfolio";
import { emailPattern, validateContact } from "./contact";

const MAX_BODY_BYTES = 32768;
const WINDOW_MS = 15 * 60 * 1000;
const unavailable =
  "Message delivery is temporarily unavailable. Please try again later.";

type MailConfig = {
  apiKey?: string;
  from?: string;
  to: string;
  siteOrigin?: string;
};
type Dependencies = {
  config?: () => MailConfig;
  fetch?: typeof globalThis.fetch;
  now?: () => number;
};

function reply(
  status: number,
  body: object,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
    throw new RangeError("Body too large");
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Empty body");
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RangeError("Body too large");
    }
    text += decoder.decode(value, { stream: true });
  }
  return JSON.parse(text + decoder.decode());
}

/**
 * Injection lets tests exercise real validation and delivery without sending mail.
 * The bounded limiter is per process; use host-level rate limits when scaling
 * across instances. No message bodies or raw email addresses are retained.
 */
export function createContactHandler(dependencies: Dependencies = {}) {
  const getConfig =
    dependencies.config ??
    (() => ({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL || profile.email,
      siteOrigin: process.env.NEXT_PUBLIC_SITE_URL,
    }));
  const send = dependencies.fetch ?? globalThis.fetch;
  const now = dependencies.now ?? Date.now;
  const attempts = new Map<string, { count: number; expires: number }>();
  let total = { count: 0, expires: 0 };

  return async function POST(request: Request): Promise<Response> {
    const config = getConfig();
    const origin = request.headers.get("origin");
    const allowed = [new URL(request.url).origin];
    if (config.siteOrigin) {
      try {
        allowed.push(new URL(config.siteOrigin).origin);
      } catch {
        return reply(503, { message: unavailable });
      }
    }
    if (
      !origin ||
      !allowed.includes(origin) ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      return reply(403, {
        message:
          "Please send your message through the contact form on this website.",
      });
    if (
      request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() !== "application/json"
    )
      return reply(415, {
        message: "Please use the contact form to send your message.",
      });

    let input: unknown;
    try {
      input = await readBody(request);
    } catch (error) {
      return reply(error instanceof RangeError ? 413 : 400, {
        message:
          "Your message could not be read. Check its length and try again.",
      });
    }
    if (
      input &&
      typeof input === "object" &&
      "website" in input &&
      input.website !== "" &&
      input.website != null
    )
      return reply(400, {
        message: "Your message could not be sent. Please try again.",
      });
    const result = validateContact(input);
    if (!result.ok)
      return reply(400, {
        message: "Please check the highlighted fields.",
        errors: result.errors,
      });

    const fromAddress = config.from?.match(/<([^<>]+)>$/)?.[1] ?? config.from;
    if (
      !config.apiKey?.trim() ||
      !config.from ||
      /[\r\n]/.test(config.from) ||
      !fromAddress ||
      !emailPattern.test(fromAddress) ||
      !emailPattern.test(config.to)
    )
      return reply(503, { message: unavailable });

    const timestamp = now();
    for (const [key, entry] of attempts)
      if (entry.expires <= timestamp) attempts.delete(key);
    if (total.expires <= timestamp)
      total = { count: 0, expires: timestamp + WINDOW_MS };
    const emailKey = createHash("sha256")
      .update(result.value.email.toLowerCase())
      .digest("hex");
    const entry = attempts.get(emailKey) ?? {
      count: 0,
      expires: timestamp + WINDOW_MS,
    };
    if (entry.count >= 3 || total.count >= 20)
      return reply(
        429,
        {
          message:
            "Too many messages. Please wait a few minutes before trying again.",
        },
        {
          "Retry-After": String(
            Math.max(
              1,
              Math.ceil(
                ((entry.count >= 3 ? entry.expires : total.expires) -
                  timestamp) /
                  1000,
              ),
            ),
          ),
        },
      );
    attempts.set(emailKey, { count: entry.count + 1, expires: entry.expires });
    total.count++;

    const { name, email, message } = result.value;
    const requestKey = request.headers.get("idempotency-key");
    const id =
      requestKey &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        requestKey,
      )
        ? requestKey
        : randomUUID();
    try {
      const response = await send("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "shishir-portfolio/1.0",
          "Idempotency-Key": id,
        },
        body: JSON.stringify({
          from: config.from,
          to: [config.to],
          reply_to: email,
          subject: `Portfolio message from ${name}`,
          // Plain text keeps visitor content out of HTML and email headers.
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }),
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      });
      if (!response.ok) return reply(502, { message: unavailable });
      const receipt: unknown = await response.json();
      if (
        !receipt ||
        typeof receipt !== "object" ||
        !("id" in receipt) ||
        typeof receipt.id !== "string" ||
        !receipt.id
      )
        return reply(502, { message: unavailable });
      return reply(200, {
        success: true,
        message: "Message sent. Thanks for reaching out — I’ll reply by email.",
      });
    } catch {
      // Avoid logging private form content or exposing provider errors/credentials.
      return reply(502, { message: unavailable });
    }
  };
}
