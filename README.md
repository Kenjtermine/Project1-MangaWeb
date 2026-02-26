# MangaWeb Project Scaffolding

Clean, fully separated setup for a modern web application:

- `frontend/`: React (Vite) + TailwindCSS + Poppins + `.env` support
- `backend/`: Node.js + Express + dotenv + MVC-inspired folder scaffolding

> This repository contains **scaffolding only** (no business logic, no sample components, no example routes).

## Project Structure

```bash
Project1-MangaWeb/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── README.md
```

## Prerequisites

```bash
node -v
npm -v
```

Use Node.js 18+ and npm 9+.

## Install Dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

## Environment Setup

### Frontend

```bash
cd frontend
cp .env.example .env
```

`frontend/.env.example`

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_PORT=5173
```

### Backend

```bash
cd backend
cp .env.example .env
```

`backend/.env.example`

```env
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Run Development Servers

Open two terminals.

### Terminal A (Backend)

```bash
cd backend
npm run dev
```

### Terminal B (Frontend)

```bash
cd frontend
npm run dev
```

## Scripts

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`

### Backend

- `npm run dev`
- `npm start`
