require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Stripe = require("stripe");

const app = express();
const port = process.env.PORT || 4242;
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const productsDir = process.env.PRODUCTS_DIR || path.join(__dirname, "products");
const catalogPath = path.join(productsDir, "catalog.json");
const filesDir = path.join(productsDir, "files");
const licensesPath = path.join(__dirname, "data", "licenses.json");

const stripe =
  stripeSecret && !String(stripeSecret).includes("replace_me")
    ? new Stripe(stripeSecret)
    : null;

function loadCatalog() {
  return JSON.parse(fs.readFileSync(catalogPath, "utf8"));
}

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

function productPriceId(product) {
  return process.env[product.stripe_price_env] || null;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/", (_req, res) => {
  const catalog = loadCatalog();
  const cards = catalog
    .map(
      (p) => `<article style="border:1px solid #ddd;padding:1rem;margin:1rem 0;border-radius:8px;">
  <h2>${escapeHtml(p.name)}</h2>
  <p>${escapeHtml(p.blurb)}</p>
  <p><strong>$${p.price_usd}</strong></p>
  <form action="/create-checkout-session" method="POST">
    <input type="hidden" name="product_id" value="${escapeHtml(p.id)}" />
    <button type="submit">Buy with Stripe</button>
  </form>
</article>`
    )
    .join("\n");
  res.type("html").send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Digital products</title>
<style>body{font-family:system-ui,sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem}button{font-size:1rem;padding:.75rem 1.25rem;cursor:pointer}</style>
</head><body>
<h1>Digital products</h1>
<p>Stripe Checkout → license key → download zip.</p>
${cards}
</body></html>`);
});

app.post("/create-checkout-session", async (req, res) => {
  if (!stripe) {
    return res
      .status(500)
      .send("Stripe is not configured. Set STRIPE_SECRET_KEY and price IDs in .env");
  }
  const catalog = loadCatalog();
  const product = catalog.find((p) => p.id === req.body.product_id);
  if (!product) return res.status(400).send("Unknown product");
  const priceId = productPriceId(product);
  if (!priceId || String(priceId).includes("replace_me")) {
    return res.status(500).send(`Missing price id env ${product.stripe_price_env}`);
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { product_id: product.id },
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
  if (!stripe) return res.status(500).send("Stripe is not configured.");
  const sessionId = req.query.session_id;
  if (!sessionId) return res.status(400).send("Missing session_id");
  try {
    const session = await stripe.checkout.sessions.retrieve(String(sessionId));
    if (session.payment_status !== "paid") {
      return res.status(402).send("Payment not completed.");
    }
    const productId = session.metadata?.product_id;
    const catalog = loadCatalog();
    const product = catalog.find((p) => p.id === productId);
    if (!product) return res.status(500).send("Paid session missing product metadata");

    const store = readLicenses();
    let existing = store.keys.find((k) => k.sessionId === session.id);
    if (!existing) {
      existing = {
        key: mintLicenseKey(),
        sessionId: session.id,
        productId: product.id,
        email: session.customer_details?.email || null,
        createdAt: new Date().toISOString(),
      };
      store.keys.push(existing);
      writeLicenses(store);
    }

    res.type("html").send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><title>Purchase complete</title>
<style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1rem}code{background:#f3f3f3;padding:.2rem .4rem}</style>
</head><body>
<h1>You're in</h1>
<p>${escapeHtml(product.name)}</p>
<p>License key: <code>${escapeHtml(existing.key)}</code></p>
<p><a href="/download?key=${encodeURIComponent(existing.key)}">Download zip</a></p>
</body></html>`);
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
  const catalog = loadCatalog();
  const product = catalog.find((p) => p.id === hit.productId);
  if (!product) return res.status(500).send("License product missing");
  const filePath = path.join(filesDir, product.file);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`File missing on server: ${product.file}`);
  }
  res.download(filePath, product.file);
});

app.listen(port, () => {
  console.log(`Multi-product shop on http://localhost:${port}`);
  console.log(`Products dir: ${productsDir}`);
});
