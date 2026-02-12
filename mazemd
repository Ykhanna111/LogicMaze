# Logic Maze

## Overview

Logic Maze is a browser-based puzzle game where players navigate a character through an 8x8 maze by building a sequence of movement commands (Move Forward, Turn Left, Turn Right) rather than controlling the character directly. The game features multiple levels, smooth animations, and a cyberpunk/sci-fi dark theme. When a player wins or loses, the result is submitted to a PostgreSQL database via a REST API.

The project uses a full-stack TypeScript architecture with a React frontend (Vite) and Express backend, connected to a PostgreSQL database via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project is organized as a single repository with three main directories:
- **`client/`** — React frontend (SPA)
- **`server/`** — Express backend (API + static file serving)
- **`shared/`** — Shared types, schemas, and route definitions used by both client and server

### Frontend (`client/src/`)
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite (config in `vite.config.ts`)
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: React hooks (`useState`, `useEffect`) — no external state library
- **Data Fetching**: TanStack React Query for server communication
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives, styled with Tailwind CSS
- **Animations**: Framer Motion for player movement and UI transitions
- **Celebration Effects**: canvas-confetti for win animations
- **Icons**: Lucide React
- **Fonts**: Inter (body text) and Space Grotesk (headings/display), configured via CSS variables
- **Theme**: Dark cyberpunk theme with CSS custom properties for colors

Key pages:
- `pages/Game.tsx` — Main game page with maze grid and command panel
- `pages/not-found.tsx` — 404 fallback

Key components:
- `components/MazeGrid.tsx` — Renders the 8x8 maze grid with walls, floors, goals, and animated player token
- `components/CommandPanel.tsx` — UI for adding movement commands, running, resetting, and clearing

Game data:
- `lib/mazeData.ts` — Maze level definitions (arrays of 0=empty, 1=wall, 2=goal) and direction constants

### Backend (`server/`)
- **Framework**: Express.js on Node.js
- **HTTP Server**: Node `http.createServer` wrapping Express
- **Development**: Vite dev server middleware (HMR via `server/vite.ts`)
- **Production**: Static file serving from `dist/public` (via `server/static.ts`)
- **API Pattern**: RESTful, single endpoint for game result submission
- **Validation**: Zod schemas (shared between client and server)
- **Build**: esbuild for server bundling, Vite for client bundling (orchestrated by `script/build.ts`)

API Routes:
- `POST /api/game/result` — Submit a game result (movesCount, isWin). Defined in `shared/routes.ts` and handled in `server/routes.ts`.

### Shared Layer (`shared/`)
- **`schema.ts`** — Drizzle ORM table definitions and Zod insert schemas. Single table: `game_results` with columns: `id`, `completed_at`, `moves_count`, `is_win`.
- **`routes.ts`** — API route contract definitions (paths, methods, input/output schemas). Acts as a typed API contract between frontend and backend.



### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

### Build & Development
- **Dev**: `npm run dev` — runs Express + Vite dev server with HMR
- **Build**: `npm run build` — builds client with Vite, server with esbuild, outputs to `dist/`
- **Start**: `npm start` — runs production build from `dist/index.cjs`
- **DB Push**: `npm run db:push` — pushes schema to database
- **Type Check**: `npm run check` — TypeScript type checking

### Key npm Packages
- **drizzle-orm** + **drizzle-kit** — Database ORM and migration tooling
- **express** — HTTP server framework
- **@tanstack/react-query** — Async state management for API calls
- **framer-motion** — Animation library for player movement
- **canvas-confetti** — Win celebration particle effects
- **zod** + **drizzle-zod** — Runtime validation and schema generation
- **wouter** — Lightweight client-side routing
- **shadcn/ui** components (Radix UI primitives) — Full UI component library
- **tailwindcss** — Utility-first CSS framework
- **connect-pg-simple** — PostgreSQL session store (available but may not be actively used yet)
