# Mountain Threads Admin Dashboard - Project Plan

> Master roadmap that persists between sessions. Update checkboxes as work progresses.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **UI:** Tailwind CSS + shadcn/ui
- **Auth:** Simple email/password (single admin)
- **Hosting:** Railway/Render
- **Port:** localhost:5000 (development)

## Brand Colors

- Primary/Accent Blue: `#2ba8db`
- Secondary/Dark Grey: `#374151`
- Background: White (`#ffffff`)
- Success: `#22c55e`
- Warning: `#f59e0b`
- Error: `#ef4444`

---

## Phase 1: Project Foundation

- [x] Initialize Next.js + TypeScript + ESLint
- [x] Configure Tailwind with custom color palette
- [x] Install shadcn/ui base components
- [x] Set up Prisma + PostgreSQL schema
- [x] Configure dev server for port 5000
- [x] Create docs structure
- [x] Create Claude commands for session management
- [ ] Initial git commit

## Phase 2: Database & Data Layer

- [x] Define Prisma schema (Admin, Group, FormSubmission)
- [x] Run initial migration
- [x] Create seed script for test data
- [ ] Create database utility functions (CRUD operations)

## Phase 3: Authentication

- [x] Install bcrypt for password hashing
- [x] Create login page UI
- [x] Implement session management (JWT cookies)
- [x] Create auth middleware for protected routes
- [x] Create admin seed script with hashed password

## Phase 4: Admin Dashboard - Core

- [x] Dashboard layout with sidebar/navigation
- [x] Dashboard home page with stats overview
- [x] Groups list page (active groups)
- [x] Create group form/modal
- [x] Group detail page
  - [x] View group info
  - [x] Copy shareable link
  - [x] Status toggles (Paid, Picked Up, Returned)
  - [x] Notes section (add/edit)
  - [x] View submissions (table + card views)
- [x] Archived groups section
- [x] Archive flow (auto-archive on return)

## Phase 5: Public Form System

### 5A: Test Form (First)
- [x] Create public route `/group/[slug]`
- [x] Simple test form (name, email, phone, notes)
- [x] Mobile-responsive design
- [x] Form validation (client + server)
- [x] Submission handling
- [x] Success confirmation page
- [ ] **Test full pipeline end-to-end**

### 5B: Full Form (When specs provided)
- [ ] Implement detailed form fields
- [ ] Conditional field logic ("Add Family Member" pattern)
- [ ] Full validation rules
- [ ] Complete branded styling

## Phase 6: Data Display & Polish

- [ ] Table view component for submissions
- [ ] Card view component for submissions
- [ ] Toggle between views
- [ ] Search/filter functionality
- [ ] Performance optimization
- [ ] Mobile responsiveness audit

## Phase 7: Testing

- [ ] Unit tests for utilities
- [ ] Integration tests for API routes
- [ ] E2E tests for critical flows (Playwright)
- [ ] CI configuration

## Phase 8: Deployment

- [ ] Railway/Render configuration
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

## Notes

_Add session notes and decisions here as the project progresses._
