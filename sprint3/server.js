require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mercadopago = require('mercadopago');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// configure Mercado Pago
if (process.env.MP_ACCESS_TOKEN) {
  mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static public files
const publicDir = path.join(__dirname, 'public');
app.use('/', express.static(publicDir));

// in-memory orders (demo only)
const orders = {};

app.post('/sprint3/create_preference', async (req, res) => {
  const { numero, buyerEmail, buyerName } = req.body;
  const price = 19.90;
  const external_reference = `mapa-${Date.now()}-${numero}`;

  if (!process.env.MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'MP_ACCESS_TOKEN not set in env' });
  }

  try {
    const preference = {
      items: [
        {
          title: `Mapa 2026 — Ano ${numero}`,
          quantity: 1,
          unit_price: price
        }
      ],
      payer: { email: buyerEmail, name: buyerName },
      back_urls: {
        success: `${req.protocol}://${req.get('host')}/sprint3/mapa.html?numero=${numero}&status=success&ref=${external_reference}`,
        failure: `${req.protocol}://${req.get('host')}/sprint3/convite.html?status=failure`,
        pending: `${req.protocol}://${req.get('host')}/sprint3/convite.html?status=pending`
      },
      auto_return: 'approved',
      external_reference
    };

    const mpRes = await mercadopago.preferences.create(preference);
    orders[external_reference] = { numero, buyerEmail, buyerName, preference: mpRes.body };
    return res.json({ init_point: mpRes.body.init_point, sandbox_init_point: mpRes.body.sandbox_init_point });
  } catch (err) {
    console.error('create_preference error', err);
    return res.status(500).json({ error: String(err) });
  }
});

// webhook endpoint for Mercado Pago (configure in MP dashboard)
app.post('/sprint3/webhook', async (req, res) => {
  console.log('webhook received', req.body);
  // Simple handling: if payment approved, send email with PNG link
  try {
    const topic = req.query.topic || req.body.type;
    const id = req.query.id || req.body.data && req.body.data.id;
    // For robust handling, query MP API to get payment info. Here we accept notification body.

    // Example: req.body.external_reference or other mapping
    // For demo, iterate orders and mark first match
    const foundKey = Object.keys(orders)[0];
    if (foundKey) {
      const order = orders[foundKey];
      // send email with attachment link (PNG)
      if (process.env.SMTP_HOST) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        const mapaUrl = `${req.protocol}://${req.get('host')}/exports/ano-${order.numero}.png`;
        const mail = await transporter.sendMail({
          from: process.env.FROM_EMAIL,
          to: order.buyerEmail,
          subject: 'Seu Mapa 2026',
          text: `Este é um convite para atravessar 2026 com mais consciência e menos ruído.\n\nSeu Mapa: ${mapaUrl}`,
          html: `<p>Este é um convite para atravessar 2026 com mais consciência e menos ruído.</p><p><a href="${mapaUrl}">Baixar seu Mapa</a></p>`
        });
        console.log('email sent', mail.messageId);
      }
    }
  } catch (e) { console.error(e); }
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Sprint3 server running on http://localhost:${PORT}`));
