# Supapanya SvelteKit

A full-stack web application for content management, video streaming, and online classroom delivery.

## Stack

- **SvelteKit 2 + Svelte 5** with TypeScript
- **PostgreSQL** via Prisma ORM
- **Tailwind CSS** with dark mode support
- **TipTap** rich text editor
- **vidstack + HLS.js** for video playback
- **JWT** authentication with HTTP-only cookies

## Setup

```bash
# Install dependencies
yarn

# Configure environment variables
cp .env.example .env  # then fill in values

# Run database migrations
npx prisma migrate dev

# Start development server
yarn dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | PostgreSQL direct connection (for migrations) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `SERVICE_CLIENT_EMAIL` | Google service account email (for Google Meet) |
| `SERVICE_PRIVATE_KEY` | Google service account private key |
| `SERVICE_SUBJECT` | Google Workspace user to impersonate |
| `PUBSUB_TOPIC` | Google Cloud Pub/Sub topic for Meet recording events |

## Commands

```bash
yarn dev          # Start development server
yarn build        # Production build
yarn preview      # Preview production build
yarn check        # Type-check
yarn lint         # Check formatting and linting
yarn format       # Auto-fix formatting
```

## Features

- **Blog** — CRUD with rich text editor (TipTap), image upload and processing
- **Courses** — Rich content delivery with video playlists
- **Video on Demand** — HLS and MP4 streaming with multi-resolution support
- **Live Classroom** — Session recording and participant tracking
- **Authentication** — Role-based access (admin / user) with bcrypt password hashing
- **Dark Mode** — Persisted to localStorage
