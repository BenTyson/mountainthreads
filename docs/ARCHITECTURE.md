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
│   └── forms/             # Form components
│       ├── member-fields.tsx  # Reusable sizing fields
│       ├── rental-form.tsx    # Member form
│       └── leader-form.tsx    # Leader form
├── lib/
│   ├── db.ts              # Prisma client singleton
│   ├── auth/              # Authentication utilities
│   ├── form-options.ts    # Sizing constants & helpers
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

| Type | Gender Required | Bottom Wear | Sizes |
|------|-----------------|-------------|-------|
| Men's | No | Pants | US Men's |
| Women's | No | Pants | US Women's |
| Youth | Yes (Boys/Girls) | Bibs | Youth |
| Toddler | No | Bibs (gender neutral) | Toddler |

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
- `POST /api/groups` - Create group
- `GET /api/groups/[id]` - Get group details
- `PATCH /api/groups/[id]` - Update group
- `DELETE /api/groups/[id]` - Delete group
- `POST /api/submissions` - Submit form (public, updates group if leader)

## Form URLs

- **Leader Form:** `/group/[slug]/leader` - Includes rental details
- **Member Form:** `/group/[slug]` - Sizing only

## Deployment

Target: Railway
- Automatic deployments from GitHub
- Managed PostgreSQL
- Environment variables in Railway dashboard
- Custom domain support
