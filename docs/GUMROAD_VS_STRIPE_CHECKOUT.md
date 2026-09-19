# Gumroad vs Stripe Checkout (decision note)

Short decision aid for selling the same digital SKUs. This repo implements **Stripe Checkout on your own site**, not Gumroad.

## Quick pick

| Choose… | When… |
|---------|--------|
| **Gumroad** | You want the fastest path to a hosted product page, built-in delivery, and marketplace discovery with almost no engineering. |
| **Stripe Checkout (this starter)** | You want your own sales pages, custom post-purchase flow (license keys + gated zip), and full control of branding/URL. |

## Comparison

| Topic | Gumroad | Stripe Checkout (this starter) |
|-------|---------|--------------------------------|
| Storefront | Hosted by Gumroad | You host (`/sales/*.html`) |
| Payment | Gumroad (often card + other rails) | Stripe Checkout Session |
| Delivery | Gumroad file delivery / email | License key → `/download` zip gate |
| Fees | Platform fee + payment fees | Stripe processing fees only (no Gumroad cut) |
| Setup time | Minutes | Hours (Prices, env, host, HTTPS) |
| Custom UX | Limited | Full control |
| Compliance / tax UX | Platform helpers vary | You own configuration (Tax, receipts, etc.) |
| Lock-in | Product lives on Gumroad | Product + licenses live on your stack |

## Practical recommendation

1. **Validate demand on Gumroad** if the SKU is new and you have not sold it yet — lowest time-to-first-dollar.
2. **Move high-intent / brand traffic to this Stripe starter** when you need custom sales copy, bundles, or license gating that Gumroad’s defaults do not cover.
3. **Do not dual-list the same file under conflicting prices** without a clear rule (e.g. Gumroad = discovery, Stripe = “buy on my site” with matching or intentional premium pricing).

## What this starter does *not* do

- Sync inventory or licenses with Gumroad.
- Embed Gumroad checkout buttons.
- Migrate existing Gumroad customers automatically.

If you stay on Gumroad only, you can ignore `.env` Price IDs and treat this repo as a future migration path.

## Next step if you choose Stripe

Follow [SELLER_SETUP.md](./SELLER_SETUP.md), then [TEST_MODE.md](./TEST_MODE.md).
