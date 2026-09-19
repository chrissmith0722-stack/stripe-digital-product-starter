# Environment variables

Copy `.env.example` → `.env`. **Never commit secrets.** Use Stripe **test** values until you deliberately go live.

| Variable | Required | Example / notes |
|----------|----------|-----------------|
| `STRIPE_SECRET_KEY` | Yes | `sk_test_…` for local/test. Rejected if it still contains `replace_me`. |
| `STRIPE_PRICE_CASHFLOW_KIT` | Yes | Stripe Price ID for Cashflow Kit ($19). Env name must match `catalog.json` → `stripe_price_env`. |
| `STRIPE_PRICE_INVOICE_PACK` | Yes | Price ID for Invoice Pack ($12). |
| `STRIPE_PRICE_FINANCE_BUNDLE` | Yes | Price ID for Finance Starter Bundle ($27). |
| `STRIPE_PRICE_CLIENT_OPS_KIT` | Yes | Price ID for Freelancer Client Ops Kit ($29). |
| `PORT` | No | Default `4242`. |
| `PRODUCTS_DIR` | No | Default `./products`. Must contain `catalog.json` and `files/`. |
| `SUCCESS_URL` | No | Default `http://localhost:4242/success?session_id={CHECKOUT_SESSION_ID}`. Must include `{CHECKOUT_SESSION_ID}`. |
| `CANCEL_URL` | No | Default `http://localhost:4242/`. Per-checkout cancel can also return to `/sales/<id>.html` when unset in session create fallback. |

## Catalog ↔ env mapping

From `products/catalog.json`:

| Product `id` | `stripe_price_env` | Display price (USD) |
|--------------|--------------------|---------------------|
| `cashflow_kit` | `STRIPE_PRICE_CASHFLOW_KIT` | 19 |
| `invoice_pack` | `STRIPE_PRICE_INVOICE_PACK` | 12 |
| `finance_bundle` | `STRIPE_PRICE_FINANCE_BUNDLE` | 27 |
| `client_ops_kit` | `STRIPE_PRICE_CLIENT_OPS_KIT` | 29 |

Server reads `process.env[product.stripe_price_env]` when starting Checkout. Amounts charged come from the Stripe Price object, not from `price_usd` in the catalog (catalog price is for display only).

## `.env.example` (reference)

```
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_PRICE_CASHFLOW_KIT=price_replace_me
STRIPE_PRICE_INVOICE_PACK=price_replace_me
STRIPE_PRICE_FINANCE_BUNDLE=price_replace_me
STRIPE_PRICE_CLIENT_OPS_KIT=price_replace_me
PORT=4242
PRODUCTS_DIR=./products
SUCCESS_URL=http://localhost:4242/success?session_id={CHECKOUT_SESSION_ID}
CANCEL_URL=http://localhost:4242/
```

No live Price IDs are published in this repository.
