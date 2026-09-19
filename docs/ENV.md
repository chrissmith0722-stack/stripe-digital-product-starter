# Environment variables

| Variable | Required | Purpose |
|----------|----------|--------|
| `STRIPE_SECRET_KEY` | yes | Stripe secret (`sk_test_…` or `sk_live_…`) |
| `STRIPE_PRICE_CASHFLOW_KIT` | yes | Price ID for Cashflow Kit ($19) |
| `STRIPE_PRICE_INVOICE_PACK` | yes | Price ID for Invoice Pack ($12) |
| `STRIPE_PRICE_FINANCE_BUNDLE` | yes | Price ID for Finance Bundle ($27) |
| `STRIPE_PRICE_CLIENT_OPS_KIT` | yes | Price ID for Client Ops Kit ($29) |
| `PORT` | no | Default `4242` |
| `PRODUCTS_DIR` | no | Default `./products` |
| `SUCCESS_URL` | no | Must include `{CHECKOUT_SESSION_ID}` |
| `CANCEL_URL` | no | Defaults to matching sales page when using `/buy/:id` |

Never commit `.env` or buyer zips to a public repo.
