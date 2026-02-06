# Build Bakery Tracker From Scratch (Step by Step)

This guide explains exactly how to rebuild this project while learning **React + JavaScript** for frontend, and **Node/Express + PostgreSQL** for backend.

## 0) Final tech choices (and why)

- **Frontend:** React + Vite + JavaScript
  - Fast feedback loop and simple DX.
  - Great for portfolio and React interviews.
- **Backend:** Express (Node.js)
  - Straightforward REST architecture.
  - Easy to evolve into modular services.
- **Database:** PostgreSQL + Drizzle ORM
  - Strong relational model for recipes/ingredients/inventory.
  - Drizzle gives explicit schema + migrations.
- **Validation:** Zod
  - Shared validation between API contract and UI forms.

---

## 1) Folder structure and why

```txt
client/
  src/
    components/      # Reusable UI and layout
    hooks/           # API and state hooks
    pages/           # Route-level screens
    lib/             # query client, utilities
server/
  routes/
    modules/         # Feature-based route registration
  index.ts           # Express bootstrap + middleware
  storage.ts         # Data access layer (DB calls)
shared/
  schema.ts          # Drizzle schema + zod inserts
  routes.ts          # API contract shared by FE + BE
docs/
  BUILD_FROM_SCRATCH.md
```

### Why this division works

- `client` only handles rendering and user interactions.
- `server` only handles HTTP + business/data orchestration.
- `shared` prevents mismatch between frontend expectations and backend responses.
- `docs` makes onboarding and self-study explicit.

---

## 2) Backend lifecycle (how it behaves)

1. `server/index.ts` starts Express.
2. JSON and URL-encoded middleware parse request data.
3. A logging middleware tracks API request duration.
4. `registerRoutes` mounts all domain routes.
5. Environment controls behavior:
   - `DATABASE_URL` connects PostgreSQL.
   - `SEED_ON_BOOT=true` seeds demo data.
6. Production serves built static frontend; dev uses Vite middleware.

### Why modular routes

Each domain is in its own module:
- `ingredients.ts`
- `recipes.ts`
- `inventory.ts`

Benefits:
- Smaller files.
- Easier testing.
- New teammate can learn one domain at a time.

---

## 3) How to modify backend safely

### Add a new endpoint (example: low-stock ingredients)

1. Add contract in `shared/routes.ts`.
2. Add query in `server/storage.ts`.
3. Register endpoint in `server/routes/modules/ingredients.ts`.
4. Add frontend hook in `client/src/hooks`.
5. Render in a page card/table.

This sequence avoids frontend/backend mismatch.

---

## 4) How to modify frontend safely

### Add a new page (example: Alerts)

1. Create `client/src/pages/Alerts.jsx`.
2. Add route in `client/src/App.jsx`.
3. Add sidebar nav item in `client/src/components/layout/Sidebar.jsx`.
4. Add API hook if needed in `client/src/hooks`.

### Styling pattern

- Keep layout components (`Sidebar`, headers) reusable.
- Keep domain components dumb and data injected from hooks.
- Prefer smaller components over very large pages.

---

## 5) How to scale this app

### App scaling

- Add auth (owner/staff roles).
- Add optimistic updates for inventory changes.
- Add pagination/filtering for large ingredient tables.
- Add audit logs for critical stock/price edits.

### Backend scaling

- Introduce service layer between routes and storage.
- Add Redis caching for heavy read endpoints.
- Add background jobs for reports and forecasting.
- Containerize (`Docker`) and run behind reverse proxy.

### Database scaling

- Add indexes (`name`, `location`, `updated_at`).
- Use migrations for all schema updates.
- Archive historical logs to separate tables.

---

## 6) Local development steps

```bash
npm install
# Optional demo seed
SEED_ON_BOOT=true DATABASE_URL=postgres://... npm run dev
```

For prod build:

```bash
npm run build
npm start
```

---

## 7) Learning roadmap (React job-focused)

1. Master hooks (`useState`, `useEffect`, custom hooks).
2. Master forms + validation (`react-hook-form` + zod).
3. Master server state (`react-query` patterns).
4. Learn component architecture and accessibility.
5. Add test coverage and CI as portfolio proof.

