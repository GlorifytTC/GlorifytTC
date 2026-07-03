# GlorifyTC Email Bot — Complete Setup Guide

## Project Structure
```
glorifytc/
├── frontend/
│   ├── emailbot.html      ← Public page (drop into your website)
│   └── dashboard.html     ← Customer dashboard (drop into your website)
└── backend/
    ├── main.py            ← FastAPI server
    ├── requirements.txt
    └── .env.example       ← Copy to .env and fill in
```

---

## STEP 1 — PostgreSQL
Install PostgreSQL from https://www.postgresql.org/download/windows/

```sql
-- In pgAdmin or psql:
CREATE DATABASE glorifytc;
```

---

## STEP 2 — Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Copy env and fill it in
copy .env.example .env
# Edit .env with your values

# Start
uvicorn main:app --reload --port 8000
```

---

## STEP 3 — Stripe Setup
1. Create account at https://stripe.com
2. Go to Dashboard → Products → Create product
3. Create 3 products: Small, Medium, Large
4. For each product, create prices in all 4 currencies:
   - SEK: 500 / 1500 / 4000
   - NOK: 525 / 1575 / 4200   (adjust to market)
   - EUR: 45 / 135 / 360
   - DKK: 330 / 990 / 2640
5. Copy each Price ID (price_xxx) into your .env
6. Set up webhook:
   - Go to Developers → Webhooks → Add endpoint
   - URL: https://yourdomain.com/api/stripe-webhook
   - Events: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed
   - Copy webhook secret to .env

---

## STEP 4 — Cloudflare Tunnel (expose your PC)
Download cloudflared: https://github.com/cloudflare/cloudflared/releases

```bash
cloudflared tunnel login
cloudflared tunnel create glorifytc-api
cloudflared tunnel route dns glorifytc-api api.yourdomain.com
cloudflared tunnel run glorifytc-api
```

Then in emailbot.html and dashboard.html, change:
```js
const API = 'http://localhost:8000';
// to:
const API = 'https://api.yourdomain.com';
```

---

## STEP 5 — Deploy Frontend to Vercel
```bash
npm i -g vercel
cd frontend
vercel
```
Or just drag and drop the frontend folder at vercel.com

---

## STEP 6 — Auto-start on Windows
Create a file `start-glorifytc.bat`:
```bat
@echo off
cd C:\path\to\glorifytc\backend
start "" uvicorn main:app --port 8000
start "" cloudflared tunnel run glorifytc-api
```
Add it to Windows startup folder:
Win+R → shell:startup → paste shortcut there

---

## How Stripe Prices Work Per Language
The frontend auto-detects the user's language and sets the currency:
- 🇸🇪 Swedish  → SEK
- 🇳🇴 Norwegian → NOK
- 🇫🇮 Finnish  → EUR
- 🇩🇰 Danish   → DKK
- 🇬🇧 English  → SEK (default)
- 🇩🇪 German   → EUR

Live exchange rates are fetched from open.er-api.com on page load.
When user clicks "Get Started" → Stripe checkout opens in their currency.

---

## Security Notes
- Passwords hashed with bcrypt (rounds=12)
- JWT tokens expire in 24 hours
- All API endpoints require valid token except /register and /login
- Change JWT_SECRET to a long random string before going live
