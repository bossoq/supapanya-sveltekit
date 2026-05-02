# Project Instructions: Simple SvelteKit Template

This project is a SvelteKit application designed for a website with blog, user management, and video-on-demand (VOD) capabilities.

## Tech Stack
- **Framework:** SvelteKit 2.x (using Svelte 5)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.x with PostCSS
- **Database & ORM:** PostgreSQL with Prisma 7.x
- **Authentication:** Custom JWT-based authentication using cookies
- **Video Player:** Vidstack with hls.js support
- **Editor:** Tiptap for rich text content
- **Deployment:** Optimized for Vercel

## Core Architecture & Patterns

### 1. SvelteKit Routing
- Follow standard SvelteKit directory-based routing in `src/routes`.
- Use `+page.svelte` for views and `+page.server.ts` for server-side data fetching/actions.
- API endpoints are located in `src/routes/api`.

### 2. Authentication & Authorization
- Managed in `src/hooks.server.ts`.
- Uses an `accessToken` cookie containing a JWT.
- `publicPaths` and `adminPaths` are defined in `hooks.server.ts` to control access.
- User information is available in `event.locals.user` for server-side logic.

### 3. Database (Prisma)
- Schema is defined in `prisma/schema.prisma`.
- Models use `BigInt` for IDs (handled as `number` or `string` in TypeScript, but careful with serialization).
- Common models: `userTable`, `postTable`, `videoTable`, `videoAccess`, `videoProcess`.
- Use `npx prisma generate` after schema changes.

### 4. Styling (Tailwind CSS)
- Custom colors: `blue-light-key` (#41bfd0), `blue-dark-key` (#1e3d59), `green-light-key` (#60ceb0).
- Use Tailwind utility classes for most styling.
- Custom utilities like `.hide-scrollbar` are available.

### 5. Video Handling
- Utilities in `src/lib/utils.ts` handle HLS and multi-resolution MP4 sources.
- `Vidstack` is used for the player component (`src/lib/components/Player.svelte`).

### 6. Components
- Shared components are in `src/lib/components`.
- `TipTap.svelte`, `TipTapRender.svelte`, and `TipTapView.svelte` handle rich text editing and rendering.

## Development Workflows

### Environment Variables
- Ensure `.env` is configured (see `.env.example`).
- `JWT_SECRET` is required for authentication.
- `DATABASE_URL` is required for Prisma.

### Code Quality
- **Linting:** `npm run lint` (ESLint + Prettier).
- **Formatting:** `npm run format` (Prettier).
- **Type Checking:** `npm run check` (Svelte-check + TypeScript).

## Specific Instructions for AI
- **Svelte 5:** Use Svelte 5 syntax (runes like `$state`, `$derived`, `$effect`) where applicable if the project has transitioned, though check existing components first for patterns. (Note: `package.json` specifies `svelte: ^5.0.0`).
- **BigInt IDs:** Be mindful of `BigInt` IDs when returning data from API routes; they may need string conversion for JSON serialization.
- **Paths:** Always use `$lib` alias for imports from `src/lib`.
- **Surgical Edits:** When modifying routes or components, maintain the existing structure and style.
