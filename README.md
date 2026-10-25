# Shishir Jha — Portfolio

Personal portfolio built with Next.js, React, and TypeScript.

## Development

Requires Node.js 22.18+.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Editing

- **Content:** `src/content/portfolio.ts` — profile, projects, experience, skills, and links. Project order, filters, and pages follow the projects array.
- **Styles:** `src/app/globals.css`; fonts and metadata: `src/app/layout.tsx`.
- **Project screenshots:** add images to `public/` and set the project's `image` field. Set `githubUrl` and optional `liveUrl` for project links.

## Production

Set `NEXT_PUBLIC_SITE_URL` to your domain origin (e.g. `https://example.com`) in `.env.local` or your hosting environment before building. It configures canonical URLs, social links, and the sitemap. Rebuild after changing it.

```sh
npm run build
npm start
```

## Contact email

Set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` in `.env.local` or your hosting environment. The sender must use a [domain verified in Resend](https://resend.com/docs/dashboard/domains/introduction). `CONTACT_TO_EMAIL` defaults to the email in `profile`.

Messages cannot be sent until these settings are configured. Keep the API key server-only. The resume PDF is not included in the public site.

## Checks

```sh
npm run typecheck
npm run build
npx playwright install chromium  # first-time setup
npm test
```

Browser tests use the production build on port 3100. Format source with `npm run format`.
