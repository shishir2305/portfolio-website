import { test, expect } from "@playwright/test";
import { createContactHandler } from "../src/lib/contact-server";

type MailConfig = { apiKey: string; from: string; to: string };
const config: MailConfig = {
  apiKey: "test-only-key",
  from: "Portfolio <contact@example.com>",
  to: "owner@example.com",
};
const valid = {
  name: "Alex Rivera",
  email: "alex@example.com",
  message: "I would like to discuss a web application project.",
  website: "",
};
function request(body: unknown = valid, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3100/api/contact", {
    method: "POST",
    headers: {
      Origin: "http://localhost:3100",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}
function setup(
  options: {
    status?: number;
    receipt?: object;
    mailConfig?: Partial<MailConfig>;
    throwError?: boolean;
    clock?: () => number;
  } = {},
) {
  const sent: { url: string; init?: RequestInit }[] = [];
  const handler = createContactHandler({
    config: () => ({ ...config, ...options.mailConfig }),
    now: options.clock,
    fetch: (async (url, init) => {
      sent.push({ url: String(url), init });
      if (options.throwError) throw new Error("Mock network failure");
      return Response.json(options.receipt ?? { id: "test-mail-id" }, {
        status: options.status ?? 200,
      });
    }) as typeof fetch,
  });
  return { handler, sent };
}

test("validated messages go only to the owner, with the visitor as Reply-To", async () => {
  const { handler, sent } = setup();
  const id = "12345678-1234-1234-1234-123456789abc";
  const response = await handler(
    request(
      {
        ...valid,
        to: "attacker@example.com",
        message: "<script>alert('example')</script>\nA normal message.",
      },
      { "Idempotency-Key": id },
    ),
  );
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ success: true });
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(sent).toHaveLength(1);
  expect(sent[0].url).toBe("https://api.resend.com/emails");
  const payload = JSON.parse(String(sent[0].init?.body));
  expect(payload).toMatchObject({
    from: config.from,
    to: [config.to],
    reply_to: valid.email,
    subject: `Portfolio message from ${valid.name}`,
  });
  expect(payload.text).toContain("<script>"); // Plain text, never rendered as HTML.
  expect(payload.html).toBeUndefined();
  expect(new Headers(sent[0].init?.headers).get("idempotency-key")).toBe(id);
});

test("invalid, injected, bot, and cross-origin submissions never reach the provider", async () => {
  const { handler, sent } = setup();
  for (const body of [
    null,
    [],
    { ...valid, name: "" },
    { ...valid, email: "invalid" },
    { ...valid, name: "Alex\r\nBcc: anyone@example.com" },
    { ...valid, message: "short" },
    { ...valid, message: "a".repeat(5001) },
    { ...valid, website: "https://spam.example" },
  ]) {
    expect((await handler(request(body))).status).toBe(400);
  }
  expect(
    (await handler(request(valid, { Origin: "https://unrelated.example" })))
      .status,
  ).toBe(403);
  expect(
    (await handler(request(valid, { "Sec-Fetch-Site": "cross-site" }))).status,
  ).toBe(403);
  expect(
    (await handler(request(valid, { "Content-Type": "text/plain" }))).status,
  ).toBe(415);
  expect(sent).toHaveLength(0);
});

test("malformed and oversized bodies are rejected", async () => {
  const { handler, sent } = setup();
  const headers = {
    Origin: "http://localhost:3100",
    "Content-Type": "application/json",
  };
  expect(
    (
      await handler(
        new Request("http://localhost:3100/api/contact", {
          method: "POST",
          headers,
          body: "{",
        }),
      )
    ).status,
  ).toBe(400);
  expect(
    (
      await handler(
        new Request("http://localhost:3100/api/contact", {
          method: "POST",
          headers,
          body: "x".repeat(32769),
        }),
      )
    ).status,
  ).toBe(413);
  expect(sent).toHaveLength(0);
});

test("missing mail configuration fails honestly without contacting the provider", async () => {
  const { handler, sent } = setup({ mailConfig: { apiKey: "" } });
  const response = await handler(request());
  expect(response.status).toBe(503);
  expect(await response.json()).not.toHaveProperty("success", true);
  expect(sent).toHaveLength(0);
});

test("provider errors, invalid receipts, and network failures never show success", async () => {
  for (const options of [
    { status: 403 },
    { status: 429 },
    { status: 500 },
    { receipt: {} },
    { throwError: true },
  ]) {
    const { handler } = setup(options);
    const response = await handler(request());
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.success).not.toBe(true);
    expect(JSON.stringify(body)).not.toContain(config.apiKey);
  }
});

test("per-sender throttling expires and the total window caps different senders", async () => {
  let time = 1000;
  const { handler, sent } = setup({ clock: () => time });
  for (let index = 0; index < 3; index++)
    expect((await handler(request())).status).toBe(200);
  const limited = await handler(request());
  expect(limited.status).toBe(429);
  expect(Number(limited.headers.get("retry-after"))).toBeGreaterThan(0);
  expect(sent).toHaveLength(3);
  time += 15 * 60 * 1000 + 1;
  expect((await handler(request())).status).toBe(200);
  for (let index = 0; index < 19; index++)
    expect(
      (
        await handler(
          request({ ...valid, email: `visitor${index}@example.com` }),
        )
      ).status,
    ).toBe(200);
  expect(
    (await handler(request({ ...valid, email: "one-more@example.com" })))
      .status,
  ).toBe(429);
});
