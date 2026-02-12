# Logic Maze

## Overview

Logic Maze is a browser-based puzzle game where players navigate a character through an 8x8 maze by building a sequence of movement commands (Move Forward, Turn Left, Turn Right) rather than controlling the character directly. The player constructs a "program" of commands, then executes them to watch the character move through the maze step by step. The game tracks wins/losses and submits results to a backend API.

The project uses a full-stack TypeScript monorepo architecture with a React frontend (Vite), Express backend, and PostgreSQL database via Drizzle ORM.

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
- **Development**: Vite dev server middleware for HMR (via `server/vite.ts`)
- **Production**: Static file serving from `dist/public` (via `server/static.ts`)
- **API Pattern**: RESTful, single endpoint for game result submission
- **Database Access**: Drizzle ORM with `node-postgres` driver (`server/db.ts`)
- **Storage Layer**: `server/storage.ts` implements `IStorage` interface using `DatabaseStorage` class

### Shared (`shared/`)
- **`schema.ts`** — Drizzle table definitions and Zod insert schemas. Contains the `gameResults` table.
- **`routes.ts`** — API route contracts with paths, methods, Zod input/output schemas. Acts as a typed API contract between client and server.

### Database Schema
Uses PostgreSQL via Drizzle ORM. Schema is defined in `shared/schema.ts`:

- **`game_results`** table:
  - `id` — serial primary key
  - `completed_at` — timestamp, defaults to now
  - `moves_count` — integer, not null
  - `is_win` — boolean, not null

Push schema changes with `npm run db:push` (uses `drizzle-kit push`).

### API Endpoints
- `POST /api/game/result` — Submit a game result (moves count + win/loss). Input validated with Zod via shared schema. Returns the created record.

### Build System
- **Dev**: `npm run dev` runs `tsx server/index.ts` which sets up Vite middleware for HMR
- **Build**: `npm run build` runs a custom script (`script/build.ts`) that builds the client with Vite and bundles the server with esbuild
- **Production**: `npm start` runs the compiled server from `dist/index.cjs`

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

## External Dependencies

### Database
- **PostgreSQL** — Required. Connection via `DATABASE_URL` environment variable.
- **Drizzle ORM** — Query builder and schema management
- **Drizzle Kit** — Schema migration/push tool (`drizzle-kit push`)
- **node-postgres (`pg`)** — PostgreSQL driver

### Frontend Libraries
- **React 18** with **Vite** bundler
- **TanStack React Query** — Server state management
- **Framer Motion** — Animation library for player movement
- **canvas-confetti** — Win celebration effects
- **shadcn/ui** + **Radix UI** — Component library (new-york style)
- **Tailwind CSS** — Utility-first styling
- **Wouter** — Client-side routing
- **Lucide React** — Icon library
- **Zod** — Schema validation (shared between client and server)

### Backend Libraries
- **Express.js** — HTTP server framework
- **connect-pg-simple** — PostgreSQL session store (available but may not be actively used)
- **drizzle-zod** — Generates Zod schemas from Drizzle table definitions

### Dev Tools
- **tsx** — TypeScript execution for development
- **esbuild** — Server bundling for production
- **@replit/vite-plugin-runtime-error-modal** — Error overlay in development