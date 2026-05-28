# MangaWeb

MangaWeb is a full-stack manga reading web application built with a React/Vite frontend and an Express/PostgreSQL backend. The current repository is no longer just scaffolding: it includes a working UI shell, mock-backed catalog and reader pages, PostgreSQL schema/seed files, and partially integrated backend APIs for authentication, comments, favorites, and ratings.

This README reflects the repository state as audited on 2026-05-28.

## Audit Summary

- Frontend: React 18 + Vite + Tailwind app. `npm run build` currently succeeds.
- Backend: Express app with PostgreSQL access via `pg`. Backend files pass `node --check`, and `src/app.js` loads.
- Database: PostgreSQL schema and sample seed data exist under `backend/database`.
- Tests: no automated test suite is present.
- CI/CD: no GitHub Actions, Dockerfile, or compose setup is present.
- Current maturity: prototype / course-project stage. Several user-facing pages exist, but many still rely on mock data or `localStorage`.

## Current Implementation Status

### Implemented

- React single-page application with main layout, header, sidebar, footer, and route-based pages.
- Public pages for home, browsing, search, genre results, ranking, manga details, chapter reader, profile, favorites, history, notifications, and about.
- Mock-backed manga catalog with 10 manga, 12 genres, 5 seeded chapters, ranking data, and generated reader page images.
- PostgreSQL schema for users, manga, chapters, pages, genres, comments, reactions, ratings, notifications, favorites, library, history, and daily views.
- Seed data for users, manga, genres, chapters, ratings, favorites, reading history, comments, notifications, and daily views.
- Backend routes mounted for:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/refresh-token`
  - `POST /api/auth/update-user-access`
  - `GET /api/comments/get-comments`
  - `POST /api/comments/create-comment`
  - `POST /api/comments/delete-comment`
  - `POST /api/comments/reaction`
  - `POST /api/favorite/toggle-favorite`
  - `GET /api/favorite/check-is-favorited`
  - `GET /api/favorite/get-total-favorites/:mangaId`
  - `GET /api/favorite/get-user-favorites/:userId`
  - `POST /api/rating/submit-rating`
  - `GET /api/rating/get-rating-stats/:mangaId`

### Partially Implemented

- Authentication is wired to the backend, but token handling is inconsistent:
  - Backend login returns `accessToken` and `refreshToken`.
  - Frontend stores `data.token`, so the access token is not saved as currently written.
  - Backend auth middleware exists but is not applied to routes.
- Comments are backend-backed for reading and creation, but delete and reaction behavior need fixes:
  - Frontend sends delete data in the request body.
  - Backend reads `commentId` from `req.query`.
  - Reactions increment counters directly and do not yet use the `comment_reactions` table to enforce one reaction per user.
- Favorites and ratings are backend-backed, but endpoints trust `userId` from the request body or URL instead of deriving the user from a verified token.
- Uploader/studio flow exists in the UI, but manga creation currently writes to `localStorage`, not PostgreSQL.
- Admin pages exist as UI shells. User management uses hardcoded mock users, and comment management is a placeholder.
- Notifications and reading history are implemented with mock data and `localStorage`, not backend APIs.

### Not Yet Functional

- Backend manga route is defined in `backend/src/routes/manga.routes.js`, but it is not mounted in `backend/src/app.js`.
- `MangaController.createManga` uses status `pending`, which is not allowed by the current `manga_status` enum (`ongoing`, `completed`, `hiatus`, `cancelled`).
- Chapter creation/upload is not connected to the backend or database.
- `ChapterController` is incomplete and references `db` without importing it.
- Admin links for `/admin/mangas` and `/admin/analytics` are present in the layout but no matching routes/pages are registered.
- `frontend/src/data/axiosCilent.js` is unused and points to a Create React App-style env var and `localhost:3001`.
- `backend/src/services/view.cache.js` is unused by the current server.

## Tech Stack

### Frontend

- React 18
- Vite 5
- React Router 7
- Tailwind CSS 3
- Axios and Fetch-based API helpers
- React Hot Toast
- React Icons

### Backend

- Node.js
- Express 4
- PostgreSQL via `pg`
- `bcrypt` for password hashing
- `jsonwebtoken` for JWT creation and verification
- `dotenv` for configuration
- `nodemon` for development

## Repository Structure

```text
Project1-MangaWeb/
|-- backend/
|   |-- database/
|   |   |-- schema.sql
|   |   `-- data.sql
|   |-- scripts/
|   |   `-- generate-hash.js
|   |-- src/
|   |   |-- config/
|   |   |   |-- db.js
|   |   |   |-- env.js
|   |   |   `-- jwt.js
|   |   |-- controllers/
|   |   |   |-- AuthController.js
|   |   |   |-- ChapterController.js
|   |   |   |-- CommentController.js
|   |   |   |-- FavoriteController.js
|   |   |   |-- MangaController.js
|   |   |   `-- RatingController.js
|   |   |-- middleware/
|   |   |   |-- auth.js
|   |   |   |-- errorHandler.js
|   |   |   `-- notFound.js
|   |   |-- routes/
|   |   |   |-- auth.routes.js
|   |   |   |-- comment.routes.js
|   |   |   |-- favorite.routes.js
|   |   |   |-- manga.routes.js
|   |   |   `-- rating.routes.js
|   |   |-- services/
|   |   |   `-- view.cache.js
|   |   |-- app.js
|   |   `-- server.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- data/
|   |   |   |-- api.js
|   |   |   |-- axiosCilent.js
|   |   |   `-- mockData.json
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   |-- postcss.config.js
|   |-- tailwind.config.js
|   `-- vite.config.js
|-- package.json
|-- package-lock.json
`-- README.md
```

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- PostgreSQL 14 or newer, or a hosted PostgreSQL provider such as Neon
- `psql` CLI if you want to load the included schema and seed data locally

## Installation

Install dependencies separately for the frontend and backend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

The root `package.json` currently has dependencies but no scripts. Run development commands from `backend/` and `frontend/`.

## Environment Configuration

### Frontend

Create `frontend/.env` from the example:

```bash
cd frontend
cp .env.example .env
```

Expected value:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_PORT=5173
```

The frontend API helper defaults to `http://localhost:5000` if `VITE_API_BASE_URL` is missing.

### Backend

There is no committed `backend/.env.example` at the time of this audit. Create `backend/.env` manually:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Option A: connection string
DATABASE_URL=postgresql://user:password@host:5432/mangaweb
DB_SSL=false

# Option B: individual connection fields
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=mangaweb

JWT_SECRET=replace_this_with_a_real_secret
```

Use either `DATABASE_URL` or the individual `DB_*` fields. For hosted PostgreSQL providers that require TLS, set `DB_SSL=true`.

Security note: `backend/src/config/env.js` currently logs `DATABASE_URL` at startup. Remove or redact that log before sharing logs or deploying the backend.

## Database Setup

The schema script drops and recreates the `mangaweb` database. Use it only for local development.

```bash
psql -U postgres -f backend/database/schema.sql
psql -U postgres -d mangaweb -f backend/database/data.sql
```

Seed data note: the sample users in `data.sql` use password `123456`.

## Running Locally

Open two terminals.

Terminal A:

```bash
cd backend
npm run dev
```

Terminal B:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Available Scripts

### Backend

```bash
npm run dev     # Start Express with nodemon
npm start       # Start Express with node
```

Utility:

```bash
node scripts/generate-hash.js
```

Generates a bcrypt hash for the sample password `123456`.

### Frontend

```bash
npm run dev       # Start Vite dev server
npm run build     # Build production assets
npm run preview   # Preview production build
```

## Usage Notes

- Browse manga from `/`, `/browse`, `/search`, `/genre/:genreId`, and `/ranking`.
- View details at `/manga/:mangaId`.
- Read chapters at `/manga/:mangaId/chapter/:chapterId`.
- Register and login through `/register` and `/login`.
- Favorites, ratings, and comments require the backend and database to be running.
- Notifications and reading history currently use local mock data.
- Creator Studio is available at `/studio`, but submission flows are local/prototype only.
- Admin shell is available at `/admin`; only `/admin/users` and `/admin/comments` have registered pages, and both are incomplete.

## Architecture Overview

The frontend centralizes most data access in `frontend/src/data/api.js`. Some functions call the Express backend with `fetch`, while many catalog, reader, notification, history, and studio functions still read from `mockData.json` or browser `localStorage`.

The backend uses a simple Express MVC-style layout:

- `src/app.js` wires middleware and mounted routes.
- `src/server.js` connects to PostgreSQL and starts the HTTP server.
- `src/config/db.js` owns the PostgreSQL connection pool.
- `src/controllers/*` contain route handlers.
- `src/routes/*` define endpoint paths.
- `src/middleware/auth.js` contains JWT authentication and role helpers, but these helpers are not currently applied to the mounted routes.

The database schema is broader than the currently mounted API surface. It already models pages, notifications, library state, reading history, comment reactions, and daily views, but several of those tables do not yet have functional backend endpoints.

## Known Limitations

- No automated tests, linting, formatting, or CI checks are configured.
- No Docker or docker-compose setup exists.
- No backend `.env.example` is committed.
- Auth is not secure yet because protected routes are not enforced and several APIs accept `userId` directly from clients.
- Login token persistence is broken because frontend and backend response field names do not match.
- Registration creates a user but does not return tokens, while the frontend helper is written as if a token may exist.
- Catalog data is mostly mock-backed; there are no mounted list/detail manga APIs.
- Reader page images are generated placeholder URLs, not stored page records from PostgreSQL.
- Manga creation and chapter upload are prototypes and do not persist to the database.
- Some links are currently inconsistent; for example, favorite list items link by manga slug while the detail route expects a numeric manga id.
- Several source files contain mojibake/encoding issues in Vietnamese strings and comments.

## Roadmap / Next Steps

1. Add backend `.env.example` and remove secret-bearing startup logs.
2. Fix auth response handling (`accessToken` vs `token`) and apply JWT middleware to protected routes.
3. Replace client-supplied `userId` usage with authenticated `req.user.user_id`.
4. Mount and repair manga APIs for list, detail, create, update, and approval flows.
5. Implement chapter/page upload and retrieval APIs.
6. Move catalog, reader, notifications, history, and creator studio from mock/localStorage data to PostgreSQL-backed endpoints.
7. Complete admin pages for users, manga, comments, and analytics.
8. Add automated tests for controllers, API helpers, and key UI flows.
9. Add linting/formatting and CI.
10. Add Docker or compose setup for repeatable local development.

## Development Status

This project should be treated as an active prototype. It has enough frontend and backend structure to continue development, but it is not production-ready. Before deployment or real user testing, prioritize authentication hardening, database-backed catalog APIs, removal of mock/localStorage-only flows, and a basic test suite.
