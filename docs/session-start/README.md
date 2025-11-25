# Session Start Guide

> Read this at the start of each new Claude Code session.

## IMPORTANT: Branch Policy

**ALWAYS work on the `staging` branch. NEVER commit directly to `main`.**

```bash
# Verify you're on staging before starting work
git branch --show-current  # Should show: staging

# If not on staging, switch to it
git checkout staging
git pull origin staging
```

- `staging` = Development & testing (auto-deploys to staging URL)
- `main` = Production only (auto-deploys to live site)
- Merge staging → main only after testing on staging URL

## Quick Context

**Project:** Mountain Threads Admin Dashboard
**Purpose:** Track group form submissions for snowboard gear rentals
**Tech Stack:** Next.js 14 + TypeScript + Prisma + PostgreSQL + shadcn/ui
**Port:** 3333

## Environments

| Environment | Branch | URL | Database |
|-------------|--------|-----|----------|
| Local | staging | localhost:3333 | Local or staging DB |
| Staging | staging | https://mtnthreads-staging.up.railway.app | postgres-staging |
| Production | main | [custom domain] | postgres-production |

## Key Files to Read

1. **Current Status:** `docs/session-start/CURRENT_STATUS.md` - **Read this first**
2. **Deployment Guide:** `docs/DEPLOYMENT.md` - Railway setup & workflow
3. **Project Plan:** `docs/PROJECT_PLAN.md` - Master checklist
4. **Architecture:** `docs/ARCHITECTURE.md` - Technical decisions (if needed)

## Project Structure

```
/src
  /app
    /(admin)          # Protected admin routes (dashboard, groups, etc.)
    /(public)         # Public form routes (/group/[slug])
    /api              # API routes
  /components
    /ui               # shadcn/ui components
    /admin            # Admin-specific components
    /forms            # Form components
  /lib
    /db.ts            # Prisma client singleton
    /auth             # Auth utilities
    /constants.ts     # Shared constants
    /types.ts         # Shared TypeScript types
    /utils.ts         # General utilities
/prisma
  schema.prisma       # Database schema
/docs                 # Project documentation
```

## Database Models

- **Admin** - Single admin user (email, hashed password)
- **Group** - Rental group (name, slug, status flags, notes)
- **FormSubmission** - Individual form responses (JSON data)

## Commands

```bash
# Development
npm run dev              # Start dev server on port 3333

# Database
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open Prisma Studio GUI
npx prisma db seed       # Seed test data

# Build & Deploy
npm run build            # Production build
npm run lint             # Run linter
```

## Deployment Workflow

```
1. Work on staging branch
2. Push to staging → auto-deploys to staging URL
3. Test on staging URL
4. Create PR: staging → main
5. Merge PR → auto-deploys to production
```

See `docs/DEPLOYMENT.md` for detailed Railway setup instructions.

## Brand Colors

- Primary Blue: `#2ba8db` (use `bg-primary` or `text-primary`)
- Dark Grey: `#374151` (use `bg-secondary` or `text-secondary`)
- Background: White
