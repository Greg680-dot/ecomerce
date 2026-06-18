---
name: run-and-test
description: How to run, lint, and test the ElektroMarket app (Laravel backend + React/Vite frontend), including the register/login end-to-end flow.
---

# Run & test ElektroMarket

Monorepo:
- `elektromarket-backend` — Laravel 13, **PHP 8.4** required (lockfile pins Laravel 13 / Symfony 8.1), sqlite by default.
- `elektromarket-frontend` — React 19 + TypeScript + Vite.

## Backend
```bash
cd elektromarket-backend
composer install
cp -n .env.example .env && php artisan key:generate
touch database/database.sqlite && php artisan migrate --force
php artisan serve            # http://localhost:8000  (API prefix /api/v1)
```
Lint/format: `./vendor/bin/pint` (use `--test` to check only). Tests: `php artisan test`.

## Frontend
```bash
cd elektromarket-frontend
npm install
npm run dev                  # http://localhost:5173
```
Lint: `npm run lint`. Typecheck/build: `npm run build` (runs `tsc -b` then `vite build`).
API base URL: `import.meta.env.VITE_API_URL` (defaults to `http://localhost:8000/api/v1`).

## Auth contract (Sanctum, token-based)
- `POST /api/v1/auth/register` requires `{ name, email, password, password_confirmation }` (optional `phone`).
- `POST /api/v1/auth/login` requires `{ email, password }`.
- Both return a flat `{ message, user, token }` (NOT wrapped in `data`, no refresh token).
- Frontend stores the token in `localStorage.accessToken` and sends it as `Authorization: Bearer`.
- `UserRole` enum values: `admin`, `customer`, `b2b`.

## E2E auth smoke test (UI)
1. Register at `/registrieren` → should redirect to `/konto` and show `Hallo, <Vorname>!`.
2. Log out (user menu top-right → Abmelden), log in at `/anmelden` → redirect to `/konto`.
3. Wrong password at `/anmelden` → stays on page with red banner `Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.` (backend returns 422).

Default CORS allows `api/*` from any origin, so the :5173 frontend can call the :8000 backend with bearer tokens out of the box.
