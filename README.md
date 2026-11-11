# StudioSpace

**Space to make. Time to create.**

StudioSpace is a peer-to-peer creative workspace marketplace. Creators discover
photo studios, sound stages, podcast rooms, music suites, art workshops and event
spaces by the hour, request the hours they need, and keep every booking in one
place. Hosts list their rooms, approve requests and protect their calendars from
double bookings.

> **Live site:** replace this line with your deployed URL after following the
> [deployment steps](#deployment) below — for example
> `https://studiosspace.vercel.app`. The API is deployed separately (Render,
> Railway or Fly.io) and the client proxies `/api` to it.

## Features

- **Curated discovery** — a three-slide Swiper hero, six featured rooms, six
  category tiles and an editorial home page that links straight into filtered
  search.
- **URL-driven studio search** — keyword, category, price band, rating and
  newest sorting with a 350 ms debounce, numbered pagination and shareable URLs.
- **Full studio CRUD for hosts** — a five-section listing form, image uploads
  (file or URL), live preview, owner-only edit/delete with a custom confirmation
  dialog and a “My listings” dashboard.
- **Booking requests with calendar protection** — date/time pickers, server
  calculated totals and a 5% service fee shown before submission. The API rejects
  any request that overlaps an existing **Confirmed** booking for that room.
- **Booking lifecycle** — Pending, Confirmed, Completed and Cancelled statuses,
  guest cancellation while pending, host confirm/complete actions, and a
  downloadable **PDF invoice** for confirmed/completed bookings.
- **Reviews and saved studios** — one editable review per creator per studio with
  live rating distribution, plus a MongoDB-backed wishlist reachable from every
  studio card.
- **Auth that survives reloads** — JWT stored only in an HTTPOnly cookie, session
  restore before protected routes render, password rules, Google sign-in, and no
  redirect to Login for an already signed-in user.
- **Polished system states** — skeletons on every data view, composed empty and
  error states, a custom 404, an error boundary, Sonner toasts, custom dialogs and
  a warm light/dark theme.
- **Responsive and accessible** — mobile-first layouts, keyboard-friendly Radix
  primitives, labelled form fields, skip link and reduced-motion support.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 3 with custom design tokens, Fraunces + Manrope |
| UI | Radix Dialog/Dropdown, shadcn-style primitives, lucide icons |
| Carousel | Swiper 11 (fade + autoplay) |
| Notifications | Sonner toasts + custom confirmation dialogs (no `alert()`) |
| Invoices | jsPDF, imported lazily only when a receipt is downloaded |
| Data | Express API on the same origin through Next rewrites |
| Auth | HTTPOnly, SameSite=Lax JWT cookie; optional Google OAuth |

The API lives in [`../server`](../server) and is documented in
[`../server/README.md`](../server/README.md).

## Local setup

Requires **Node.js 20+** and npm. Two terminals are needed: one for the API and
one for the client.

### 1. API

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

With an empty `MONGODB_URI`, development uses an in-memory MongoDB instance and
seeds 14 studios, 42 reviews and 7 bookings automatically. The API listens on
`http://localhost:5000`.

### 2. Client

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Next.js server forwards
`/api/*` and `/uploads/*` to `API_PROXY_URL` (default `http://localhost:5000`), so
the browser stays on a single origin and the auth cookie is first-party.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `API_PROXY_URL` | Origin of the Express API used by Next rewrites (default `http://localhost:5000`) |
| `NEXT_PUBLIC_API_URL` | Optional absolute API URL for browser code; leave blank to use the proxy |
| `NEXT_PUBLIC_SITE_URL` | Public client URL used in metadata and OAuth redirects |

Google sign-in is optional. When it is not configured, the login page shows a
toast explaining that the provider is unavailable and email sign-in continues to
work. To enable it, set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and
`CLIENT_URL` on the API and use
`https://your-api-domain.com/api/auth/google/callback` as the authorised redirect
URI.

### Examiner test credentials

| Role | Email | Password |
| --- | --- | --- |
| Creator + host (all booking statuses) | `examiner@studiosspace.com` | `Studio123` |
| Host | `host@studiosspace.com` | `Studio123` |

The examiner account owns three listings, has incoming requests on the
dashboard, a wishlist with saved studios and bookings in every status. The login
form includes a **Fill credentials** shortcut for demonstration. All data is
seeded demonstration content; no payments are processed.

## Scripts

```bash
npm run dev        # start the development server
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # strict TypeScript check
```

## Project structure

```
src/
  app/
    (site)/          # navbar + footer shell: home, studios, bookings, dashboard…
    (auth)/          # minimal login / register shell
    not-found.tsx    # custom 404
    error.tsx        # client error boundary
  components/
    auth/ booking/ brand/ dashboard/ home/ layout/ studio/ ui/
  lib/
    api.ts           # fetch helper with credentials and typed errors
    auth-context.tsx # session restore + wishlist state
    constants.ts     # categories, amenities, nav, site details
    invoice.ts       # PDF receipt generator (lazy jsPDF import)
```

## Deployment

1. **API first.** Deploy the `server` directory to Render/Railway/Fly.io with
   `MONGODB_URI` (Atlas), `JWT_SECRET`, `CLIENT_URL=https://your-client-domain`
   and, optionally, `IMGBB_API_KEY` and Google OAuth credentials.
2. **Client second.** Import this repository into Vercel with **Root Directory =
   `client`** and set:
   - `API_PROXY_URL=https://your-api-domain`
   - `NEXT_PUBLIC_SITE_URL=https://your-client-domain`
3. Set `CLIENT_URL` on the API to the final client URL and add the Google OAuth
   callback URL if Google sign-in is enabled.
4. Replace the live-site line at the top of this README with the deployed URL.

Cookies work across the deployment because the browser only ever calls the
client origin; Next rewrites forward API traffic server-side.

## Notes

- This is a portfolio/assignment build. Studio listings, hosts, reviews and
  bookings are seeded demonstration data, and payments are simulated.
- Every line of copy is written for the product; all notifications use Sonner
  toasts or custom dialogs.
- Booking totals are calculated and stored server-side; the client cannot alter
  the subtotal, service fee or deposit.
