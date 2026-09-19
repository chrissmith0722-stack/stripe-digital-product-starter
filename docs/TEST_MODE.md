# Test mode checklist (4 products)

1. `cp .env.example .env` and set `STRIPE_SECRET_KEY` (test) plus:
   - `STRIPE_PRICE_CASHFLOW_KIT`
   - `STRIPE_PRICE_INVOICE_PACK`
   - `STRIPE_PRICE_FINANCE_BUNDLE`
   - `STRIPE_PRICE_CLIENT_OPS_KIT`
2. Put zips in `products/files/` matching `products/catalog.json`
3. `npm install && npm start`
4. Open each sales page and complete a **test card** purchase:
   - `/sales/cashflow_kit.html` → `/buy/cashflow_kit`
   - `/sales/invoice_pack.html`
   - `/sales/finance_bundle.html`
   - `/sales/client_ops_kit.html`
5. Confirm success page shows a license key and `/download` returns the zip
6. Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC

Do not use live keys until one clean test-mode purchase works per SKU.
