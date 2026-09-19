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
2. Create a Product + Price in test mode; copy the Price ID (`price_...`)
3. Put `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` in `.env`
4. For live sales, switch to live keys and set `SUCCESS_URL` / `CANCEL_URL` to your domain

## What’s included

- `GET /` — simple buy page
- `POST /create-checkout-session` — Stripe Checkout
- `GET /success` — issues a one-time license key (stored in `data/licenses.json`)
- `GET /download` — gate: valid key required (demo payload)

## Money angle

Use this as the checkout layer for PDFs, templates, or tools you sell on your own site. Pair with marketplace listings for traffic.
