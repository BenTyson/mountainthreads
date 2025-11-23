# Architecture & Technical Decisions

## Overview

Mountain Threads Admin Dashboard is a Next.js application that:
1. Allows an admin to create and manage rental groups
2. Provides shareable form links for group members
3. Collects and displays form submissions

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
│   │   └── group/[slug]/  # Public form page
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
├── lib/
│   ├── db.ts              # Prisma client singleton
│   ├── auth/              # Authentication utilities
│   └── utils.ts           # General utilities (shadcn)
└── generated/             # Generated files (Prisma)
```

## Database Schema

### Admin
Single admin user for dashboard access.
- `id`: Unique identifier
- `email`: Login email (unique)
- `password`: Bcrypt hashed password
- `name`: Optional display name

### Group
Represents a rental group (e.g., "Tyson Family").
- `id`: Internal ID
- `uid`: System-generated unique ID (for references)
- `slug`: URL-friendly name (used in form links)
- `name`: Display name
- `paid`, `pickedUp`, `returned`: Status booleans
- `archived`: Soft delete flag
- `notes`: Admin notes (text)
- `emails`: Array of invited email addresses

### FormSubmission
Individual form responses linked to a group.
- `id`: Unique identifier
- `groupId`: Foreign key to Group
- `email`: Submitter's email (optional)
- `data`: JSON field for flexible form data

## Authentication Strategy

Simple email/password authentication:
1. Single admin account
2. Password hashed with bcrypt
3. JWT stored in HTTP-only cookie
4. Middleware protects admin routes

## Form Data Structure

Form submissions use a flexible JSON structure to accommodate:
- Base fields (name, email, phone)
- Nested family members
- Conditional fields based on user input

Example structure:
```json
{
  "name": "John Tyson",
  "email": "john@example.com",
  "phone": "555-1234",
  "familyMembers": [
    {
      "name": "Jane Tyson",
      "age": 12,
      "shoeSize": "6",
      "experience": "beginner"
    }
  ],
  "rentalPreferences": {
    "needsHelmet": true,
    "needsGoggles": false
  }
}
```

## API Design

RESTful API routes:
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/groups` - List groups
- `POST /api/groups` - Create group
- `GET /api/groups/[id]` - Get group details
- `PATCH /api/groups/[id]` - Update group
- `DELETE /api/groups/[id]` - Delete group
- `POST /api/submissions` - Submit form (public)
- `GET /api/groups/[id]/submissions` - Get group submissions

## Deployment

Target: Railway
- Automatic deployments from GitHub
- Managed PostgreSQL
- Environment variables in Railway dashboard
- Custom domain support
