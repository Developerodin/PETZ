# PETZ Next.js app

Next.js conversion of the static HTML site in [`../petz.love`](../petz.love). The original HTML frontend is unchanged.

## Run locally

```bash
cd frontend/petz-next
npm install
cp .env.example .env.local
# Edit .env.local — MongoDB URI, AUTH_SECRET, Google OAuth credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend (included)

Full-stack features live in this Next.js app:

| Feature | Route / notes |
|---------|----------------|
| **Google sign-in** | Auth.js v5 — `/login`, `/account` |
| **MongoDB** | Users (via Auth adapter), pets, assessments, waitlist, partners, support, newsletter |
| **Assessment API** | `POST /api/assessments` — saves submission + score; links pet profile when signed in |
| **Pet profiles** | `GET/POST /api/pets` — up to 2 pets per user |
| **Forms** | `POST /api/waitlist`, `/api/partners`, `/api/support`, `/api/newsletter` |

### Google OAuth setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Configure **OAuth consent screen** (External, add your email as test user while in testing).
3. Create **OAuth 2.0 Client ID** (Web application).
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret into `.env.local`.

### MongoDB setup

Use [MongoDB Atlas](https://www.mongodb.com/atlas) free tier or a local MongoDB instance. Set `MONGODB_URI` in `.env.local`.

Auth.js stores users/sessions in MongoDB via `@auth/mongodb-adapter`. Application data uses Mongoose models in `models/`.

## What’s included (frontend)

- All marketing and tool pages from the HTML site
- Existing CSS and images
- Client-side behaviour (nav, reveals, carousels, assessment wizard, demo chat, forms wired to API)

## Not yet implemented

- OpenAI / ChatGPT streaming (symptom checker, AI scoring)
- Stripe payments
- File uploads (pet photos, records)
- Admin / vet dashboards
