# Current Project Status

> Last updated: Session 009 (Dec 3, 2025)

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

### Phase 12: Form Options Overhaul ✅
- **Boot Sizes (whole sizes only):**
  - Men's: 7-15
  - Women's: 6-11
  - Youth: 1-13
  - Toddler: 5T-10T
- **Pant Sizes:**
  - Men's: S-5XL + XXL + Custom Size (XXL and 2XL both included for brand differences)
  - Women's: XS-3XL + Custom Size
- **Jacket Sizes:**
  - Men's: S-4XL
  - Women's: S-3XL
  - Youth: XS-XL
- **Toddler Set (replaces separate Jacket & Bib for toddlers):**
  - Combined "Toddler Set Size (Jacket & Bibs)" field
  - Sizes: 12MO, 2T, 3T, 4T, XXS
- **Gloves/Mittens:**
  - Women's & Youth: Choice between Gloves or Mittens (same sizes)
  - Men's & Toddler: Gloves only
  - Sizes: Men's S-XL, Women's S-L, Youth S-XL, Toddler S-XL
- **Youth Helmet Sizes:**
  - Sectioned dropdown with "Kid Helmets" (XS, S) and "Adult Helmets" (S-XL)
  - Allows larger kids to select adult helmet sizes
- **Card View Enhancement:**
  - Submission cards now show clothing type and sizing summary
  - Displays: Jacket, Set, Pants, Bibs, Shoe, Gloves, Helmet

### Phase 13: Form UI & Size Guides ✅
- **Form Field Reorganization:**
  - Renamed "Shoe Size" to "Boot Size" throughout
  - Moved Boot Size to be the last sizing field (after Helmet)
  - Added "Please select those that apply" disclaimer under Sizing Information header
  - Reorganized field layout to eliminate empty gaps in 2-column grid:
    - Men's/Women's: Jacket+Pant, Glove+Helmet, Goggles+Boot
    - Youth: Jacket+Bib, Gloves/Mittens?+Size, Goggles+Helmet, Boot
    - Toddler: Set, Gloves/Mittens?+Size, Goggles+Helmet, Boot
- **New Size Guides:**
  - Men's Gloves: Circumference, Length, Width for S-XL
  - Women's Gloves/Mittens: Circumference, Length, Width for S-L
  - Kids Gloves/Mittens: Age, Circumference, Length for XS-XL
  - Helmet (universal): Inches, Hat Size for S-XL
- **Size Guide Buttons Added:**
  - Glove Size field now has (?) help icon for all clothing types
  - Helmet Size field now has (?) help icon for all clothing types

### Phase 14: Crew Grouping Feature ✅
- **Database Changes:**
  - Added new `Crew` model (id, groupId, name, timestamps)
  - Added `crewId`, `isCrewLeader`, `paysSeparately` fields to FormSubmission
  - Crews allow grouping submissions within a group (e.g., families within a scout troop)
- **Member Form Redesign:**
  - Initial selection screen: "Just Myself" vs "My Crew / Family"
  - Individual mode: Simple single-person form, no crew association
  - Crew mode: Crew name field, add multiple crew members
  - Crew members get simplified "Paying separately?" toggle instead of full payment dropdown
  - "Change" link to go back to selection screen
  - Info popup (?) explaining Groups vs Crews concept
  - Submit button text: "Submit Gear Specs"
- **Leader Form Updates:**
  - Added Crew Name field after rental details
  - Changed "Add Additional Person" to "Add to My Crew"
  - Section header changed to "My Crew"
  - Crew members use simplified payment toggle
- **Admin Submissions Table:**
  - Visual crew grouping with indented rows (subtle background for crew members)
  - Crew name badge with mountain icon on crew leader rows
  - New "Payment" column with short labels (Self, Crew, Group, Other, TBD, w/ Crew)
  - Crew assignment editing in submission edit dialog
- **API Updates:**
  - POST /api/submissions: Creates crew on first submission, assigns subsequent to same crew
  - PATCH /api/submissions/[id]: Supports crewId and paysSeparately updates
  - GET /api/groups/[id]: Includes crews with proper ordering
  - New PATCH/DELETE /api/crews/[id] endpoint for crew management
- **Payment Option Update:**
  - Changed "For my family members" to "For my crew"

## What's Next

1. **Phase 15: Testing** - Unit, integration, E2E
2. **Phase 16: Production Hardening** - Monitoring, security audit, error tracking

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
| Jacket Size | S-4XL (?) | S-3XL (?) | XS-XL | - |
| Toddler Set | - | - | - | 12MO-XXS |
| Pant Size | S-5XL (?) | XS-3XL (?) | - | - |
| Bib Size | - | - | XS-XL | - |
| Gloves/Mittens | Gloves only | Choice | Choice | Gloves only |
| Glove Size | S-XL (?) | S-L (?) | S-XL (?) | S-XL |
| Goggles | ✅ | ✅ | ✅ | ✅ |
| Helmet Size | S-XL (?) | S-XL (?) | Kid/Adult (?) | XS |
| Boot Size | 7-15 | 6-11 | 1-13 | 5T-10T |

(?) = Size guide available via help icon
