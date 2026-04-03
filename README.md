# Garmeres Frontend

Website for [Garmeres](https://garmeres.com). Built with Next.js and Strapi v5.

## Tech Stack

- **Framework:** Next.js 16 (App Router, standalone)
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

The Docker image contains the source code and dependencies. `next build` runs at **pod startup**, fetching content from Strapi and the calendar API. This means content updates in Strapi go live by restarting the pod — no image rebuild needed.

### Docker

```bash
docker build -t garmeres-frontend .
docker run -p 3000:3000 \
  -e STRAPI_URL=https://strapi.balve.garmeres.com \
  -e STRAPI_API_TOKEN=your-token \
  -e CALENDAR_URL=https://balve-calendar.hel1.your-objectstorage.com \
  -e SITE_URL=https://garmeres.com \
  -e NEXT_PUBLIC_GA_ID=G-D4DKCE7RH0 \
  garmeres-frontend
```

### CI/CD

Pushing to `main` triggers a GitHub Actions workflow that builds the Docker image and pushes it to `ghcr.io/garmeres/garmeres-frontend`. No secrets are needed — the image only contains source code and dependencies.

### Kubernetes

Deployed to the Hetzner k8s cluster via ArgoCD. The Helm chart lives in [balve-k8s/applications/garmeres-frontend](https://github.com/garmeres/balve-k8s). Environment variables are set in the deployment; the API token comes from a SealedSecret.

Security hardening:

- Non-root container (UID 1001)
- NetworkPolicy restricting ingress to Traefik and egress to CoreDNS, Strapi, and HTTPS (image optimization)
- Dropped Linux capabilities
- No service account token mounted
