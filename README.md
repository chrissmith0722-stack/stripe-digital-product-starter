# stripe-digital-product-starter (multi-product)

Stripe Checkout for three digital SKUs → license key → zip download.

## Sales pages (Gumroad-style)

| page | CTA |
|------|-----|
| `/sales/cashflow_kit.html` | `/buy/cashflow_kit` ($19) |
| `/sales/invoice_pack.html` | `/buy/invoice_pack` ($12) |
| `/sales/finance_bundle.html` | `/buy/finance_bundle` ($27) |

`GET /buy/:productId` starts Stripe Checkout. Cancel returns to the matching sales page.

## Setup

1. Put buyer zips in `products/files/`
2. `cp .env.example .env` — fill `STRIPE_SECRET_KEY` + three Price IDs
3. `npm install && npm start`
4. Open `http://localhost:4242/sales/cashflow_kit.html`

Live test still blocked on Chris’s Stripe Price IDs.
