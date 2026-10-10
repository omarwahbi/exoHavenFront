# ExoHaven frontend

The shop at https://exohaven-iq.com: a Next.js 15 (App Router, React 19) site
that reads its catalogue from the Strapi backend (omarwahbi/exoHavenBackEnd,
https://admin.exohaven-iq.com). Orders go out as a WhatsApp message; there is
no checkout or payment.

## Running it locally

Needs Node 22 (`.nvmrc`).

```sh
cp .env.example .env.local   # NEXT_PUBLIC_API_URL: the Strapi to read from
npm ci
npm run dev                  # http://localhost:3000
npm run lint
npm test                     # unit tests (Vitest, tests/*.test.js)
npm run build                # what Vercel runs
```

`NEXT_PUBLIC_API_URL` defaults to production. Point it at
`https://staging-admin.exohaven-iq.com` to work against the staging copy, or at
a local Strapi.

## Deploying

The site is on Vercel, with automatic deploys turned off for `master`
(`vercel.json`).

- Every pull request gets a preview deployment that reads from the **staging**
  backend.
- GitHub Actions (`.github/workflows/ci.yml`) lints, tests and builds every
  pull request.
- Dependabot opens weekly pull requests for minor and patch updates.
- Merging to `master` does not deploy. To release, open the deployment in Vercel
  and choose **Promote to Production**.

## Pages

| URL | Shows | File |
| --- | --- | --- |
| `/` | Home: hero, categories, new arrivals, featured products | `src/app/page.js` |
| `/products` | Every product, with search and a category filter | `src/app/products/page.jsx` |
| `/products/<id>` | One product | `src/app/products/[id]/` |
| `/categories/<id>` | One category: its sub-categories | `src/app/categories/[id]/page.jsx` |
| `/sub-categories/<id>` | One sub-category: its products | `src/app/sub-categories/[id]/page.jsx` |
| `/new-arrivals` | New arrivals | `src/app/new-arrivals/page.jsx` |
| `/cart` | The cart and the WhatsApp order form | `src/app/cart/page.jsx` |
| `/aboutUs`, `/contact` | Static pages | |

The ids in these URLs are Strapi `documentId`s. Old URLs keep working with a 308
redirect:
- the earlier section names (`/item/…`, `/subCategory/…`, `/items/…`,
  `/category`, `/items`), in `src/middleware.js` and `next.config.mjs`;
- numeric Strapi 4 ids, in `src/middleware.js`.

## Conventions

- **Data shape.** Read entries flat, the way Strapi 5 returns them:
  `item.name`, `item.category?.name`. Never use `item.attributes.name`.
  `src/utils/strapi.js` flattens v4-shaped responses, and the shared axios
  instance in `src/services/api.js` applies it to every response. Fetch through
  that instance, adding a function to `services/api.js`, rather than calling
  axios directly.
- **Ids.** Link to and compare entries with `entryKey(entry)` from
  `src/utils/ids.js` (the `documentId`). Strapi 5 changes the numeric `id`
  every time an entry is published.
- **Images.** Use `itemImageUrl(item)` / `imageUrl(field)` from
  `src/utils/media.js`. They handle missing thumbnails and fall back to a
  placeholder. Images come from ImageKit; `next.config.mjs` allows only that
  host.
- **Prices.** An item's price is in its `state` field, stored as a string. Use
  `src/utils/pricing.js` for unit prices (sale included), cart subtotals and
  delivery fees, so the cart, the metadata and the JSON-LD agree.
- **Sale.** The site-wide discount is set in the admin (the "Sale" single type:
  on/off, percent, end date, and the top banner: shown or not, and its text). The root layout fetches it with `getSale()`
  (`src/services/sale.js`, cached for 5 minutes). Client components read it with
  `useSale()` and pass it to `isSaleActive` / `calculateSalePrice` /
  `unitPrice`. Never hard-code a discount.
- **Variants and stock.** An item may have variants (sizes, wattages; set in the
  admin), each with its own price. Use `src/utils/product.js`, never `item.state`
  or `item.out_of_stock` directly:
  - `basePrice(item, variant)`: the price before the sale, or the lowest one for an
    item with variants;
  - `isOutOfStock` and `isLowStock`;
  - `hasVariants`.

  Cards link items with variants to the product page, where the shopper picks one.
  Cart lines carry the chosen `variant`. `<StockBadge>` shows "آخر قطعة".
- **Cart.** Use `useCart()` from `src/app/context/CartContext.jsx`. It provides
  `quantityOf`, `addItem`, `decreaseItem`, `removeItem`, `clearCart`,
  `itemCount`, and `loaded`. `loaded` is false until the saved cart has been read
  after the first render. The cart is saved in localStorage.
- **Where components go.** Components that only one page uses go in that page's
  folder, in `components/` (for example `src/app/products/components/`). Shared
  ones go in `src/app/Components/`, such as `ItemPrice` for a product's price
  with its sale. API calls go in `src/services/api.js`, and plain logic goes in
  `src/utils/`, such as the WhatsApp order text in `orderMessage.js`.
- **Server state** goes through TanStack Query, with keys from
  `src/utils/queryKeys.js`.
- **UI.** Tailwind and framer-motion, with icons from react-icons.
  `components.json` is set up for shadcn/ui, so `npx shadcn add <component>`
  works if you need one.
- **Redirects** go in `src/middleware.js`, not in pages. The app-wide
  `loading.jsx` streams pages, so a `redirect()` inside a page returns 200
  instead of a redirect.

## Tests

`tests/` covers the logic the shop depends on: reading Strapi data, the sale,
prices, delivery fees, the WhatsApp order text and the cart. Add a test when you
change one of these or add a rule like them.

## Other pieces

- `src/app/sw.js` is the service worker (Serwist), built to `public/sw.js`.
- `src/app/sitemap.js` and `src/app/robots.js` generate `/sitemap.xml` and
  `/robots.txt`.
- `src/utils/seo.js` holds the JSON-LD generators. See `SEO-IMPLEMENTATION.md`
  for the SEO background.
