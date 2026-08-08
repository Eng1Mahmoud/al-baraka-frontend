# البركة — المتجر

Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · TanStack Query · React Hook Form + Zod · Zustand. Arabic, RTL, installable as a PWA.

## Run locally

```bash
npm install
```

Set `NEXT_PUBLIC_API_URL` (the API's base URL, including `/api`) and `NEXT_PUBLIC_SIRV_DOMAIN` in `.env` — the committed `.env` already points at a local API on `:4000`.

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
│   ├── notifications/    web push subscription + new-order toast
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

**One alert for every situation: the Web Push system notification.** It rings the same way whether the dashboard is focused, buried behind other tabs, or closed with the screen off — so there is a single thing to enable ("فعّل تنبيه الطلبات") and a single sound to learn.

An in-page chime was tried first and removed. It only ever worked in the one case that needs an alert least — someone already looking at the screen — while needing its own enable button (browser autoplay rules) and teaching admins two different sounds for the same event.

Two supporting paths keep the screen itself current, neither of which alerts:

- `sw.js` forwards every push to open tabs via `postMessage`, and `useNewOrderAlert` invalidates the orders query — the list updates the moment the order lands.
- `useOrders` polls `GET /api/orders` every 5 seconds in the background, as a safety net if a push is delayed or notifications were never enabled.

**On iOS, push only works after the PWA is installed to the home screen** (iOS 16.4+). Installing matters there, it isn't a nice-to-have.

## Installability

The site is a working PWA — manifest, icons in `public/icons/`, and a service worker registered from the root layout (`ServiceWorkerRegistrar`). Users install it through the browser's own control: the ⊕ icon in Chrome/Edge's address bar, or Share → Add to Home Screen on iOS.

The app is also offered in-page, in three places: a banner on the home page, a callout in the footer, and a callout after checkout — all driven by `useInstallPrompt` and worded from `features/pwa/config.ts`.

One-click install is only possible in Chromium browsers (Chrome, Edge, Opera, Samsung), which fire `beforeinstallprompt`. Safari never implemented that API and Firefox desktop removed PWA install entirely, so the hook reports the two worlds separately: `canInstall` shows a real install button, `needsIosSteps` shows the Share → Add to Home Screen path instead. Neither shows once the app is already running standalone.

Two details that are easy to break:

- The `beforeinstallprompt` event is captured by an inline `beforeInteractive` script in the root layout, not by a React effect. Chrome fires it once, early — often while the bundle is still downloading — and never re-sends it, so a listener attached from an effect misses it entirely and the button never appears.
- Dismissing is a 14-day snooze, not a permanent hide, so someone who taps X once (or installs and later removes the app) is offered it again.

## Pages

**Storefront:** home (hero + a slider per category) · `/products` (filters, sort, infinite scroll) · `/products/[slug]` · `/cart` · `/checkout` · `/track` (order number + phone) · custom 404.

**Dashboard:** overview · orders (5s polling) + order detail · products + add/edit · categories · settings · admins (superadmin only).

## Before launch

- [ ] Replace the generated icons in `public/icons/` with the real brand mark (same filenames).
- [ ] Swap the drawn ب mark in `src/shared/components/BrandMark.tsx` for the real one, if the shop has its own.
- [ ] Fill in the shop's phone, delivery fee, minimum order and working hours from `/dashboard/settings` — none of these live in code.
- [ ] Add the delivery areas and their fees — same page, `/dashboard/settings`.

## Deploy to Vercel

1. Import the repo — Next.js is detected automatically.
2. Environment variables: `NEXT_PUBLIC_API_URL` (the Render URL + `/api`), `NEXT_PUBLIC_SIRV_DOMAIN`.
3. Add the Vercel domain to `CORS_ORIGIN` on the API, or sign-in cookies will be rejected.
4. `next.config.ts` already sends no-cache headers for `/sw.js` so service worker updates ship immediately.
