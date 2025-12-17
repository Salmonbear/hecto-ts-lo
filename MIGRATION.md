# Database Migration Guide

This document outlines the process for migrating data from Bubble.io to PostgreSQL.

## Overview

The migration consists of 7 scripts that migrate ~3,000 users, ~680 companies (brands + newsletters), ~330 campaigns, newsletter stats, and packages from Bubble.io CSV exports to a PostgreSQL database.

## Prerequisites

### 1. Database Setup

You need a PostgreSQL database. You can use:
- **Supabase** (recommended for quick setup): https://supabase.com
- **Self-hosted PostgreSQL**

### 2. Configure Database URL

Update the `DATABASE_URL` in your `.env` file:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 3. Create Database Schema

Run Prisma migrations to create all tables:

```bash
npx prisma migrate dev --name init
```

This will create all the necessary tables (users, companies, campaigns, newsletter_stats, packages).

### 4. Verify CSV Files

Ensure all CSV files are present in `Context/DBMigration/Existing Files/`:
- `export_All-Users-modified--_2025-12-11_15-06-30.csv`
- `export_All-Brands-modified--_2025-12-11_15-04-28.csv`
- `export_All-Newsletters-modified--_2025-12-11_15-05-41.csv`
- `export_All-Campaigns-modified_2025-12-11_15-14-52.csv`
- `export_All-Newsletter-Stats-modified_2025-12-11_15-05-26.csv`
- `export_All-Packages-modified--_2025-12-11_15-06-09.csv`

## Migration Scripts

### Script 1: Identify Dual Owners

Identifies users who own both a Brand AND a Newsletter. These users will be skipped during automatic migration and must be handled manually afterward.

```bash
npm run migrate:identify-dual-owners
```

**Output:** Creates `dual-owners-report.json` with list of dual-owner users.

### Script 2: Migrate Users

Migrates all users from Bubble to PostgreSQL. Preserves exact Bubble user IDs.

```bash
npm run migrate:users
```

**Expected:** ~3,000 users migrated
**Duration:** ~5-10 minutes

**Note:** All migrated users will have:
- Temporary password (users must reset)
- `migratedFromBubble: true` flag
- `passwordResetRequired: true` flag

### Script 3: Migrate Companies

Migrates Brands and Newsletters to the unified Companies table.

```bash
npm run migrate:companies
```

**Expected:** ~680 companies migrated (excluding dual-owner users)
**Duration:** ~5-10 minutes

**Note:**
- Brands have `isNewsletter: false`
- Newsletters have `isNewsletter: true`
- Newsletter summaries populate both main summary fields and newsletter-specific fields

### Script 4: Migrate Campaigns

Migrates campaigns and links them to companies.

```bash
npm run migrate:campaigns
```

**Expected:** ~330 campaigns migrated
**Duration:** ~2-5 minutes

### Script 5: Migrate Newsletter Stats

Migrates newsletter statistics and links them to newsletter companies.

```bash
npm run migrate:newsletter-stats
```

**Duration:** ~2-5 minutes

**Note:** Also updates companies' `newsletterProofUrl` with the latest proof URL from stats.

### Script 6: Migrate Packages

Migrates newsletter packages and links them to newsletter companies.

```bash
npm run migrate:packages
```

**Duration:** ~2-5 minutes

### Script 7: Validate Migration

Validates data integrity, foreign key relationships, and completeness.

```bash
npm run migrate:validate
```

**Checks:**
- User count and ID preservation
- Foreign key integrity (all relationships valid)
- Data completeness (required fields populated)
- Newsletter summaries correctly populated
- No orphaned records

## Running All Migrations

To run all migration scripts in sequence:

```bash
npm run migrate:all
```

This will execute scripts 1-6 in order. After completion, run the validation script:

```bash
npm run migrate:validate
```

## Migration Order (Critical)

The migrations **must** run in this exact order to maintain referential integrity:

1. Identify Dual Owners
2. Users (no dependencies)
3. Companies (depends on Users)
4. Campaigns (depends on Companies and Users)
5. Newsletter Stats (depends on Companies)
6. Packages (depends on Companies)
7. Validate (checks all data)

## Post-Migration Tasks

### 1. Review Dual-Owner Users

Check `dual-owners-report.json` for users who own both a Brand and Newsletter. You'll need to manually decide how to handle these:
- Create separate accounts?
- Merge into one company?
- Keep both entities under one user?

### 2. Test Application

Verify that your application can:
- Query users, companies, campaigns
- Display data correctly
- Handle foreign key relationships

### 3. Password Resets

All migrated users have `passwordResetRequired: true`. You'll need to:
- Send password reset emails to all migrated users
- Implement password reset flow in your application

## Troubleshooting

### Error: "Database connection failed"

Check that your `DATABASE_URL` in `.env` is correct and the database is accessible.

### Error: "CSV file not found"

Verify all CSV files are in `Context/DBMigration/Existing Files/` directory.

### Error: "Foreign key constraint violation"

This means the migration order was not followed. Start fresh:
1. Drop all tables: `npx prisma migrate reset`
2. Run migrations in correct order

### Validation Failures

If validation script shows failures:
- Review the error messages
- Check the details provided
- Fix data issues and re-run the affected migration script

## Rollback

If you need to start over:

```bash
# WARNING: This will delete ALL data in your database
npx prisma migrate reset

# Then re-run migrations
npm run migrate:all
npm run migrate:validate
```

## Success Criteria

Migration is successful when:
- ✓ All scripts complete without critical errors
- ✓ Validation script passes all checks (warnings are okay)
- ✓ Foreign key relationships are intact
- ✓ All Bubble IDs are preserved exactly
- ✓ Application can query and display data correctly

## Support

For issues or questions:
1. Check the migration logs for error messages
2. Review the validation report
3. Check `dual-owners-report.json` for excluded users
4. Review the PRD: `Context/DBMigration/dbmigration.md`
