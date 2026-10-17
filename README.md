# Eltantawy — Meat & Poultry E-Commerce Platform

A production-ready, Arabic-first e-commerce platform built for a premium meat and poultry store. The project ships both a customer-facing storefront and a complete admin dashboard for managing products, orders, deliveries, returns, discounts, and analytics — all with a fully RTL interface and Arabic numerals throughout.

---

## Highlights

- **Arabic-first UX** — full RTL layout, Arabic typography (Cairo), Arabic numerals, and Arabic-friendly forms and validation messages.
- **Weight-range pricing workflow** — products can be sold by exact weight or by approximate weight range. Approximate items flow through the cart and checkout as a price *range*, and the final price is locked in by the admin after physically weighing the order.
- **Real-time updates** — new orders and status changes are pushed to both the admin dashboard and the customer's private channel via Pusher.
- **Complete order lifecycle** — from cart to delivery, with a strict state machine that prevents invalid transitions (e.g. `DELIVERED → PENDING`), and enforces weight confirmation before dispatch.
- **Returns & refunds** — partial returns per order item with a full approval workflow (`PENDING → APPROVED → REFUNDED / REJECTED`) and automatic financial recalculation.
- **Automatic & coupon discounts** — both coupon codes and site-wide automatic discounts, with the greater of the two always applied (no stacking).
- **Admin analytics** — dashboard with sales, returns, order status distribution, page views, and top-selling products.
- **SEO-ready** — structured data (Product, BreadcrumbList, Organization), dynamic sitemap, robots.txt, and admin-editable SEO settings.
- **Performance-focused** — server components by default, cached data via `unstable_cache` with tag-based invalidation, lazy-loaded dialogs, optimized Next.js images, and skeleton loading states for every route.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components, Server Actions) |
| **Language** | TypeScript (strict) |
| **Database** | MongoDB |
| **ORM** | Prisma 5 |
| **Auth** | JWT (access + refresh tokens) via httpOnly cookies |
| **Realtime** | Pusher (server + client SDKs) |
| **File uploads** | Cloudinary |
| **Forms** | React Hook Form + Zod |
| **Styling** | Tailwind CSS v4 |
| **Icons** | lucide-react |

---

## Architecture Overview

The project follows a **feature-first** layout: every domain owns its
components, services, and types, while truly shared UI and utilities live in
dedicated top-level folders.

```text
src/
│
├── app/                                # Next.js App Router (routing only)
│   ├── admin/                          # Protected admin dashboard
│   │   ├── orders/                     #   ├─ list + [id] detail
│   │   ├── products/                   #   ├─ list + categories + [id]
│   │   ├── returns/                    #   ├─ returns list
│   │   ├── sales/                      #   ├─ sales analytics
│   │   ├── page-views/                 #   ├─ traffic analytics
│   │   ├── users/                      #   ├─ registered + guest [phone]
│   │   ├── settings/                   #   ├─ delivery, discounts, SEO
│   │   ├── layout.tsx                  #   ├─ wraps every admin route
│   │   └── loading.tsx                 #   └─ dashboard skeleton
│   │
│   ├── api/                            # Route Handlers
│   │   ├── auth/                       #   ├─ login, logout, register,
│   │   │                               #   │  me, refresh-token
│   │   ├── page-views/                 #   ├─ unique view recording
│   │   ├── pusher/auth/                #   ├─ private channel auth
│   │   └── upload/image/               #   └─ Cloudinary upload
│   │
│   ├── products/                       # Storefront catalog + [id] detail
│   ├── categories/                     # Category tree
│   ├── offers/                         # Discounted products
│   ├── cart/                           # Cart page
│   ├── checkout/                       # Checkout page
│   ├── profile/                        # Profile + orders sub-route
│   ├── login/  register/               # Auth pages
│   ├── order-success/[orderNumber]/    # Post-purchase confirmation
│   │
│   ├── layout.tsx                      # Root layout (font, providers)
│   ├── page.tsx                        # Home page
│   ├── globals.css                     # Tailwind entry
│   ├── manifest.json                   # PWA manifest
│   ├── robots.ts                       # Dynamic robots.txt
│   └── sitemap.ts                      # Dynamic sitemap.xml
│
├── proxy.ts                            # Route guard (auth + refresh)
│
├── components/                         # Reusable UI primitives
│   ├── accordion/  breadcrumb/  button/
│   ├── card/  carousel/  dialog/  form/
│   ├── image-input/  input/  loading-image/
│   ├── logoutButton/  select/  skeleton/
│   ├── structured-data/  switch/  table/
│   ├── tag/  toaster/  tooltip/
│   └── icons/Spin.tsx
│
├── features/                           # Domain logic, split by audience
│   │
│   ├── admin/                          # Admin-only features
│   │   ├── categories/                 #   ├─ create, edit, delete
│   │   ├── orders/                     #   ├─ status, weight confirm
│   │   ├── page-views/                 #   ├─ traffic analytics
│   │   ├── products/                   #   ├─ create, edit, delete
│   │   ├── returns/                    #   ├─ approve, refund
│   │   ├── sales/                      #   ├─ revenue analytics
│   │   ├── settings/                   #   ├─ delivery, discounts, SEO
│   │   ├── users/                      #   ├─ profiles + guests
│   │   ├── Main.tsx                    #   ├─ dashboard
│   │   ├── Skeleton.tsx                #   ├─ dashboard skeleton
│   │   ├── InternalLoading.tsx         #   └─ shared loading shells
│   │   └── statColors.ts               #   └─ color palette helper
│   │
│   └── client/                         # Customer-facing features
│       ├── auth/                       #   ├─ login + register forms
│       ├── cart/                       #   ├─ cart page + dialog
│       ├── categories/                 #   ├─ category browsing
│       ├── checkout/                   #   ├─ order placement
│       ├── home/                       #   ├─ hero + best sellers
│       ├── offers/                     #   ├─ offers page
│       ├── orders/                     #   ├─ customer order history
│       ├── product-card/               #   ├─ shared product card
│       ├── products/                   #   ├─ detail page + purchase
│       └── profile/                    #   └─ profile card
│
├── layouts/                            # App shells
│   ├── admin/                          #   ├─ sidebar + header
│   └── client/                         #   └─ header, footer, back-to-top
│
├── lib/                                # Framework-agnostic logic
│   ├── auth/                           #   ├─ requireAdmin()
│   ├── auth.ts                         #   ├─ JWT sign/verify
│   ├── cart/                           #   ├─ CartService + cookie store
│   ├── order/                          #   ├─ order number generator
│   ├── products/                       #   ├─ pricing helpers
│   ├── realtime/                       #   ├─ Pusher server/client
│   ├── seo/                            #   ├─ metadata, structured data
│   └── prisma.ts                       #   └─ Prisma singleton
│
├── context/AuthContext.tsx             # Auth state provider
│
├── hooks/useScroll.tsx                 # Scroll threshold hook
│
├── constants/types.ts                  # Shared enums (COLOR, …)
│
├── styles/                             # Tailwind design tokens
│   ├── variables.css                   #   ├─ CSS variables
│   ├── theme.css                       #   ├─ @theme inline mapping
│   ├── animations.css                  #   ├─ keyframes
│   └── utilities.css                   #   └─ custom utilities
│
└── utils/                              # Pure helpers
    ├── toArabicNums.ts                 #   ├─ digit conversion
    └── whatsapp.ts                     #   └─ wa.me link builder
```

### Feature module convention

Every feature folder follows the same internal structure, so a new contributor
can predict where anything lives:

```text
features/<audience>/<domain>/
├── Main.tsx              # Public entry component
├── index.ts              # Barrel export
├── types.ts              # Local types
├── *.service.ts          # "use server" — data fetching & mutations
├── form/
│   ├── Main.tsx          # React Hook Form wrapper
│   └── schema.ts         # Zod schema
├── table/
│   ├── Main.tsx          # Server component that renders <Table />
│   ├── *Columns.tsx      # Column definitions
│   └── *.service.ts      # Paginated queries
└── create/ edit/ delete/ # Nested feature slices
```

### Design principles

- **Server-first** — data is fetched in Server Components and Server Actions.
  Client components are reserved for interactivity (forms, dialogs, toasts).
- **Feature-first** — each domain is self-contained. Shared primitives live in
  `components/` only if they are truly generic.
- **No client-side secrets** — `pusherServer` (holds `PUSHER_SECRET`) and the
  Prisma client are only imported from Server Actions and Route Handlers.
- **Explicit boundaries** — `lib/` never imports from `features/` or `app/`,
  keeping the dependency graph acyclic.
- **Cache tags over polling** — `unstable_cache` with tag-based invalidation
  (`revalidateTag(..., { expire: 0 })`) keeps the home page, category counts,
  and admin views in sync with edits.

---

## Key Features in Detail

### Cart & Checkout

- Cookie-based cart (no login required) with server-side hydration.
- Weight-range items render as a price range in the cart **and** the checkout, with a clear warning that the final price is determined after weighing.
- Delivery zones with hierarchical regions (parent zone → sub-zone with cost).
- Coupon codes and automatic discounts evaluated server-side; the best one wins.

### Orders

- Order number generation with collision-retry on the unique constraint.
- Strict status transitions: `PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED` (with `CANCELLED` available up to `OUT_FOR_DELIVERY`).
- **Weight confirmation gate**: an order cannot move to `OUT_FOR_DELIVERY` until every approximate-weight item has a confirmed actual weight.
- Timestamped status history displayed as a timeline to the customer.

### Returns

- Partial returns per item, validated against already-returned quantities.
- Refunding a return automatically increments `returnedQty` on order items and `refundedAmount` on the order — all inside a single transaction.

### Admin Dashboard

- Sales summary, monthly net sales, average order value, top products.
- Order status distribution with color-coded cards.
- Page-view analytics (unique visits per IP per path per day).
- Full CRUD for products, categories, delivery zones, and discounts.

### SEO

- Per-page canonical URLs, OpenGraph and Twitter cards.
- Admin-editable site title, description, keywords, and OG image (cached via `unstable_cache` and invalidated on save).
- Auto-generated `sitemap.xml` from products + static routes.

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)
- Pusher account (for real-time features)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Fill in the values below

# 3. Generate the Prisma client and push the schema
npx prisma generate
npx prisma db push

# 4. Run the dev server
npm run dev
