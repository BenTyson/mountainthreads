# Session Start Guide

> Read this at the start of each new Claude Code session.

## Quick Context

**Project:** Mountain Threads Admin Dashboard
**Purpose:** Track group form submissions for snowboard gear rentals
**Tech Stack:** Next.js 14 + TypeScript + Prisma + PostgreSQL + shadcn/ui
**Port:** 3333
**Status:** Phases 1-4 + 5A complete. Waiting on form specs for 5B.

## Key Files to Read

1. **Current Status:** `docs/session-start/CURRENT_STATUS.md` - **Read this first**
2. **Project Plan:** `docs/PROJECT_PLAN.md` - Master checklist
3. **Architecture:** `docs/ARCHITECTURE.md` - Technical decisions (if needed)

## Project Structure

```
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
  /utils            # General utilities
/prisma
  schema.prisma     # Database schema
/docs               # Project documentation
/.claude/commands   # Custom Claude commands
```

## Database Models

- **Admin** - Single admin user (email, hashed password)
- **Group** - Rental group (name, slug, status flags, notes)
- **FormSubmission** - Individual form responses (JSON data)

## Commands

```bash
# Development
npm run dev          # Start dev server on port 5000

# Database
npx prisma migrate dev    # Run migrations
npx prisma studio         # Open Prisma Studio GUI
npx prisma db seed        # Seed test data

# Testing
npm run test              # Run tests
npm run lint              # Run linter
```

## Brand Colors

- Primary Blue: `#2ba8db` (use `bg-primary` or `text-primary`)
- Dark Grey: `#374151` (use `bg-secondary` or `text-secondary`)
- Background: White
