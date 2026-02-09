# 🚂 Train Schedule — Frontend

Web app for viewing and managing train schedules. Built with **Next.js 14**, **React**, and **Tailwind CSS**.

---

## Features

- **Schedule** — view trips with search, day-of-week filter, and sort by departure/arrival time (public)
- **Trains** — list of trains (view requires authentication, CRUD for authenticated users)
- **Stations** — station directory (view requires authentication, CRUD for authenticated users)
- **Routes** — routes with stops and arrival/departure times (view requires authentication, CRUD for authenticated users)
- **Auth** — login and admin registration (JWT)
- **Responsive Design** — fully responsive layout optimized for mobile and desktop devices

## Access Control

- **Unauthenticated users** can only view the schedule page
- **Authenticated users** have full access to all features including viewing and managing trains, stations, routes, and schedules

---

## Authentication

To access admin features (viewing and managing trains, stations, routes, and schedules):

1. **Login** - Use existing admin credentials
2. **Register** - Create a new admin account (requires existing admin to be logged in)

---

### 🔑 Test Admin Credentials

```
Username: sofiia
Password: sofiia
```

> **💡 Use these credentials to log in and access all admin features.**

---

After logging in, you can:
- View trains, stations, and routes
- Create, edit, and delete trains, stations, routes, and schedules
- Register additional admin users

---

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript
- Responsive design with mobile-first approach

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
    schedule/      # Schedule view with filters and table
    trains/        # Trains management
    stations/      # Stations management
    routes/        # Routes management
  layout.tsx       # Root layout
  globals.css      # Global styles
components/        # Reusable components
  Navbar.tsx       # Responsive navigation with mobile menu
  RouteStationsEditor.tsx  # Route stops editor
  DaysOfWeekPicker.tsx     # Day selection component
  ui/              # UI components (Modal, ErrorMessage, etc.)
lib/               # API client, auth context, types, formatters
```

---

## License

See [LICENSE](./LICENSE).
