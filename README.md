# stripe-digital-product-starter (multi-product)

Stripe Checkout for four digital SKUs → license key → zip download.

## Sales pages

| Product | Sales page URL | Buy route | Display price |
|---------|----------------|-----------|---------------|
| Solo Freelancer Cashflow Kit | `/sales/cashflow_kit.html` | `/buy/cashflow_kit` | $19 |
| Invoice + Reminder Pack | `/sales/invoice_pack.html` | `/buy/invoice_pack` | $12 |
| Finance Starter Bundle | `/sales/finance_bundle.html` | `/buy/finance_bundle` | $27 |
| Freelancer Client Ops Kit | `/sales/client_ops_kit.html` | `/buy/client_ops_kit` | $29 |

`GET /buy/:productId` starts Stripe Checkout. Cancel returns to the matching sales page when using defaults.

## Docs

- [ENV.md](docs/ENV.md) — every environment variable (includes `STRIPE_PRICE_CLIENT_OPS_KIT`)
- [TEST_MODE.md](docs/TEST_MODE.md) — step-by-step test checkout for all four products

## Setup

1. Put buyer zips in `products/files/` (names must match `products/catalog.json`)
2. `cp .env.example .env` — fill `STRIPE_SECRET_KEY` + four Price IDs (test mode)
3. `npm install && npm start`
4. Open `http://localhost:4242/sales/cashflow_kit.html` (or any row in the table above)

Live checkout still blocked until real Stripe Price IDs are set locally — this repo ships placeholders only.
