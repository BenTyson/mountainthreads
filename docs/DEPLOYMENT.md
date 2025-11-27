# Deployment Guide

This guide covers the Railway deployment setup for Mountain Threads Admin Dashboard.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub Repo                              │
│  ┌──────────────┐                      ┌──────────────┐         │
│  │   staging    │ ──── PR/Merge ────▶  │     main     │         │
│  │   branch     │                      │    branch    │         │
│  └──────┬───────┘                      └──────┬───────┘         │
└─────────┼──────────────────────────────────────┼────────────────┘
          │ auto-deploy                          │ auto-deploy
          ▼                                      ▼
┌─────────────────────┐              ┌─────────────────────┐
│  Railway Staging    │              │  Railway Production │
│  ─────────────────  │              │  ─────────────────  │
│  Service: staging   │              │  Service: production│
│  DB: postgres-stg   │              │  DB: postgres-prod  │
│  URL: *.railway.app │              │  URL: custom domain │
└─────────────────────┘              └─────────────────────┘
```

## Railway Setup Instructions

### Step 1: Create a New Project (if not exists)

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Empty Project"
4. Name it: `mountainthreads`

### Step 2: Create Staging Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Click on the database, go to "Settings"
4. Rename to: `postgres-staging`
5. Go to "Variables" tab and copy `DATABASE_URL`

### Step 3: Create Production Database

1. Click "+ New" → "Database" → "PostgreSQL"
2. Rename to: `postgres-production`
3. Copy `DATABASE_URL` for later

### Step 4: Create Staging Service

1. Click "+ New" → "GitHub Repo"
2. Select `mountainthreads` repository
3. Click on the service, go to "Settings"
4. Rename to: `staging`
5. Under "Source":
   - Set "Branch" to `staging`
   - Enable "Automatic Deploys"
6. Go to "Variables" tab, add:

```
DATABASE_URL=<paste staging database URL>
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NODE_ENV=production
```

7. Go to "Settings" → "Networking"
   - Click "Generate Domain" for a public URL

### Step 5: Create Production Service

1. Click "+ New" → "GitHub Repo"
2. Select `mountainthreads` repository (same repo)
3. Rename to: `production`
4. Under "Source":
   - Set "Branch" to `main`
   - Enable "Automatic Deploys"
5. Add variables:

```
DATABASE_URL=<paste production database URL>
NEXTAUTH_SECRET=<different secret from staging>
NODE_ENV=production
```

6. Go to "Settings" → "Networking"
   - Add your custom domain

### Step 6: Configure Custom Domain

1. In the production service, go to "Settings" → "Networking"
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `admin.mountainthreads.com`)
4. Add the DNS records shown to your domain registrar:
   - Usually a CNAME record pointing to Railway

### Step 7: Initialize Databases

After services are deployed, run migrations on each database:

**Option A: Via Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations on staging
railway run --service staging npx prisma migrate deploy

# Run migrations on production
railway run --service production npx prisma migrate deploy
```

**Option B: Via Railway Dashboard**
1. Go to service → "Settings" → "Deploy"
2. Add a one-time deploy command: `npx prisma migrate deploy && npm start`

### Step 8: Seed Staging Database

```bash
# Seed staging with test data
railway run --service staging npx prisma db seed
```

**Do NOT seed production** - it will have real data.

## Environment Variables Reference

| Variable | Staging | Production | Description |
|----------|---------|------------|-------------|
| `DATABASE_URL` | postgres-staging URL | postgres-production URL | Prisma connection |
| `NEXTAUTH_SECRET` | Unique secret | Different unique secret | JWT signing |
| `NODE_ENV` | `production` | `production` | Next.js mode |

## Deployment Workflow

### Daily Development

```bash
# 1. Ensure you're on staging
git checkout staging
git pull origin staging

# 2. Make changes...

# 3. Commit and push
git add .
git commit -m "feat: description"
git push origin staging
# → Auto-deploys to staging URL
```

### Promoting to Production

```bash
# 1. Test thoroughly on staging URL

# 2. Create PR on GitHub: staging → main
# 3. Review and merge PR
# → Auto-deploys to production

# Or via command line:
git checkout main
git pull origin main
git merge staging
git push origin main
```

## Database Migrations

When you change `prisma/schema.prisma`:

```bash
# 1. Create migration locally
npx prisma migrate dev --name description_of_change

# 2. Push to staging (auto-deploys, runs migrations)
git add .
git commit -m "db: migration description"
git push origin staging

# 3. After testing, merge to main for production
```

## Monitoring & Logs

- **Railway Dashboard**: View logs, metrics, and deployment status
- **Prisma Studio**: Connect to view/edit data
  ```bash
  # Local (uses your .env DATABASE_URL)
  npx prisma studio

  # Or via Railway
  railway run --service staging npx prisma studio
  ```

## Rollback

If a deployment fails:

1. Go to Railway Dashboard → Service → "Deployments"
2. Find the last working deployment
3. Click "Redeploy"

## Troubleshooting

### Build Fails
- Check Railway logs for error details
- Ensure `npm run build` works locally
- Verify all environment variables are set

### Database Connection Issues
- Verify `DATABASE_URL` is correct in service variables
- Check if database is running in Railway dashboard
- Ensure Prisma schema matches database

### Domain Not Working
- Verify DNS records are propagated (can take 24-48 hours)
- Check Railway dashboard for domain status
- Ensure SSL certificate is provisioned

## Automated Database Backups

The production database is automatically backed up daily to Cloudflare R2 storage.

### Backup Configuration

**Service:** `pg-r2-backup` (forked from [BigDaddyAman/pg-r2-backup](https://github.com/BigDaddyAman/pg-r2-backup))

**Schedule:** Daily at 5:00 AM UTC via Railway cron
**Retention:** 14 days (keeps last 14 backups)
**Storage:** Cloudflare R2 bucket (`mtnthreads-db-backup`)
**Format:** Custom (compressed PostgreSQL dump)

### Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Production DB URL | PostgreSQL connection string |
| `R2_ENDPOINT` | Cloudflare endpoint | Your R2 account endpoint |
| `R2_ACCESS_KEY` | API token access key | From Cloudflare R2 API tokens |
| `R2_SECRET_KEY` | API token secret | From Cloudflare R2 API tokens |
| `R2_BUCKET_NAME` | `mtnthreads-db-backup` | R2 bucket name |
| `BACKUP_TIME` | `05:00` | Daily backup time (UTC) |
| `MAX_BACKUPS` | `14` | Number of backups to retain |
| `DUMP_FORMAT` | `custom` | PostgreSQL dump format |
| `FILENAME_PREFIX` | `mtnthreads-prod` | Backup file prefix |
| `BACKUP_PASSWORD` | (optional) | 7z encryption password |

### Cron Schedule

**Railway Settings → Cron:**
- **Command:** `python main.py`
- **Schedule:** `0 5 * * *` (daily at 5:00 AM UTC)

### Verifying Backups

1. **Check Cloudflare R2:**
   - Go to Cloudflare Dashboard → R2 → `mtnthreads-db-backup`
   - Verify daily backup files appear (format: `mtnthreads-prod-YYYY-MM-DD.dump`)

2. **Check Railway Logs:**
   - Go to pg-r2-backup service → Deployments
   - View logs for messages: `[INFO] Backup completed successfully`

### Manual Backup Trigger

To create an immediate backup:
1. Go to Railway → pg-r2-backup service → Deployments
2. Click latest deployment → "Redeploy"
3. Watch logs to confirm completion

### Restoring from Backup

```bash
# 1. Download backup from Cloudflare R2
# (Use R2 dashboard or CLI)

# 2. Restore to local database (for testing)
pg_restore -d your_database_name backup-file.dump

# 3. Restore to Railway production (use with caution!)
# Get production DATABASE_URL from Railway
pg_restore -d "postgresql://user:pass@host:port/db" backup-file.dump
```

**⚠️ Warning:** Always test restore on staging database first before restoring to production.

## URLs

| Environment | Admin URL | Form URL |
|-------------|-----------|----------|
| Local | http://localhost:3333 | http://localhost:3333/group/[slug] |
| Staging | https://mtnthreads-staging.up.railway.app | https://mtnthreads-staging.up.railway.app/group/[slug] |
| Production | https://app.mountainthreads.org | https://app.mountainthreads.org/group/[slug] |
