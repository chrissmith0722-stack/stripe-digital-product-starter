# Seller setup guide

Clear path from clone → test sale → live. Use **Stripe test mode** until you deliberately go live.

## 1. Decide the sales channel

This starter runs **your own Stripe Checkout** (you host the storefront, Stripe hosts payment).

If you are unsure whether to sell on Gumroad instead, read [GUMROAD_VS_STRIPE_CHECKOUT.md](./GUMROAD_VS_STRIPE_CHECKOUT.md) first. Pick one primary channel per SKU to avoid split inventory and confusing refunds.

## 2. Prepare product files

1. Place buyer zips under `products/files/`.
2. Filenames must match `products/catalog.json` (today: `cashflow_kit.zip`, `invoice_pack.zip`, `finance_bundle.zip`, `client_ops_kit.zip`).
3. Keep source/working copies out of git if they contain unpublished assets you do not want public.

## 3. Create Stripe Prices (test mode)

In the [Stripe Dashboard](https://dashboard.stripe.com/) with **Test mode** on:

1. Create one Product per SKU (or one Product with multiple Prices).
2. Add a **one-time** Price matching the display amount in the catalog:
   - Cashflow Kit → $19
   - Invoice Pack → $12
   - Finance Bundle → $27
   - Client Ops Kit → $29
3. Copy each Price ID (`price_…`) — you will map them in `.env`.

The amount charged comes from the Stripe Price object, not from `price_usd` in the catalog (catalog is display-only).

## 4. Configure environment (no secrets in git)

```bash
cp .env.example .env
```

Fill only in the local `.env` file (never commit it):

| Variable | What to put |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Test secret `sk_test_…` from Developers → API keys |
| `STRIPE_PRICE_CASHFLOW_KIT` | Test Price ID for Cashflow Kit |
| `STRIPE_PRICE_INVOICE_PACK` | Test Price ID for Invoice Pack |
| `STRIPE_PRICE_FINANCE_BUNDLE` | Test Price ID for Finance Bundle |
| `STRIPE_PRICE_CLIENT_OPS_KIT` | Test Price ID for Client Ops Kit |

Placeholders like `replace_me` are rejected on purpose. Full variable list: [ENV.md](./ENV.md).

## 5. Run and verify a test purchase

```bash
npm install
npm start
```

1. Open a sales page, e.g. `http://localhost:4242/sales/cashflow_kit.html`.
2. Click buy → complete Checkout with a [Stripe test card](https://stripe.com/docs/testing) (`4242…`).
3. Confirm success page shows a `LIC-…` license key and **Download zip** works.

More detail: [TEST_MODE.md](./TEST_MODE.md).

## 6. Before going live (checklist)

- [ ] Switch Dashboard to **Live** and create live Prices (new `price_…` IDs).
- [ ] Put `sk_live_…` and live Price IDs only in the host’s secret store / env — not in git.
- [ ] Set `SUCCESS_URL` / `CANCEL_URL` to your public HTTPS origin (keep `{CHECKOUT_SESSION_ID}` in success).
- [ ] Confirm zips on the server match `catalog.json`.
- [ ] Run one real low-value purchase and a refund/cancel path smoke test.
- [ ] Plan webhooks and durable license storage if you outgrow the file-based success-return flow.

## Related docs

- [ENV.md](./ENV.md) — every environment variable
- [TEST_MODE.md](./TEST_MODE.md) — step-by-step test Checkout
- [GUMROAD_VS_STRIPE_CHECKOUT.md](./GUMROAD_VS_STRIPE_CHECKOUT.md) — channel decision
