# Bakery Tracker

A bakery operations app for:

- inventory management (fridge/freezer/shelf),
- ingredient price + stock tracking,
- recipe food-cost calculations.

## Stack

- Frontend: **React + JavaScript + Vite**
- Backend: **Node.js + Express**
- Database: **PostgreSQL + Drizzle ORM**
- Validation: **Zod**

## Project structure

- `client/` → frontend app
- `server/` → API and server bootstrap
- `server/routes/modules/` → feature-based route modules
- `shared/` → shared schema + API contract
- `docs/` → step-by-step learning and architecture docs

## Run

```bash
npm install
npm run dev
```

### Environment

- `DATABASE_URL` (required)
- `SEED_ON_BOOT=true` (optional demo data seed)

## Learn the project from scratch

Read: [`docs/BUILD_FROM_SCRATCH.md`](docs/BUILD_FROM_SCRATCH.md)

It explains:
- why folders are organized this way,
- how backend behavior works,
- how to modify frontend/backend safely,
- and how to scale the app.
