# Test-mode checkout (4 products)

Use **Stripe test mode** only. Do not put live secret keys or live Price IDs in this repo.

## Prerequisites

1. Stripe account with **Test mode** toggled on.
2. Node 18+ and this repo cloned.
3. Buyer zips present under `products/files/`:
   - `cashflow_kit.zip`
   - `invoice_pack.zip`
   - `finance_bundle.zip`
   - `client_ops_kit.zip`
4. Four **test** Prices created in Stripe Dashboard (Products → Add product → one-time price), matching catalog amounts:
   - Solo Freelancer Cashflow Kit → **$19.00**
   - Invoice + Reminder Pack → **$12.00**
   - Finance Starter Bundle → **$27.00**
   - Freelancer Client Ops Kit → **$29.00**

Copy each Price ID (`price_…`) into `.env` (see [ENV.md](./ENV.md)). Never commit `.env`.

## Step-by-step

### 1. Configure env

```bash
cp .env.example .env
```

Set at minimum:

- `STRIPE_SECRET_KEY` = `sk_test_…` (test secret)
- `STRIPE_PRICE_CASHFLOW_KIT`
- `STRIPE_PRICE_INVOICE_PACK`
- `STRIPE_PRICE_FINANCE_BUNDLE`
- `STRIPE_PRICE_CLIENT_OPS_KIT`

Leave `PORT=4242` unless you need another port. Keep `SUCCESS_URL` / `CANCEL_URL` pointing at localhost for local runs.

### 2. Install and start

```bash
npm install
npm start
```

You should see: `Multi-product shop on http://localhost:4242`.

### 3. Open each sales page

| Product | Sales page | Buy route |
|---------|------------|-----------|
| Cashflow Kit ($19) | http://localhost:4242/sales/cashflow_kit.html | `/buy/cashflow_kit` |
| Invoice Pack ($12) | http://localhost:4242/sales/invoice_pack.html | `/buy/invoice_pack` |
| Finance Bundle ($27) | http://localhost:4242/sales/finance_bundle.html | `/buy/finance_bundle` |
| Client Ops Kit ($29) | http://localhost:4242/sales/client_ops_kit.html | `/buy/client_ops_kit` |

Or use the index at http://localhost:4242/ and click **Buy with Stripe**.

### 4. Complete a test Checkout

1. Click the CTA on a sales page (or Buy on `/`).
2. Stripe Checkout opens in test mode.
3. Pay with a [Stripe test card](https://stripe.com/docs/testing), e.g.:
   - Card: `4242 4242 4242 4242`
   - Expiry: any future date
   - CVC: any 3 digits
   - ZIP: any
4. After success you land on `/success?session_id=…` with a **license key** (`LIC-…`).
5. Click **Download zip** — the matching file from `products/files/` should download.

Repeat for all four product IDs so each Price ID is verified.

### 5. Cancel path

From Checkout, click back/cancel. You should return to the product sales page (or `CANCEL_URL` if overridden).

### 6. Smoke checks

- `GET /health` → `{"ok":true}`
- Missing/`replace_me` price → server responds with a clear error naming the env var
- Invalid license on `/download?key=…` → 403
- Missing zip on disk → 404 with filename

## What this does *not* cover

- Live (`sk_live_`) keys or live Prices — out of scope for overnight work.
- Webhooks — success path uses Checkout Session retrieve on return URL.
- Tax/shipping — digital one-time payment only.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| “Stripe is not configured” | Set real `sk_test_…` (not `replace_me`) |
| “Missing price id env …” | Fill that product’s `STRIPE_PRICE_*` |
| File missing on download | Place zip in `products/files/` with the name in `catalog.json` |
| Wrong product after pay | Confirm Checkout `metadata.product_id` matches catalog `id` |
