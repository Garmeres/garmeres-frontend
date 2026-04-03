# Garmeres Frontend

Website for [Garmeres](https://garmeres.com). Built with Next.js and Strapi v5.

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export)
- **CMS:** Strapi v5 (headless, hosted separately)
- **Styling:** Tailwind CSS 4 + `@tailwindcss/typography`
- **Locales:** English (`en`), Norwegian (`no`), Northern Sámi (`se`)
- **Analytics:** Google Analytics 4 (with cookie consent banner)

## Project Structure

```
src/
  app/
    [locale]/           # Locale-scoped pages
      page.tsx          # Home page (banner + dynamic zones)
      [slug]/page.tsx   # Dynamic CMS pages
      blog/[slug]/      # Blog post pages
      not-found.tsx     # Localized 404
      not-available/    # "Translation not available" page
    layout.tsx          # Root layout (metadata template)
    robots.ts           # robots.txt generation
    sitemap.ts          # sitemap.xml generation
  components/
    header.tsx          # Site header with logo
    menu.tsx            # Hamburger slide-out nav
    language-selector.tsx  # Locale switcher dropdown
    footer.tsx          # Footer with contact info + social links
    cookie-consent.tsx  # GA4 cookie consent banner
    dynamic-zone/       # Strapi dynamic zone components
      rich-text.tsx
      heading.tsx
      calendar/         # Calendar events (external API)
      blog-posts/       # Blog post grid with load-more
      membership-registration-form.tsx
  lib/
    strapi/             # Strapi client, types, helpers
    calendar.ts         # Calendar API client
```

## Getting Started

```bash
cp .env.example .env.local
# Fill in STRAPI_API_TOKEN and CALENDAR_URL
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable            | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `STRAPI_URL`        | Strapi API base URL                                     |
| `STRAPI_API_TOKEN`  | Strapi read-only API token                              |
| `CALENDAR_URL`      | Calendar sync API URL                                   |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID                       |
| `SITE_URL`          | Canonical site URL (used in sitemap, OG tags, hreflang) |

See [.env.example](.env.example) for defaults.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start dev server                     |
| `npm run build` | Production build (static generation) |
| `npm run start` | Serve production build               |
| `npm run lint`  | Run ESLint                           |

## Deployment

The site is statically generated at build time. All pages are pre-rendered via `generateStaticParams`. The build fetches content from Strapi and the calendar API, then outputs a `standalone` Node.js server with static HTML.

### Docker

```bash
docker build \
  --build-arg STRAPI_URL=https://strapi.balve.garmeres.com \
  --build-arg STRAPI_API_TOKEN=... \
  --build-arg CALENDAR_URL=... \
  --build-arg SITE_URL=https://garmeres.com \
  --build-arg NEXT_PUBLIC_GA_ID=G-D4DKCE7RH0 \
  -t garmeres-frontend .
docker run -p 3000:3000 garmeres-frontend
```

### CI/CD

Pushing to `main` triggers a GitHub Actions workflow that builds the Docker image and pushes it to `ghcr.io/garmeres/garmeres-frontend`. The build args are sourced from GitHub repository secrets.

### Kubernetes

Deployed to the Hetzner k8s cluster via ArgoCD. The Helm chart lives in [balve-k8s/applications/garmeres-frontend](https://github.com/garmeres/balve-k8s). Security hardening includes:

- Non-root container (UID 1001)
- Read-only root filesystem
- NetworkPolicy restricting egress to DNS only
- Dropped Linux capabilities
- No service account token mounted

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
