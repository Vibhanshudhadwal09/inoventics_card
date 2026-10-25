# Inoventics — Digital Business Card

Two separate pages:

| URL | Purpose |
|-----|---------|
| `/` | Public website (digital visiting card) |
| `/admin` | Admin panel (login required) |
| `/admin/login` | Admin sign-in |

Default login (change in `.env`):

- Username: `admin`
- Password: `inoventics2026`

Changes saved in admin are stored in `localStorage` and shown on the public site.

## Run locally

```bash
npm install
npm run dev
```

- Public site: http://localhost:5173/
- Admin: http://localhost:5173/admin

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel (one project)

You do **not** need two deployments. Admin and public share one app:

| Path | Page |
|------|------|
| `https://your-domain.vercel.app/` | Public website |
| `https://your-domain.vercel.app/admin` | Admin (login required) |
| `https://your-domain.vercel.app/admin/login` | Login |

### Steps

1. Push this repo to GitHub (or GitLab / Bitbucket).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework preset: **Vite** (Vercel usually detects this).
4. Build settings (defaults are fine):
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. In **Environment Variables**, add:
   - `VITE_ADMIN_USERNAME` = your admin username
   - `VITE_ADMIN_PASSWORD` = a strong password
6. Deploy.

`vercel.json` already rewrites all routes to `index.html` so `/admin` works on refresh.

### After deploy

- Change the default password — do not keep `inoventics2026` in production.
- Public visitors only need `/`.
- You open `/admin` to edit; click **Open Website** to view `/`.
