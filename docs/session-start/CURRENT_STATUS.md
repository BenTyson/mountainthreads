# Current Project Status

> Last updated: Session 004 (Nov 23, 2025)

## Current Branch: `staging`

**Remember:** Always work on `staging`. Never commit directly to `main`.

## Environments

| Environment | Branch | URL | Status |
|-------------|--------|-----|--------|
| Local | staging | localhost:3333 | Development |
| Staging | staging | [TBD - Railway] | Testing |
| Production | main | [TBD - Custom domain] | Live |

**Credentials (staging):** `admin@mountainthreads.com` / `threads`

## Completed Phases

### Phase 1: Foundation ✅
- Next.js 14 + TypeScript + Tailwind + shadcn/ui
- Port: 3333

### Phase 2: Database ✅
- PostgreSQL on Railway (connected)
- Prisma schema: Admin, Group, FormSubmission
- Seed script with test data

### Phase 3: Authentication ✅
- JWT-based auth with HTTP-only cookies
- Login page at `/login`
- Middleware protects admin routes

### Phase 4: Admin Dashboard ✅
- Dashboard with compact stats overview
- "Departures Within 7 Days" section
- Recent Groups with search
- Groups list with filtering/sorting
- Group detail page (submissions, status toggles, notes, edit modal)
- Archived groups section
- Create group modal (name, leader info, expected size)

### Phase 5: Form System ✅
- **Leader Form** at `/group/[slug]/leader`
  - Rental details (start date, end date, ski resort)
  - Leader's personal sizing info
  - Add Additional Person functionality
- **Member Form** at `/group/[slug]`
  - Personal info + full sizing fields
  - Email optional for additional people (children)
  - Add Another Person functionality
- Size guide modals for Men's/Women's Jackets/Pants
- Conditional sizing based on clothing type
- Full-width dropdowns throughout

### Phase 6: Polish ✅
- Logo integration (sidebar, forms, login, favicon)
- Status icons with tooltips (replaces badges)
- Search/filter on Groups page (name, status, sort)
- Search on Dashboard recent groups
- Edit Group modal (name, expected size, leader info, rental details)
- Expected group size tracking (displays as X/Y)
- Sign Out in main navigation

### Phase 7: Code Cleanup ✅
- Removed unused `uid` field from schema
- Consolidated `AUTH_COOKIE_NAME` constant
- Created shared types (`lib/types.ts`)
- Extracted shared form layout component
- Consistent StatusIcons usage across pages

### Phase 8: Deployment Setup (In Progress)
- [ ] Create staging branch
- [ ] Set up Railway staging service
- [ ] Set up Railway production service
- [ ] Configure auto-deploys
- [ ] Connect custom domain

## What's Next

1. **Complete Railway Setup** - See `docs/DEPLOYMENT.md`
2. **Phase 9: Testing** - Unit, integration, E2E
3. **Phase 10: Go Live** - Production deployment

## Quick Commands

```bash
# Development
npm run dev        # Start on port 3333
npm run build      # Production build

# Database
npm run db:seed    # Reset test data (staging only!)
npm run db:studio  # Prisma GUI

# Git
git branch         # Verify you're on staging
git push           # Auto-deploys to staging
```

## Test URLs (Local)

- Admin: http://localhost:3333/dashboard
- Leader Form: http://localhost:3333/group/tyson-family/leader
- Member Form: http://localhost:3333/group/tyson-family

## Form Fields

| Field | Men's | Women's | Youth | Toddler |
|-------|-------|---------|-------|---------|
| Gender | - | - | ✅ | - |
| Shoe Size | ✅ | ✅ | ✅ | ✅ |
| Jacket Size | ✅ | ✅ | ✅ | ✅ |
| Pant Size | ✅ | ✅ | - | - |
| Bib Size | - | - | ✅ | ✅ |
| Glove Size | ✅ | ✅ | ✅ | ✅ |
| Goggles | ✅ | ✅ | ✅ | ✅ |
| Helmet Size | ✅ | ✅ | ✅ | ✅ |
