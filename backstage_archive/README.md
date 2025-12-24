Sprint 3 — Conversão & Entrega

Quick start (local, dev):

1. Install deps:

```bash
npm install
```

2. Create a `.env` in project root with:

```env
MP_ACCESS_TOKEN=your_mercadopago_access_token
MP_PUBLIC_KEY=your_mercadopago_public_key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=yourpassword
FROM_EMAIL="Mapa 2026" <no-reply@example.com>
```

3. Run server:

```bash
npm run start-sprint3
```

This server serves the minimal landing and handles preference creation for Mercado Pago (needs real keys). Webhook endpoint `/sprint3/webhook` is included for payment confirmation.

Notes:
- This is a scaffold for sprint MVP. Replace keys and SMTP with production credentials before going live.
