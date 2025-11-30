# Architecture & Technical Decisions

## Overview

Mountain Threads Admin Dashboard is a Next.js application that:
1. Allows an admin to create and manage rental groups
2. Provides shareable form links for group leaders and members
3. Collects and displays form submissions with detailed sizing information

## Tech Stack Rationale

### Next.js 14 (App Router)
- Server components for better performance
- Built-in API routes
- Easy deployment to Railway/Vercel
- TypeScript support out of the box

### PostgreSQL + Prisma
- Relational database for structured data
- Prisma provides type-safe queries
- Easy migrations and schema management
- Railway provides managed PostgreSQL

### shadcn/ui + Tailwind
- Full control over component styling
- Accessible by default
- Matches custom brand colors easily
- Not a dependency (code is owned)

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin routes (protected)
│   │   ├── dashboard/     # Main dashboard
│   │   ├── groups/        # Group management
│   │   └── archived/      # Archived groups
│   ├── (public)/          # Public routes
│   │   └── group/[slug]/  # Member form
│   │       └── leader/    # Leader form
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── groups/        # Group CRUD
│   │   └── submissions/   # Form submissions
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing/login redirect
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── admin/             # Admin-specific components
│   │   ├── create-group-button.tsx  # Create group modal
│   │   ├── edit-group-button.tsx    # Edit group modal
│   │   ├── group-filters.tsx        # Search/filter/sort controls
│   │   ├── status-icons.tsx         # Status icon indicators
│   │   └── recent-groups-list.tsx   # Searchable group list
│   └── forms/             # Form components
│       ├── member-fields.tsx     # Reusable sizing fields
│       ├── rental-form.tsx       # Member form
│       ├── leader-form.tsx       # Leader form
│       ├── size-guide-button.tsx # Size guide modal trigger
│       └── size-guide-modal.tsx  # Size chart modal
├── lib/
│   ├── db.ts              # Prisma client singleton
│   ├── auth/              # Authentication utilities
│   ├── form-options.ts    # Sizing constants & helpers
│   ├── size-guides.ts     # Size chart data for modals
│   └── utils.ts           # General utilities (shadcn)
└── generated/             # Generated files (Prisma)
```

## Database Schema

### Admin
Single admin user for dashboard access.
- `id`: Unique identifier (cuid)
- `email`: Login email (unique)
- `password`: Bcrypt hashed password
- `name`: Optional display name

### Group
Represents a rental group (e.g., "Tyson Family").
- `id`: Internal ID (cuid)
- `uid`: System-generated unique ID
- `slug`: URL-friendly name (used in form links)
- `name`: Display name
- `leaderName`: Group leader's name
- `leaderEmail`: Group leader's email
- `expectedSize`: Expected number of people in group (optional)
- `rentalStartDate`: Rental period start (set by leader)
- `rentalEndDate`: Rental period end (set by leader)
- `skiResort`: Destination resort (set by leader)
- `paid`, `pickedUp`, `returned`: Status booleans
- `archived`: Soft delete flag
- `notes`: Admin notes (text)
- `emails`: Array of invited email addresses

### FormSubmission
Individual form responses linked to a group.
- `id`: Unique identifier (cuid)
- `groupId`: Foreign key to Group
- `email`: Submitter's email (optional)
- `isLeader`: Boolean flag for leader submissions
- `data`: JSON field for flexible form data

## Form Data Structure

Form submissions use a flexible JSON structure:

```json
{
  "firstName": "John",
  "lastName": "Tyson",
  "email": "john@example.com",
  "phone": "555-1234",
  "clothingType": "mens",
  "youthGender": "",
  "shoeSize": "10",
  "jacketSize": "L",
  "pantSize": "M",
  "bibSize": "",
  "toddlerSetSize": "",
  "handwearType": "gloves",
  "gloveSize": "L",
  "goggles": "standard",
  "helmetSize": "M",
  "sizingNotes": "",
  "paymentMethod": "individually",
  "rentalStartDate": "2025-01-15",
  "rentalEndDate": "2025-01-20",
  "skiResort": "Park City"
}
```

### Clothing Types & Conditional Fields

| Type | Gender Required | Upper Wear | Bottom Wear | Gloves/Mittens |
|------|-----------------|------------|-------------|----------------|
| Men's | No | Jacket (S-4XL) | Pants | Gloves only |
| Women's | No | Jacket (S-3XL) | Pants | Choice |
| Youth | Yes (Boys/Girls) | Jacket (XS-XL) | Bibs | Choice |
| Toddler | No | Toddler Set (12MO-XXS) | (included in set) | Gloves only |

### Youth Helmet Sizes
Youth has sectioned helmet dropdown with both kid sizes (XS, S) and adult sizes (S-XL) for larger kids.

## Authentication Strategy

Simple email/password authentication:
1. Single admin account
2. Password hashed with bcrypt
3. JWT stored in HTTP-only cookie
4. Middleware protects admin routes

**Default credentials:** `admin@mountainthreads.com` / `threads`

## API Design

RESTful API routes:
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current user
- `GET /api/groups` - List groups
- `POST /api/groups` - Create group (name, leaderName, leaderEmail, expectedSize)
- `GET /api/groups/[id]` - Get group details
- `PATCH /api/groups/[id]` - Update group (name, notes, paid, pickedUp, returned, archived, leaderName, leaderEmail, expectedSize, rentalStartDate, rentalEndDate, skiResort)
- `DELETE /api/groups/[id]` - Delete group
- `PATCH /api/submissions/[id]` - Update submission data
- `DELETE /api/submissions/[id]` - Delete submission
- `POST /api/submissions` - Submit form (public, updates group if leader)

## UI Patterns

### Status Icons
Status is displayed using icons with tooltips instead of badges:
| Status | Icon | Color |
|--------|------|-------|
| Unpaid | `Circle` (empty) | Amber |
| Paid | `CircleCheck` | Green |
| Picked Up | `Package` | Blue |
| Returned | `RotateCcw` | Gray |

Icons appear progressively (Picked Up only shows after Paid, Returned only after Picked Up).

### Groups Filtering
Groups page supports URL-based filtering:
- `?search=name` - Filter by group name
- `?status=unpaid|paid|picked-up|returned` - Filter by status
- `?sort=newest|oldest|name-asc|name-desc|departure|submissions` - Sort order

## Form URLs

- **Leader Form:** `/group/[slug]/leader` - Includes rental details
- **Member Form:** `/group/[slug]` - Sizing only

## Deployment

Target: Railway
- Automatic deployments from GitHub
- Managed PostgreSQL
- Environment variables in Railway dashboard
- Custom domain support
