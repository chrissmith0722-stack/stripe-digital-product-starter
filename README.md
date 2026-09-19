# stripe-digital-product-starter

Minimal Node/Express app to sell one digital product with Stripe Checkout, then hand the buyer a license key.

Built to sit next to marketplace kits (Gumroad/Etsy) when you want your own checkout page.

## Quick start

```bash
cp .env.example .env
npm install
npm start
```

Open http://localhost:4242 — click Buy, complete Stripe **test** checkout, get a license key on success.

## Setup

1. Create a [Stripe](https://stripe.com) account
2. Create a Product + Price in **test mode**; copy the Price ID (`price_...`)
3. Put `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` in `.env` (see `.env.example`)
4. For live sales, switch to live keys and set `SUCCESS_URL` / `CANCEL_URL` to your HTTPS domain

## What's included

- `GET /` — simple buy page
- `POST /create-checkout-session` — Stripe Checkout
- `GET /success` — issues a one-time license key (stored in `data/licenses.json`, gitignored)
- `GET /download` — gate: valid key required (demo payload via `DOWNLOAD_PAYLOAD`)

## Production caveats (read before going live)

- License minting on `/success` is fine for demos; for real sales prefer a **Stripe webhook** (`checkout.session.completed`) so keys are issued even if the buyer closes the browser.
- Serve over HTTPS; never commit `.env` or `data/licenses.json`.
- Replace `DOWNLOAD_PAYLOAD` with a signed URL, file stream, or email delivery step.

## Roadmap toward revenue-ready

1. Add webhook handler + idempotent license issuance.
2. Email the license key (Resend/Postmark) instead of only showing it once on `/success`.
3. Deploy (Railway/Fly/Render), point a domain, flip to live Stripe keys, run one paid test purchase.

## Money angle

Use this as the checkout layer for PDFs, templates, or tools you sell on your own site. Pair with marketplace listings for traffic.

## License

MIT — see [LICENSE](LICENSE).
