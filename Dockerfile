FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV STRAPI_URL=https://strapi.balve.garmeres.com
ENV CALENDAR_URL=https://balve-calendar.hel1.your-objectstorage.com
ENV SITE_URL=https://garmeres.com
ENV NEXT_PUBLIC_GA_ID=G-D4DKCE7RH0

RUN --mount=type=secret,id=STRAPI_API_TOKEN \
    STRAPI_API_TOKEN=$(cat /run/secrets/STRAPI_API_TOKEN) \
    npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
