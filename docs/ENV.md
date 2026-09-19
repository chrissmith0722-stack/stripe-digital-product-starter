# Environment variables

Copy `.env.example` → `.env`. **Never commit secrets.** Use Stripe **test** values until you deliberately go live.

| Variable | Required | Example / notes |
|----------|----------|-----------------|
| `STRIPE_SECRET_KEY` | Yes | `sk_test_…` for local/test. Rejected if it still contains `replace_me`. |
| `STRIPE_PRICE_CASHFLOW_KIT` | Yes | Stripe Price ID for Cashflow Kit ($19). |
| `STRIPE_PRICE_INVOICE_PACK` | Yes | Price ID for Invoice Pack ($12). |
| `STRIPE_PRICE_FINANCE_BUNDLE` | Yes | Price ID for Finance Starter Bundle ($27). |
| `STRIPE_PRICE_CLIENT_OPS_KIT` | Yes | Price ID for Freelancer Client Ops Kit ($29). |
| `STRIPE_PRICE_GMAIL_EXPENSE_DIGEST` | Yes | Price ID for Gmail Expense Digest ($19). |
| `PORT` | No | Default `4242`. |
| `PRODUCTS_DIR` | No | Default `./products`. Must contain `catalog.json` and `files/`. |
| `SUCCESS_URL` | No | Must include `{CHECKOUT_SESSION_ID}`. |
| `CANCEL_URL` | No | Default `http://localhost:4242/`. |

## Catalog ↔ env mapping

| Product `id` | `stripe_price_env` | Display price (USD) |
|--------------|--------------------|---------------------|
| `cashflow_kit` | `STRIPE_PRICE_CASHFLOW_KIT` | 19 |
| `invoice_pack` | `STRIPE_PRICE_INVOICE_PACK` | 12 |
| `finance_bundle` | `STRIPE_PRICE_FINANCE_BUNDLE` | 27 |
| `client_ops_kit` | `STRIPE_PRICE_CLIENT_OPS_KIT` | 29 |
| `gmail_expense_digest` | `STRIPE_PRICE_GMAIL_EXPENSE_DIGEST` | 19 |

No live Price IDs are published in this repository.
