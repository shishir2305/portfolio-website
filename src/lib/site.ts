/** An unset URL intentionally emits no fabricated canonical or sitemap origin. */
function configuredOrigin(): string | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return undefined;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute http(s) origin.");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an http(s) origin without a path, query, or credentials.",
    );
  }
  if (url.hostname === "your-domain.com")
    throw new Error(
      "Replace the example NEXT_PUBLIC_SITE_URL with your actual domain, or leave it unset locally.",
    );
  return url.origin;
}

export const siteUrl = configuredOrigin();
export function absoluteUrl(path = "/") {
  return siteUrl ? new URL(path, siteUrl).toString() : undefined;
}
export function jsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
