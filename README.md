# stripe-digital-product-starter (multi-product)

Stripe Checkout for three digital SKUs → license key → zip download.

## Products

| id | name | price |
|----|------|------:|
| cashflow_kit | Solo Freelancer Cashflow Kit | $19 |
| invoice_pack | Invoice + Reminder Pack | $12 |
| finance_bundle | Finance Starter Bundle | $27 |

## Setup

1. Put buyer zips in `products/files/` (`cashflow_kit.zip`, `invoice_pack.zip`, `finance_bundle.zip`)
2. `cp .env.example .env` and fill Stripe test secret + three Price IDs
3. `npm install && npm start`
4. Open http://localhost:4242

## Security

Do not commit buyer zips to a public repo. Point `PRODUCTS_DIR` at a private folder (on this machine: `/workspace/stripe-shop/products`).

## Production caveats

- Prefer minting licenses on Stripe `checkout.session.completed` webhooks, not only `/success`
- Email the license key so buyers who close the tab still get fulfillment
