# البركة — المتجر

Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · TanStack Query · React Hook Form + Zod · Zustand. Arabic, RTL, installable as a PWA.

## Run locally

```bash
npm install
```

Copy `.env.example` to `.env.local` and point `API_ORIGIN` at the API — `http://localhost:4000`
to develop against a local one. Leave `NEXT_PUBLIC_API_URL` as `/api`: the browser calls this app
and `next.config.ts` forwards from there, which is what keeps the session cookie first-party and
readable by the `/dashboard` gate in `proxy.ts`.

```bash
npm run dev
```

## Structure — feature-based

Each feature owns its API calls, hooks, components, schemas and types. `shared/` holds what more than one feature uses; `app/` holds routing only and imports from features.

```
src/
├── app/
│   ├── (storefront)/     home, categories, product, cart, checkout
│   ├── (auth)/login/     staff sign-in — customers never sign in
│   ├── (dashboard)/      overview, orders, products, categories, settings, admins
│   ├── layout.tsx        <html lang="ar" dir="rtl">, Arabic fonts, providers
│   └── manifest.ts       PWA manifest
├── features/
│   ├── products/         api · hooks · components · schemas · types
│   ├── categories/
│   ├── orders/
│   ├── admins/
│   ├── cart/store/       zustand + localStorage guest cart
│   ├── auth/
│   ├── notifications/    sound alert + web push subscription
│   ├── dashboard/        sidebar, header, overview tiles
│   └── pwa/              service worker registration
├── shared/
│   ├── components/       Logo, Header, Footer, DeleteButton, forms/
│   ├── hooks/            useImageUpload (Sirv, via the API)
│   ├── lib/              apiClient (axios), queryClient + query keys, format
│   └── config/site.ts    footer links, status labels and colors
├── components/ui/        shadcn components (generated — edit freely, they're yours)
└── proxy.ts              redirects /dashboard when no session cookie
```

## Brand

Tokens live in `src/app/globals.css` under `@theme`:

- **Green is the brand** — `brand-900/700/500/300/100/50`. Every primary action uses it.
- **Fruit colors are accents only** — `fruit-tomato/citrus/lemon/plum`. Badges and category chips, never primary buttons.
- **Order statuses have their own scale** — `status-pending/confirmed/preparing/delivering/delivered/cancelled`, deliberately distinct from the fruit accents so a status is never misread at a glance.
- **Signature element**: `.plu-sticker` — the tilted, dashed-edge sticker on product cards, modeled on the PLU labels stuck to real fruit. Reserve it for exceptional states (fresh today, discount); it stops meaning anything if it's on every card.

Fonts: Changa for headings (`font-display`), IBM Plex Sans Arabic for body.

## Orders and notifications

The dashboard polls `GET /api/orders` every 5 seconds (`refetchInterval` in `useOrders`), including while the tab is in the background. Two separate alerts, because they cover different situations:

| Situation | What alerts | Enabled by |
|---|---|---|
| Dashboard tab open | custom sound + toast | "تفعيل الصوت" — one click, required by browser autoplay rules |
| Tab closed / screen off | Web Push system notification | "تفعيل الإشعارات" — asks for permission, subscribes the device |

`public/sounds/new-order.wav` is a generated placeholder chime — replace the file, keep the path.

**On iOS, push only works after the PWA is installed to the home screen** (iOS 16.4+). The install button matters there, it isn't a nice-to-have.

## Installability

The site is a working PWA — manifest, icons in `public/icons/`, and a service worker registered from the root layout (`ServiceWorkerRegistrar`). Users install it through the browser's own control: the ⊕ icon in Chrome/Edge's address bar, or Share → Add to Home Screen on iOS.

There is deliberately **no in-app install button**. One-click install is only possible in Chromium browsers (Chrome, Edge, Opera, Samsung); Firefox desktop removed PWA install entirely and Safari never implemented the prompt API, so an in-app button could not behave consistently. The service worker is still required for order push notifications.

## Pages

**Storefront:** home (hero + a slider per category) · `/products` (filters, sort, infinite scroll) · `/products/[slug]` · `/cart` · `/checkout` · `/track` (order number + phone) · custom 404.

**Dashboard:** overview · orders (5s polling) + order detail · products + add/edit · categories · settings · admins (superadmin only).

## Before launch

- [ ] Replace the generated icons in `public/icons/` with the real brand mark (same filenames).
- [ ] Replace the placeholder phone number in `src/shared/config/site.ts`.
- [ ] Swap the text logo in `src/shared/components/Logo.tsx` for the real mark.
- [ ] Replace `public/sounds/new-order.wav` with the shop's own alert sound.
- [ ] Write the `/about`, `/terms` and `/privacy` pages linked in the footer.

## Deploy to Vercel

1. Import the repo — Next.js is detected automatically.
2. Environment variables: `API_ORIGIN` (the Render URL, no `/api`), `NEXT_PUBLIC_API_URL` (`/api`), `NEXT_PUBLIC_SIRV_DOMAIN`.
3. Add the Vercel domain to `CORS_ORIGIN` on the API. The browser no longer calls it cross-site, so nothing depends on this — it is there for anyone who points a client straight at the API.
4. `next.config.ts` already sends no-cache headers for `/sw.js` so service worker updates ship immediately.
