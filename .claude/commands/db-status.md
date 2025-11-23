# Database Status

Check the current database status by:

1. Read `prisma/schema.prisma` to understand the current models
2. Run `npx prisma migrate status` to check migration status
3. Report on:
   - What models exist in the schema
   - Whether migrations are up to date
   - Any pending migrations or drift

If there are issues, suggest how to resolve them.
