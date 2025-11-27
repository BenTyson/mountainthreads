# Current Project Status

> Last updated: Session 006 (Nov 26, 2025)

## Current Branch: `staging`

**Remember:** Always work on `staging`. Never commit directly to `main`.

## Environments

| Environment | Branch | URL | Status |
|-------------|--------|-----|--------|
| Local | staging | localhost:3333 | Development |
| Staging | staging | https://mtnthreads-staging.up.railway.app | Live ✅ |
| Production | main | https://app.mountainthreads.org | Live ✅ |

**Credentials:** `admin@mountainthreads.com` / `threads`

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

### Phase 8: Deployment ✅
- Created staging branch (auto-deploys from `staging`)
- Set up Railway staging service + database
- Set up Railway production service + database
- Configured auto-deploys for both environments
- Connected custom domain (app.mountainthreads.org)
- Admin footer with copyright
- Redesigned dashboard with upcoming groups (next 2 weeks)

### Phase 9: Automated Backups ✅
- Cloudflare R2 bucket for backup storage (10GB free tier)
- pg-r2-backup service deployed to Railway
- Daily automated backups at 5:00 AM UTC
- 14-day retention policy
- Compressed PostgreSQL dumps
- Documented restore procedures

### Phase 10: Mobile UI Revamp ✅
- **Navigation & Layout:**
  - Hamburger menu with Sheet drawer on mobile (< 1024px)
  - Desktop sidebar hidden on mobile, visible on desktop
  - Responsive header with mobile menu button
  - Minimized footer on mobile devices
- **Tables to Cards:**
  - Groups page: Mobile card view with actions
  - Archived page: Mobile card view with archive dates
  - Submissions table: Auto card view on mobile, toggleable on desktop
- **Full-Screen Dialogs:**
  - Create Group: Full-screen on mobile (< 640px)
  - Edit Group: Full-screen on mobile
  - View/Edit Submission: Full-screen on mobile
- **Responsive Polish:**
  - Dashboard, group detail, all pages mobile-optimized
  - Responsive padding, spacing, and text sizes
  - Touch-friendly button sizes (44x44px minimum)
- **Breakpoint Strategy:**
  - < 640px: Full-screen dialogs, single column
  - < 768px: Cards replace tables
  - < 1024px: Hamburger menu appears
  - ≥ 1024px: Full desktop experience
- New shadcn components: Sheet, Dropdown Menu

### Phase 11: Form Flexibility ✅
- **Leader Form - Required Fields:**
  - First name, Last name, Email
  - Rental start date, Rental return date
  - All other fields optional (ski resort, phone, sizing, payment)
- **Member Form - Required Fields:**
  - First name, Last name only
  - All other fields optional (email, phone, sizing, payment)
- Improved user experience: Can submit without complete sizing info
- Removed asterisks from optional field labels
- Added "(optional)" placeholder text where appropriate

## What's Next

1. **Phase 12: Testing** - Unit, integration, E2E
2. **Phase 13: Production Hardening** - Monitoring, security audit, error tracking

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

## Form Requirements

### Leader Form (Required Fields Only)
- First Name *
- Last Name *
- Email *
- Rental Start Date *
- Rental Return Date *

**All sizing fields optional:** Ski resort, phone, clothing type, all sizes, payment method

### Member Form (Required Fields Only)
- First Name *
- Last Name *

**All other fields optional:** Email, phone, clothing type, all sizes, payment method

### Available Sizing Fields (All Optional)

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
