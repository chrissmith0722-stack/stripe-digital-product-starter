# Contributing

Thanks for helping ship this starter.

## Local setup

```bash
cp .env.example .env
# fill STRIPE_SECRET_KEY (sk_test_...) and STRIPE_PRICE_ID (price_...)
npm install
npm start
```

Use Stripe **test mode** only while developing. Never commit `.env` or `data/licenses.json`.

## Secrets hygiene

- Keep live keys out of git, screenshots, and issues.
- Prefer test cards from Stripe’s docs while iterating.
- If you accidentally commit a secret, rotate it in the Stripe Dashboard immediately.

## Changes we welcome

- Clearer docs / smoke steps
- Hardening around license storage and Checkout edge cases
- Small DX fixes (scripts, health checks)

Open a PR against `main` with a short note on what you tested (`/health` + one test Checkout is enough).
