# 🚂 Train Schedule — Frontend

Web app for viewing and managing train schedules. Built with **Next.js 14**, **React**, and **Tailwind CSS**.

---

## Features

- **Schedule** — view trips with search, day-of-week filter, and sort by departure/arrival time
- **Trains** — list of trains (CRUD for authenticated users)
- **Stations** — station directory (CRUD for authenticated users)
- **Routes** — routes with stops and arrival/departure times (CRUD for authenticated users)
- **Auth** — login and admin registration (JWT)

---

## Admin / demo login

To sign in as an admin and add or edit trains, stations, routes, and schedules, use:

- **Username:** `sofiia`  
- **Password:** `sofiia`

After logging in you can create, edit, and delete data from the app.

---

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript

---

## Running locally

### Prerequisites

- Node.js 18+
- A running backend (API)

### Install

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env.local` and set the backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Start

```bash
# Development (port 3001)
npm run dev

# Production build
npm run build

# Run production build
npm run start
```

Open [http://localhost:3001](http://localhost:3001).

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server on port 3001 |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |

---

## Project structure

```
app/
  (auth)/          # Login and register pages
  (main)/          # Schedule, trains, stations, routes
  layout.tsx       # Root layout
  globals.css      # Global styles
components/        # Reusable components (Navbar, Modal, etc.)
lib/               # API client, auth context, types, formatters
```

---

## License

See [LICENSE](./LICENSE).
