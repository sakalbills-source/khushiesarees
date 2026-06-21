# KSarees 🪡

A deploy-ready **Next.js 15** saree e-commerce storefront, modelled on the
classic saree.com browsing pattern. Built with TypeScript, Tailwind CSS,
Supabase, Stripe and a React Context cart.

> The app ships with built-in **mock/seed data** and works with **zero
> configuration** — `npm install && npm run dev` gives you a fully browseable
> store. Add Supabase + Stripe keys to go live.

---

## ✨ Features

- **Home** — Hero banner, 4 category sections (Saree, Lehenga, Salwar Suits,
  Kurti) with 8 products each, newsletter signup and testimonials.
- **Shop** (`/products`) — Filters (category, fabric, max price, sort), search,
  and pagination.
- **Product detail** (`/products/[sku]`) — Image gallery, description, price,
  collapsible size guide, quantity selector, **customization/stitching toggle**,
  and add-to-cart.
- **Cart** (`/cart`) — Quantity adjuster, remove, subtotal — persisted in
  `localStorage` per browser session.
- **Checkout** (`/checkout`) — Email, **shipping region selector** (USA, UK, EU,
  NZ, Australia, Fiji, Caribbean) with flat rates, Stripe Checkout redirect, and
  an order confirmation screen.
- **Admin** (`/admin/products`) — Password-guarded list with add / edit / delete.
- **Worldwide shipping** with fixed per-region rates calculated at checkout.

## 🧱 Tech Stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 15 (App Router) + TypeScript     |
| Styling    | Tailwind CSS (pure — no design system)   |
| Database   | Supabase (PostgreSQL)                    |
| Payments   | Stripe Checkout                          |
| Cart state | React Context + `localStorage`           |

## 🎨 Design

- Dark charcoal nav (`#1a1a1a`), gold accent (`#d4af37`) for buttons/highlights.
- Serif (Playfair Display) headers, sans (Inter) body.
- Product cards: image, name, price in ₹, add-to-cart.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure env — the app runs without this
cp .env.local.example .env.local
# then edit .env.local with your keys

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>.

### Useful scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run start      # run production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```

---

## 🔐 Environment Variables

Copy `.env.local.example` → `.env.local`. All are optional for the demo shell.

| Variable                             | Purpose                                  |
| ------------------------------------ | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase project URL                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase anon key (client reads)         |
| `SUPABASE_SERVICE_ROLE_KEY`          | Server-only key (admin writes, orders)   |
| `STRIPE_SECRET_KEY`                  | Stripe secret (test key OK)              |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                   |
| `ADMIN_PASSWORD`                     | Password for `/admin/products` (default `changeme`) |
| `NEXT_PUBLIC_SITE_URL`               | Base URL for Stripe redirects            |

> Without Stripe keys, checkout runs in **demo mode** — it simulates a
> successful order so you can test the full flow.

---

## 🗄️ Database Setup (Supabase)

1. Create a project at <https://app.supabase.com>.
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql).
3. (Optional) run [`supabase/seed.sql`](supabase/seed.sql) for sample rows.
4. Copy your project URL + keys into `.env.local`.

RLS is left **off** for the MVP per spec — lock it down before production.

The data layer (`lib/products.ts`) automatically uses Supabase when configured
and falls back to mock data otherwise.

---

## 💳 Stripe Setup

1. Grab test keys from <https://dashboard.stripe.com/test/apikeys>.
2. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to env.
3. Checkout creates a Stripe Checkout Session and redirects to Stripe's hosted
   page; on success the customer returns to `/checkout?status=success`.

---

## 📁 Project Structure

```
app/
  layout.tsx                  # Root layout (nav, footer, cart provider, fonts)
  page.tsx                    # Home
  products/page.tsx           # Shop grid + filters + pagination
  products/[sku]/page.tsx     # Product detail
  cart/page.tsx               # Cart
  checkout/page.tsx           # Checkout + confirmation
  admin/products/page.tsx     # Admin (password-guarded)
  api/checkout/route.ts       # Stripe Checkout Session
  api/admin/products/route.ts # Admin CRUD
components/
  Nav, Footer, Hero, Newsletter, Testimonials,
  ProductGrid, ProductCard, ProductDetail,
  ProductFilters, Pagination, CartProvider
lib/
  types, supabase, stripe, products, mockData, shipping, format
supabase/
  schema.sql, seed.sql
```

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at <https://vercel.com/new> (framework auto-detected via
   [`vercel.json`](vercel.json)).
3. Add the environment variables in the Vercel dashboard.
4. Deploy. 🎉

---

## 📝 Notes

- Cart is session-based (`localStorage`) — no login required to shop.
- Admin add/edit/delete require a connected Supabase database; without it the
  admin list is read-only seed data.
- Product images use royalty-free Unsplash URLs as placeholders.
