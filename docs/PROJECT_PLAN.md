# Mountain Threads Admin Dashboard - Project Plan

> Master roadmap that persists between sessions. Update checkboxes as work progresses.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **UI:** Tailwind CSS + shadcn/ui
- **Auth:** Simple email/password (single admin)
- **Hosting:** Railway
- **Port:** localhost:3333 (development)

## Brand Colors

- Primary/Accent Blue: `#2ba8db`
- Secondary/Dark Grey: `#374151`
- Background: White (`#ffffff`)
- Success: `#22c55e`
- Warning: `#f59e0b`
- Error: `#ef4444`

---

## Phase 1: Project Foundation ✅

- [x] Initialize Next.js + TypeScript + ESLint
- [x] Configure Tailwind with custom color palette
- [x] Install shadcn/ui base components
- [x] Set up Prisma + PostgreSQL schema
- [x] Configure dev server for port 3333
- [x] Create docs structure
- [x] Initial git commit

## Phase 2: Database & Data Layer ✅

- [x] Define Prisma schema (Admin, Group, FormSubmission)
- [x] Run initial migration
- [x] Create seed script for test data
- [x] Add leader fields to Group model
- [x] Add isLeader field to FormSubmission model

## Phase 3: Authentication ✅

- [x] Install bcrypt for password hashing
- [x] Create login page UI
- [x] Implement session management (JWT cookies)
- [x] Create auth middleware for protected routes
- [x] Create admin seed script with hashed password

## Phase 4: Admin Dashboard - Core ✅

- [x] Dashboard layout with sidebar/navigation
- [x] Dashboard home page with stats overview
- [x] Groups list page (active groups)
- [x] Create group form/modal (with leader name/email)
- [x] Group detail page
  - [x] View group info
  - [x] Copy shareable links (leader + member)
  - [x] Status toggles (Paid, Picked Up, Returned)
  - [x] Notes section (add/edit)
  - [x] View submissions (table + card views)
  - [x] Leader badge on submissions
- [x] Archived groups section
- [x] Archive flow (auto-archive on return)

## Phase 5: Public Form System ✅

### 5A: Basic Form Infrastructure ✅
- [x] Create public route `/group/[slug]`
- [x] Mobile-responsive design
- [x] Form validation (client + server)
- [x] Submission handling
- [x] Success confirmation page

### 5B: Full Form Implementation ✅
- [x] Leader form (`/group/[slug]/leader`)
  - [x] Rental details (start date, end date, ski resort)
  - [x] Leader's personal sizing info
  - [x] Add Family Members functionality
- [x] Member form (`/group/[slug]`)
  - [x] Personal info fields
  - [x] Add Another Person functionality
- [x] Conditional sizing fields by clothing type
  - [x] Men's/Women's: Pants
  - [x] Youth/Toddler: Bibs
  - [x] Youth: Gender dropdown (Boys/Girls)
- [x] Sizing labels on all dropdowns
- [x] Full validation rules
- [x] Submissions API updates group rental details

## Phase 6: Data Display & Polish

- [x] Table view component for submissions
- [x] Card view component for submissions
- [x] Toggle between views
- [ ] Search/filter functionality
- [ ] Performance optimization
- [ ] Mobile responsiveness audit

## Phase 7: Testing

- [ ] Unit tests for utilities
- [ ] Integration tests for API routes
- [ ] E2E tests for critical flows (Playwright)
- [ ] CI configuration

## Phase 8: Deployment

- [ ] Railway configuration
- [ ] Environment variables setup
- [ ] Database migration in production
- [ ] Domain configuration
- [ ] SSL/HTTPS verification

---

## Assets Needed

- [ ] Logo variations (to be provided)
  - Dashboard logo
  - Form page logo
  - Favicon

---

## Session History

### Session 001 (Nov 22, 2025)
- Completed Phases 1-4 and Phase 5A
- Set up foundation, database, auth, admin dashboard
- Created basic public form

### Session 002 (Nov 22, 2025)
- Completed Phase 5B full form implementation
- Added leader/member form separation
- Implemented conditional sizing fields
- Added gender selection for youth
- Added sizing labels to all dropdowns

### Session 008 (Dec 2, 2025)
- Renamed "Shoe Size" to "Boot Size" throughout forms
- Added "Please select those that apply" disclaimer under Sizing Information
- Reorganized form field layout to eliminate empty gaps in 2-column grid
- Added new size guides: Men's Gloves, Women's Gloves/Mittens, Kids Gloves/Mittens, Helmet
- Added size guide (?) buttons to Glove Size and Helmet Size fields
