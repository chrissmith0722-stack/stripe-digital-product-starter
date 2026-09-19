# stripe-digital-product-starter

Minimal Node/Express app to sell one digital product with Stripe Checkout, then hand the buyer a license key.

Built to sit next to marketplace kits (Gumroad/Etsy) when you want your own checkout page.

## Quick start

```bash
cp .env.example .env
npm install
npm start
```

Open http://localhost:4242 — click Buy, complete Stripe test checkout, get a license key on success.

## Setup

1. Create a [Stripe](https://stripe.com) account
2. Create a Product + Price in **test mode**; copy the Price ID (`price_...`)
3. Put `STRIPE_SECRET_KEY` (`sk_test_...`) and `STRIPE_PRICE_ID` in `.env`
4. For live sales, switch to live keys and set `SUCCESS_URL` / `CANCEL_URL` to your domain

## Test-mode smoke note

Before taking real money:

1. Keep `STRIPE_SECRET_KEY` as a **test** key (`sk_test_...`).
2. Start the server: `npm start`.
3. Hit `GET /health` — expect `{"ok":true,"stripeConfigured":true,"modeHint":"test"}`.
4. Open http://localhost:4242, click **Buy with Stripe**, pay with a [Stripe test card](https://docs.stripe.com/testing#cards) (e.g. `4242 4242 4242 4242`).
5. Confirm `/success` shows a `LIC-...` key and `/download?key=...` returns your payload.
6. Confirm `data/licenses.json` was created locally and is **not** committed (see `.gitignore`).

If keys still say `replace_me`, `/health` reports `stripeConfigured:false` and checkout returns a clear 500 — the app will not call Stripe with placeholders.

## USAGE

| Route | Purpose |
| --- | --- |
| `GET /` | Buy page |
| `POST /create-checkout-session` | Creates Stripe Checkout session |
| `GET /success?session_id=...` | Issues (or reuses) a license key after paid status |
| `GET /download?key=...` | License gate; returns `DOWNLOAD_PAYLOAD` |
| `GET /health` | Config smoke check (no secrets echoed) |

Env vars are documented in `.env.example`. License keys live in `data/licenses.json` (gitignored).

## What’s included

- Express + Stripe Checkout for one Price ID
- One-time license mint per Checkout session
- Simple download gate for a digital payload string/URL

## Money angle

Use this as the checkout layer for PDFs, templates, or tools you sell on your own site. Pair with marketplace listings for traffic.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, secrets hygiene, and PR expectations.
