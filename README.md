# Survey (Full-Stack, TypeScript)

A small survey application built with:
- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node.js + TypeScript + Express
- Database: SQLite via Prisma (SQL relational)

## Quick Start (3–8 min)

### 0) Requirements
- Node.js 18+ and npm
- VS Code (optional, but recommended)

### 1) Open in VS Code
Unzip the folder and open it with VS Code.

### 2) Install dependencies
```bash
# in the backend
cd backend
npm install

# in another terminal for the frontend
cd frontend
npm install
```

### 3) Configure env (backend)
Create a `.env` file inside `backend/` with:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev_super_secret_change_me"
PORT=4000
CORS_ORIGIN="http://localhost:5173"
```

> `CORS_ORIGIN` should match where Vite serves the frontend.

### 4) Initialize DB & Seed (backend)
```bash
cd server
npx prisma migrate dev --name init
npx tsx src/seed.ts
```

### 5) Run the backend (Prisma Studio - npx prisma studio)
```bash
npm run dev
```
> Backend runs at http://localhost:4000

### 6) Run the frontend
```bash
cd ../client
npm run dev
```
Open the printed localhost URL (usually http://localhost:5173).

---

## Default Flow (Demo)
1. Register a new account (email/password).
2. Login to receive a token (stored automatically).
3. Take the default survey (demographic, health, financial).
4. Submit. You’ll see a review screen with your submitted answers.

---

## Tech Notes

### Schema design
**Tables**
- `User` — stores unique users; `email` unique, `passwordHash` hashed with bcrypt.
- `Survey` — a survey container (title/description).
- `Question` — belongs to a survey; has `type`, `required`, `options` (for SELECT), and `order` for display.
- `Response` — a user's submission to a survey.
- `ResponseItem` — per-question answers, referencing both `Response` and `Question`.

**Indexes & choices**
- Indexes on foreign keys: `Question.surveyId`, `Response.userId`, `Response.surveyId` for quick lookups.
- `User.email` is unique.
- SQLite chosen for speed & zero setup; can be swapped to Postgres/MySQL by changing `DATABASE_URL` and running migrations.

### Authentication
- Simple JWT auth (HTTP header `Authorization: Bearer <token>`).
- Passwords hashed with bcrypt.
- Auth middleware protects survey submission & viewing responses.

### Potential Improvements (rationale examples)
- **Single-question stepper + progress** (implemented) to improve focus and completion rates.
- **Validation** for required fields and types (implemented in frontend; mirrored in backend).
-**Single-question stepper + progress** (implemented) to improve the focus and completion rates
-Added **role-based admin UI** to crete/edit surveys.
-Persisit **refresh okens** and CSRF protection for cookie-based auth in




