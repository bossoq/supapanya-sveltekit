# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start development server
yarn build        # Production build
yarn preview      # Preview production build
yarn check        # Type-check with svelte-check
yarn check:watch  # Type-check in watch mode
yarn lint         # Check formatting (prettier) and linting (eslint)
yarn format       # Auto-fix formatting with prettier
```

There is no test suite configured.

After adding/modifying Prisma schema: `npx prisma generate` (runs automatically via `postinstall`).
For DB migrations: `npx prisma migrate dev`.

## Architecture

**Stack:** SvelteKit 2 + Svelte 5, TypeScript, PostgreSQL via Prisma, Tailwind CSS.

### Authentication

JWT tokens stored in HTTP-only cookies. Token decoding happens in `src/hooks.server.ts`, which populates `event.locals.user` (typed as `UserInfo | undefined` in `src/app.d.ts`). Public paths, user paths, and admin-only paths (`/register`, `/vodedit`, `/vodlist`) are gated in the hook.

Passwords are hashed with `bcryptjs`. Login/logout live at `/login` and `/logout`. JWT secret comes from env var `JWT_SECRET`.

### Database

Prisma with PostgreSQL. Schema at `prisma/schema.prisma`. Key tables:

- `userTable` — users with a `meta` JSON column holding `{ isAdmin, role, live }`
- `postTable` — blog posts and course content; `postContent` is TipTap JSON; `postType` distinguishes `'blog'` from `'course'`
- `videoTable` — HLS/MP4 video metadata
- `videoProcess` — classroom session recordings

Env vars needed: `DATABASE_URL`, `DIRECT_URL` (for migrations). Google Meet classroom features also require `SERVICE_CLIENT_EMAIL`, `SERVICE_PRIVATE_KEY`, `SERVICE_SUBJECT`, and `PUBSUB_TOPIC` (Google Cloud Pub/Sub topic for recording events).

### Routes and API

Page routes under `src/routes/` follow SvelteKit file conventions (`+page.svelte`, `+page.server.ts`, `+layout.server.ts`). Server-side data loading uses Prisma directly — there is no separate backend service.

API endpoints at `src/routes/api/` handle mutations (blog CRUD, image processing, classroom management). They use `event.locals.user` (populated by `hooks.server.ts`) for auth — do not re-decode the JWT cookie in handlers.

### Content and Media

- **Rich text:** TipTap editor (`src/lib/components/TipTap.svelte`). Content stored and retrieved as TipTap JSON. Use `TipTapRender.svelte` or `TipTapView.svelte` to display it.
- **Video:** vidstack player with HLS.js. `src/lib/utils.ts` contains helpers for building multi-resolution MP4 and HLS source lists. The `Player.svelte` component wraps vidstack.
- **Images:** Server-side resizing via `sharp` in `/api/processImage`.

### Stores

`src/lib/store.ts` exports two stores:

- `darkTheme` — boolean, persisted to localStorage
- `toastsList` — array of toast notifications consumed by `ToastNotify.svelte`

### Styling

Tailwind with dark-mode class strategy. Custom brand colors: `blue-light-key` (#41bfd0), `blue-dark-key` (#1e3d59), `green-light-key` (#60ceb0). Vidstack's Tailwind plugin is included. No semicolons, single quotes, 100-char print width (see `.prettierrc`).
