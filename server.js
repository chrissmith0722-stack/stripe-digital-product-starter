require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Stripe = require("stripe");

const app = express();
const port = process.env.PORT || 4242;
const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const priceId = process.env.STRIPE_PRICE_ID || "";
const licensesPath = path.join(__dirname, "data", "licenses.json");

function isPlaceholder(value) {
  return !value || value.includes("replace_me");
}

const stripeConfigured = !isPlaceholder(stripeSecret) && !isPlaceholder(priceId);

if (!stripeConfigured) {
  console.warn(
    "Missing STRIPE_SECRET_KEY / STRIPE_PRICE_ID. Copy .env.example to .env and fill Stripe test-mode values."
  );
}

const stripe = stripeConfigured ? new Stripe(stripeSecret) : null;

function ensureLicensesFile() {
  const dir = path.dirname(licensesPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(licensesPath)) {
    fs.writeFileSync(licensesPath, JSON.stringify({ keys: [] }, null, 2));
  }
}

function readLicenses() {
  ensureLicensesFile();
  return JSON.parse(fs.readFileSync(licensesPath, "utf8"));
}

function writeLicenses(data) {
  ensureLicensesFile();
  fs.writeFileSync(licensesPath, JSON.stringify(data, null, 2));
}

function mintLicenseKey() {
  return "LIC-" + crypto.randomBytes(8).toString("hex").toUpperCase();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    stripeConfigured,
    modeHint: stripeSecret.startsWith("sk_live")
      ? "live"
      : stripeSecret.startsWith("sk_test")
        ? "test"
        : "unknown",
  });
});

app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Buy digital product</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 32rem; margin: 3rem auto; padding: 0 1rem; }
    button { font-size: 1rem; padding: 0.75rem 1.25rem; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Digital product</h1>
  <p>One-click Stripe Checkout. After payment you get a license key for download.</p>
  <form action="/create-checkout-session" method="POST">
    <button type="submit">Buy with Stripe</button>
  </form>
</body>
</html>`);
});

app.post("/create-checkout-session", async (_req, res) => {
  if (!stripe) {
    return res
      .status(500)
      .send("Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in .env");
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        process.env.SUCCESS_URL ||
        `http://localhost:${port}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.CANCEL_URL || `http://localhost:${port}/`,
    });
    res.redirect(303, session.url);
  } catch (err) {
    console.error(err);
    res.status(500).send(String(err.message || err));
  }
});

app.get("/success", async (req, res) => {
  if (!stripe) {
    return res.status(500).send("Stripe is not configured.");
  }
  const sessionId = req.query.session_id;
  if (!sessionId) return res.status(400).send("Missing session_id");

  try {
    const session = await stripe.checkout.sessions.retrieve(String(sessionId));
    if (session.payment_status !== "paid") {
      return res.status(402).send("Payment not completed.");
    }

    const store = readLicenses();
    let existing = store.keys.find((k) => k.sessionId === session.id);
    if (!existing) {
      existing = {
        key: mintLicenseKey(),
        sessionId: session.id,
        email: session.customer_details?.email || null,
        createdAt: new Date().toISOString(),
      };
      store.keys.push(existing);
      writeLicenses(store);
    }

    const safeKey = escapeHtml(existing.key);
    res.type("html").send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Purchase complete</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 32rem; margin: 3rem auto; padding: 0 1rem; }
    code { background: #f3f3f3; padding: 0.2rem 0.4rem; }
  </style>
</head>
<body>
  <h1>You're in</h1>
  <p>License key: <code>${safeKey}</code></p>
  <p><a href="/download?key=${encodeURIComponent(existing.key)}">Download</a></p>
</body>
</html>`);
  } catch (err) {
    console.error(err);
    res.status(500).send(String(err.message || err));
  }
});

app.get("/download", (req, res) => {
  const key = String(req.query.key || "");
  const store = readLicenses();
  const hit = store.keys.find((k) => k.key === key);
  if (!hit) return res.status(403).send("Invalid license key.");
  res
    .type("text")
    .send(
      process.env.DOWNLOAD_PAYLOAD ||
        "Thanks for buying. Replace DOWNLOAD_PAYLOAD with your file URL or content."
    );
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
  if (!stripeConfigured) {
    console.log("Smoke tip: GET /health should report stripeConfigured:false until .env is filled.");
  }
});
