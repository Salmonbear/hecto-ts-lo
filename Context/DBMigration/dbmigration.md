# Database Migration PRD
## Migrating Bubble.io Data to PostgreSQL via Prisma

---

## Overview

Migrate all existing data from Bubble.io to a new PostgreSQL database using Prisma ORM, preserving data integrity, maintaining foreign key relationships, and ensuring zero data loss.

**Migration Scope:**
- ~3,000 Users
- ~680 Brands (Companies)
- ~330 Campaigns
- Newsletter data (amalgamated into Companies)
- Newsletter Stats (linked to Companies)
- Packages (if applicable)

**Critical Requirement:** Preserve exact Bubble unique IDs for Users, Companies, and Campaigns to maintain referential integrity.

---

## Goals

1. **Zero Data Loss**: All relevant data migrated successfully
2. **Referential Integrity**: All foreign key relationships preserved
3. **ID Preservation**: Bubble unique IDs maintained exactly
4. **Data Quality**: Clean, validated data in new database
5. **Rollback Capability**: Ability to revert if critical issues arise

---

## Data Mapping: Bubble → PostgreSQL

### 1. Users (`export_All-Users-modified--_2025-12-11_15-06-30.csv`)

**Source:** Bubble `Users` data type  
**Target:** PostgreSQL `users` table

| Bubble CSV Column | PostgreSQL Column | Type | Notes |
|-------------------|-------------------|------|-------|
| `unique id` | `id` | String (PK) | **CRITICAL: Preserve exactly** |
| `email` | `email` | String (unique) | Required |
| `firstName` | `firstName` | String? | Optional |
| `lastName` | `lastName` | String? | Optional |
| `Intention` | `intention` | String? | e.g., "Buy & Sell" |
| `Mail OptIn` | `mailOptIn` | Boolean? | Convert yes/no to boolean |
| `profilePic` | `profilePic` | String? | URL string |
| `Stripe Seller ID` | `stripeSellerId` | String? | Optional |
| `Creation Date` | `createdAt` | DateTime | Parse date string |
| `Modified Date` | `updatedAt` | DateTime | Parse date string |

**Migration Flags:**
- `migratedFromBubble`: Set to `true`
- `bubbleUserId`: Set to `unique id` value
- `migrationDate`: Set to migration execution date
- `passwordResetRequired`: Set to `true` (passwords unavailable from Bubble)

**Exclusions:**
- `source` field (marked as not required)
- `Slug` field (marked as not required)
- `null` column (empty column in CSV)

---

### 2. Companies (`export_All-Brands-modified--_2025-12-11_15-04-28.csv` + `export_All-Newsletters-modified--_2025-12-11_15-05-41.csv`)

**Source:** Bubble `Brands` data type + `Newsletters` data type (amalgamated)  
**Target:** PostgreSQL `companies` table

#### From Brands CSV:

| Bubble CSV Column | PostgreSQL Column | Type | Notes |
|-------------------|-------------------|------|-------|
| `unique id` | `id` | String (PK) | **CRITICAL: Preserve exactly** |
| `Creator` (email) | `userId` | String (FK) | Link to `users.id` via email lookup |
| `Creator` (email) | `creatorEmail` | String? | Store for reference |
| `Brand Name` | `name` | String? | |
| `Brand Website` | `website` | String? | |
| `Long Summary` | `longSummary` | String? | Populate `longSummary` |
| `Short Summary` | `shortSummary` | String? | Populate `shortSummary` |
| `Logo` | `logoUrl` | String? | URL string |
| `tags` | `tags` | String[]? | Convert comma-separated to array |
| `verified` | `verified` | Boolean? | Convert yes/no to boolean |
| `Advertising Goals` | `advertisingGoals` | String? | |
| `Campaign Budget` | `campaignBudget` | String? | |
| `Creation Date` | `createdAt` | DateTime | Parse date string |
| `Modified Date` | `updatedAt` | DateTime | Parse date string |

**Flag:** `isNewsletter`: Set to `false` for Brands

#### From Newsletters CSV:

| Bubble CSV Column | PostgreSQL Column | Type | Notes |
|-------------------|-------------------|------|-------|
| `unique id` | `id` | String (PK) | **CRITICAL: Preserve exactly** |
| `Owner` or `Creator` (email) | `userId` | String (FK) | Link to `users.id` via email lookup |
| `Owner` or `Creator` (email) | `creatorEmail` | String? | Store for reference |
| `Business Name` | `name` | String? | |
| `Website URL` | `website` | String? | |
| `Summary - Long` | `longSummary` | String? | **Populate `longSummary`** |
| `Summary - Short` | `shortSummary` | String? | **Populate `shortSummary`** |
| `Profile Image` | `logoUrl` | String? | URL string |
| `Newsletter Tags` | `tags` | String[]? | Convert comma-separated to array |
| `VERIFIED` | `verified` | Boolean? | Convert yes/no to boolean |
| `Newletter Category` | `newsletterCategory` | String? | |
| `Newsletter Freq` | `newsletterFreq` | String? | |
| `Starting Price` | `newsletterStartingPrice` | String? | |
| `Summary - Long` | `newsletterSummaryLong` | TEXT? | Store separately |
| `Summary - Short` | `newsletterSummaryShort` | TEXT? | Store separately |
| `Social - FB URL` | `socialFbUrl` | String? | |
| `Social - Twitter` | `socialTwitterUrl` | String? | |
| `Creation Date` | `createdAt` | DateTime | Parse date string |
| `Modified Date` | `updatedAt` | DateTime | Parse date string |

**Flag:** `isNewsletter`: Set to `true` for Newsletters

**Special Handling:**
- **Dual Owners (Brand + Newsletter):** Users who own both a Brand AND a Newsletter will be **skipped** during migration. These instances must be handled manually.
- **Summary Population:** For Newsletter-originated Companies, `longSummary` and `shortSummary` should be populated from `Summary - Long` and `Summary - Short` respectively.

---

### 3. Campaigns (`export_All-Campaigns-modified_2025-12-11_15-14-52.csv`)

**Source:** Bubble `Campaigns` data type  
**Target:** PostgreSQL `campaigns` table

| Bubble CSV Column | PostgreSQL Column | Type | Notes |
|-------------------|-------------------|------|-------|
| `unique id` | `id` | String (PK) | **CRITICAL: Preserve exactly** |
| `brandRequesting` | `companyId` | String (FK) | Link to `companies.id` |
| `Creator` (email) | `creatorId` | String? (FK) | Link to `users.id` via email lookup |
| `Campaign Headline` | `headline` | String? | |
| `Campaign Long Description` | `longDescription` | String? | |
| `targetAudience` | `targetAudience` | String? | |
| `acceptedPartnershipTypes` | `acceptedPartnershipTypes` | String[]? | Convert comma-separated to array |
| `Creation Date` | `createdAt` | DateTime | Parse date string |
| `Modified Date` | `updatedAt` | DateTime | Parse date string |

**Exclusions:**
- `maxAcceptableCAC` (marked as not required)
- `Slug` (if not needed)

---

### 4. Newsletter Stats (`export_All-Newsletter-Stats-modified_2025-12-11_15-05-26.csv`)

**Source:** Bubble `Newsletter-Stats` data type  
**Target:** PostgreSQL `newsletter_stats` table

| Bubble CSV Column | PostgreSQL Column | Type | Notes |
|-------------------|-------------------|------|-------|
| `unique id` | `id` | String (PK) | Auto-generated (cuid) |
| `Newsletter` (ID) | `companyId` | String (FK) | Link to `companies.id` (Newsletter's unique id) |
| `date` or `Updated` | `date` | DateTime | Date for which stats are recorded |
| `Subscribers` | `subscribers` | Int? | Convert to integer |
| `Open Rate` | `openRate` | Float? | Convert to float (0.0-1.0) |
| `CTR` | `clickRate` | Float? | Convert to float (0.0-1.0) |
| `Proof` | (stored in Company) | String? | Store latest proof URL in `company.newsletterProofUrl` |
| `Creation Date` | `createdAt` | DateTime | Parse date string |

**Note:** Newsletter Stats link directly to Companies (where `isNewsletter: true`).

---

### 5. Packages (`export_All-Packages-modified--_2025-12-11_15-06-09.csv`)

**Source:** Bubble `Packages` data type  
**Target:** PostgreSQL `packages` table

**Note:** Full column mapping TBD after reviewing CSV headers. Expected fields:
- `unique id` → `id` (PK)
- Link to `companyId` or `campaignId` (if applicable)
- Package details (name, description, price, etc.)

---

### 6. Excluded Data Types

**Inventory (`export_All-Inventories-modified_2025-12-11_15-05-08.csv`):**
- **Not migrating:** No one is buying inventory currently
- **Action:** Skip this CSV entirely

**Pitches & Messages:**
- **Not migrating:** No existing pitches/messages in Bubble
- **Action:** These tables will be empty initially, ready for new data post-migration

---

## Migration Order (Critical for Foreign Keys)

The migration **must** follow this exact order to maintain referential integrity:

1. **Users** (no dependencies)
2. **Companies** (depends on Users)
3. **Campaigns** (depends on Companies and Users)
4. **Newsletter Stats** (depends on Companies)
5. **Packages** (depends on Companies/Campaigns)

---

## Migration Scripts Required

### Script 1: `scripts/migrate-users.ts`

**Purpose:** Migrate all Users from Bubble CSV to PostgreSQL

**Process:**
1. Read `export_All-Users-modified--_2025-12-11_15-06-30.csv`
2. Parse CSV using `csv-parser` library
3. For each user:
   - Check if user already exists (by `unique id` or `email`)
   - Create user with preserved Bubble ID
   - Set migration flags
   - Set temporary password (users must reset)
4. Log results and generate report

**Key Logic:**
```typescript
// Preserve exact Bubble ID
await prisma.user.create({
  data: {
    id: bubbleUser['unique id'], // CRITICAL
    email: bubbleUser.email,
    firstName: bubbleUser.firstName || null,
    lastName: bubbleUser.lastName || null,
    intention: bubbleUser.Intention || null,
    mailOptIn: parseBoolean(bubbleUser['Mail OptIn']),
    profilePic: bubbleUser.profilePic || null,
    stripeSellerId: bubbleUser['Stripe Seller ID'] || null,
    password: await hash('TEMP_PASSWORD_RESET_REQUIRED', 10),
    migratedFromBubble: true,
    bubbleUserId: bubbleUser['unique id'],
    passwordResetRequired: true,
    migrationDate: new Date(),
    createdAt: parseDate(bubbleUser['Creation Date']),
    updatedAt: parseDate(bubbleUser['Modified Date']),
  }
});
```

---

### Script 2: `scripts/identify-dual-owners.ts`

**Purpose:** Identify users who own both a Brand AND a Newsletter (to skip during migration)

**Process:**
1. Read `export_All-Brands-modified--_2025-12-11_15-04-28.csv`
2. Read `export_All-Newsletters-modified--_2025-12-11_15-05-41.csv`
3. Extract `Creator`/`Owner` emails from both CSVs
4. Find emails that appear in both lists
5. Output list of dual-owner users to `dual-owners-report.json`

**Output:** List of user emails/IDs who own both Brand and Newsletter

---

### Script 3: `scripts/migrate-companies.ts`

**Purpose:** Migrate Brands and Newsletters to Companies table

**Process:**
1. Read `export_All-Brands-modified--_2025-12-11_15-04-28.csv`
2. Read `export_All-Newsletters-modified--_2025-12-11_15-05-41.csv`
3. Read `dual-owners-report.json` (from Script 2)
4. For each Brand:
   - Skip if owner email is in dual-owners list
   - Lookup User by `Creator` email → get `userId`
   - Create Company with preserved Brand ID
   - Set `isNewsletter: false`
   - Populate summaries from Brand fields
5. For each Newsletter:
   - Skip if owner email is in dual-owners list
   - Lookup User by `Owner`/`Creator` email → get `userId`
   - Create Company with preserved Newsletter ID
   - Set `isNewsletter: true`
   - Populate summaries from Newsletter fields (`Summary - Long` → `longSummary`, etc.)
6. Log results and generate report

**Key Logic:**
```typescript
// For Brands
await prisma.company.create({
  data: {
    id: brand['unique id'], // CRITICAL
    userId: user.id, // Looked up by email
    creatorEmail: brand.Creator,
    name: brand['Brand Name'] || null,
    website: brand['Brand Website'] || null,
    longSummary: brand['Long Summary'] || null,
    shortSummary: brand['Short Summary'] || null,
    logoUrl: brand.Logo || null,
    tags: parseTags(brand.tags),
    verified: parseBoolean(brand.verified),
    advertisingGoals: brand['Advertising Goals'] || null,
    campaignBudget: brand['Campaign Budget'] || null,
    isNewsletter: false,
    createdAt: parseDate(brand['Creation Date']),
    updatedAt: parseDate(brand['Modified Date']),
  }
});

// For Newsletters
await prisma.company.create({
  data: {
    id: newsletter['unique id'], // CRITICAL
    userId: user.id, // Looked up by email
    creatorEmail: newsletter.Owner || newsletter.Creator,
    name: newsletter['Business Name'] || null,
    website: newsletter['Website URL'] || null,
    longSummary: newsletter['Summary - Long'] || null, // Populate main summary
    shortSummary: newsletter['Summary - Short'] || null, // Populate main summary
    newsletterSummaryLong: newsletter['Summary - Long'] || null, // Also store separately
    newsletterSummaryShort: newsletter['Summary - Short'] || null, // Also store separately
    logoUrl: newsletter['Profile Image'] || null,
    tags: parseTags(newsletter['Newsletter Tags']),
    verified: parseBoolean(newsletter.VERIFIED),
    newsletterCategory: newsletter['Newletter Category'] || null,
    newsletterFreq: newsletter['Newsletter Freq'] || null,
    newsletterStartingPrice: newsletter['Starting Price'] || null,
    socialFbUrl: newsletter['Social - FB URL'] || null,
    socialTwitterUrl: newsletter['Social - Twitter'] || null,
    isNewsletter: true, // CRITICAL FLAG
    createdAt: parseDate(newsletter['Creation Date']),
    updatedAt: parseDate(newsletter['Modified Date']),
  }
});
```

---

### Script 4: `scripts/migrate-campaigns.ts`

**Purpose:** Migrate Campaigns from Bubble CSV to PostgreSQL

**Process:**
1. Read `export_All-Campaigns-modified_2025-12-11_15-14-52.csv`
2. For each campaign:
   - Lookup Company by `brandRequesting` (Bubble Brand ID) → get `companyId`
   - Lookup User by `Creator` email → get `creatorId` (optional)
   - Create Campaign with preserved Campaign ID
   - Convert comma-separated `acceptedPartnershipTypes` to array
3. Log results and generate report

**Key Logic:**
```typescript
await prisma.campaign.create({
  data: {
    id: campaign['unique id'], // CRITICAL
    companyId: company.id, // Looked up by brandRequesting ID
    creatorId: creator?.id || null, // Looked up by Creator email
    headline: campaign['Campaign Headline'] || null,
    longDescription: campaign['Campaign Long Description'] || null,
    targetAudience: campaign.targetAudience || null,
    acceptedPartnershipTypes: parseArray(campaign.acceptedPartnershipTypes),
    createdAt: parseDate(campaign['Creation Date']),
    updatedAt: parseDate(campaign['Modified Date']),
  }
});
```

---

### Script 5: `scripts/migrate-newsletter-stats.ts`

**Purpose:** Migrate Newsletter Stats to PostgreSQL

**Process:**
1. Read `export_All-Newsletter-Stats-modified_2025-12-11_15-05-26.csv`
2. For each stat record:
   - Lookup Company by `Newsletter` field (Bubble Newsletter ID) → get `companyId`
   - Create NewsletterStats record
   - Update Company's `newsletterProofUrl` with latest `Proof` URL (if applicable)
3. Log results and generate report

**Key Logic:**
```typescript
await prisma.newsletterStats.create({
  data: {
    companyId: company.id, // Looked up by Newsletter ID
    date: parseDate(stat.date || stat.Updated || stat['Creation Date']),
    subscribers: parseInt(stat.Subscribers) || null,
    openRate: parseFloat(stat['Open Rate']) || null,
    clickRate: parseFloat(stat.CTR) || null,
    createdAt: parseDate(stat['Creation Date']),
  }
});

// Also update Company's proof URL if this is the latest stat
if (stat.Proof) {
  await prisma.company.update({
    where: { id: company.id },
    data: { newsletterProofUrl: stat.Proof }
  });
}
```

---

### Script 6: `scripts/migrate-packages.ts`

**Purpose:** Migrate Packages from Bubble CSV to PostgreSQL

**Process:**
1. Read `export_All-Packages-modified--_2025-12-11_15-06-09.csv`
2. Review CSV headers to determine exact field mapping
3. For each package:
   - Link to Company or Campaign (if applicable)
   - Create Package record
4. Log results and generate report

**Note:** Full implementation TBD after reviewing Package CSV structure.

---

### Script 7: `scripts/validate-migration.ts`

**Purpose:** Validate migrated data for integrity and completeness

**Checks:**
1. **User Count:** All users migrated (excluding dual-owners)
2. **ID Preservation:** All Bubble IDs preserved exactly
3. **Foreign Key Integrity:**
   - All Companies have valid `userId`
   - All Campaigns have valid `companyId`
   - All NewsletterStats have valid `companyId`
4. **Data Completeness:**
   - No orphaned records
   - Required fields populated
5. **Summary Population:** Newsletter summaries correctly populated in `longSummary`/`shortSummary`

**Output:** Validation report with pass/fail for each check

---

## Helper Functions Needed

### `lib/migration-helpers.ts`

```typescript
// Parse CSV boolean values
export function parseBoolean(value: string | undefined): boolean | null {
  if (!value) return null;
  const lower = value.toLowerCase().trim();
  return lower === 'yes' || lower === 'true' || lower === '1';
}

// Parse CSV date strings
export function parseDate(dateString: string | undefined): Date {
  if (!dateString) return new Date();
  // Handle Bubble date format: "Jul 22, 2020 1:40 pm"
  return new Date(dateString);
}

// Parse comma-separated tags to array
export function parseTags(tagsString: string | undefined): string[] | null {
  if (!tagsString) return null;
  return tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
}

// Parse comma-separated partnership types to array
export function parseArray(arrayString: string | undefined): string[] | null {
  if (!arrayString) return null;
  return arrayString.split(',').map(item => item.trim()).filter(Boolean);
}
```

---

## Migration Execution Plan

### Phase 1: Pre-Migration Setup

1. **Database Setup:**
   - [ ] Create PostgreSQL database (Supabase or self-hosted)
   - [ ] Configure `DATABASE_URL` in `.env`
   - [ ] Run `npx prisma migrate dev --name init` to create tables

2. **Dependencies:**
   - [ ] Install `prisma` and `@prisma/client`
   - [ ] Install `csv-parser` for CSV parsing
   - [ ] Install `bcryptjs` for password hashing

3. **Data Preparation:**
   - [ ] Verify all CSV files are in `Context/DBMigration/Existing Files/`
   - [ ] Review CSV headers to confirm column names
   - [ ] Run `scripts/identify-dual-owners.ts` to generate exclusion list

### Phase 2: Migration Execution

**Order of Execution:**

1. **Users Migration:**
   ```bash
   npm run migrate:users
   ```
   - Expected: ~3,000 users migrated
   - Duration: ~5-10 minutes

2. **Companies Migration:**
   ```bash
   npm run migrate:companies
   ```
   - Expected: ~680 Brands + Newsletters migrated (excluding dual-owners)
   - Duration: ~5-10 minutes

3. **Campaigns Migration:**
   ```bash
   npm run migrate:campaigns
   ```
   - Expected: ~330 campaigns migrated
   - Duration: ~2-5 minutes

4. **Newsletter Stats Migration:**
   ```bash
   npm run migrate:newsletter-stats
   ```
   - Expected: All newsletter stats linked to Companies
   - Duration: ~2-5 minutes

5. **Packages Migration:**
   ```bash
   npm run migrate:packages
   ```
   - Duration: TBD based on data volume

### Phase 3: Validation

```bash
npm run validate:migration
```

**Validation Checks:**
- [ ] All expected records migrated
- [ ] All IDs preserved exactly
- [ ] All foreign keys valid
- [ ] No orphaned records
- [ ] Newsletter summaries correctly populated

---

## Success Criteria

### Must Have
- [ ] 100% of eligible users migrated (excluding dual-owners)
- [ ] 100% of eligible companies migrated (Brands + Newsletters, excluding dual-owners)
- [ ] 100% of campaigns migrated
- [ ] All Bubble IDs preserved exactly
- [ ] All foreign key relationships intact
- [ ] Zero data loss for migrated records
- [ ] Validation script passes all checks

### Should Have
- [ ] Migration completes in < 30 minutes total
- [ ] Clear migration reports generated for each script
- [ ] Dual-owner exclusion list documented
- [ ] Newsletter summaries correctly populated

### Nice to Have
- [ ] Migration can be paused/resumed
- [ ] Real-time progress tracking
- [ ] Automated rollback on critical errors

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| CSV parsing errors | High | Medium | Validate CSV format before migration, handle edge cases |
| Foreign key violations | High | Medium | Migrate in correct order, validate relationships before insert |
| Dual-owner users missed | Medium | Low | Run identification script first, document exclusions |
| Date parsing failures | Medium | Medium | Robust date parsing with fallbacks |
| Array parsing errors | Low | Low | Handle empty/null values gracefully |
| Database connection issues | High | Low | Retry logic, connection pooling |
| Memory issues (large CSVs) | Medium | Low | Stream CSV processing, batch inserts |

---

## Rollback Plan

**If Critical Issues Discovered:**

1. **Database Backup:** Full PostgreSQL backup before migration starts
2. **Restore Process:**
   - Restore database from backup
   - Clear any partially migrated data
   - Fix issues in migration scripts
   - Retry migration

**Rollback Triggers:**
- >5% of records fail to migrate
- Foreign key integrity violations discovered
- Data corruption detected
- Critical validation failures

---

## Post-Migration Tasks

1. **Manual Handling:**
   - Review dual-owner users list
   - Manually merge or handle Brand + Newsletter conflicts
   - Create manual migration plan for these users

2. **Data Cleanup:**
   - Remove temporary migration flags (after 30 days)
   - Archive original CSV files
   - Document any data quality issues found

3. **Monitoring:**
   - Verify data accessibility in application
   - Check query performance
   - Monitor for missing relationships

---

## Migration Checklist

### Pre-Migration
- [ ] Database created and accessible
- [ ] Prisma schema deployed (`npx prisma migrate dev`)
- [ ] All CSV files verified and accessible
- [ ] Dual-owner identification script run
- [ ] Migration scripts tested on sample data (10-20 records)
- [ ] Database backup created

### Migration Day
- [ ] Run `migrate-users.ts`
- [ ] Verify user migration report
- [ ] Run `migrate-companies.ts`
- [ ] Verify company migration report
- [ ] Run `migrate-campaigns.ts`
- [ ] Verify campaign migration report
- [ ] Run `migrate-newsletter-stats.ts`
- [ ] Verify newsletter stats migration report
- [ ] Run `migrate-packages.ts` (if applicable)
- [ ] Run `validate-migration.ts`
- [ ] Review validation report
- [ ] Verify all checks pass

### Post-Migration
- [ ] Review all migration reports
- [ ] Spot-check data in database
- [ ] Test application queries
- [ ] Document dual-owner users for manual handling
- [ ] Archive CSV files
- [ ] Update documentation

---

## Notes

- **Dual-Owner Users:** Users who own both a Brand and Newsletter will be excluded from automatic migration and handled manually.
- **Newsletter Summaries:** For Newsletter-originated Companies, `longSummary` and `shortSummary` are populated from Newsletter's `Summary - Long` and `Summary - Short` fields.
- **Inventory:** Not migrating Inventory data (no current usage).
- **Pitches/Messages:** Not migrating (no existing data in Bubble).

---

## Appendix

### A. CSV File Locations

All CSV files are located in: `Context/DBMigration/Existing Files/`

- `export_All-Users-modified--_2025-12-11_15-06-30.csv`
- `export_All-Brands-modified--_2025-12-11_15-04-28.csv`
- `export_All-Newsletters-modified--_2025-12-11_15-05-41.csv`
- `export_All-Campaigns-modified_2025-12-11_15-14-52.csv`
- `export_All-Newsletter-Stats-modified_2025-12-11_15-05-26.csv`
- `export_All-Packages-modified--_2025-12-11_15-06-09.csv`

### B. Expected CSV Formats

**Users CSV:**
- Headers: `firstName`, `Intention`, `lastName`, `Mail OptIn`, `profilePic`, `source`, `Stripe Seller ID`, `email`, `null`, `unique id`, `Creation Date`, `Modified Date`, `Slug`

**Brands CSV:**
- Headers: `Advertising Goals`, `Brand Name`, `Brand Owner`, `Brand Website`, `Campaign Budget`, `Logo`, `Long Summary`, `Short Summary`, `tags`, `verified`, `Creation Date`, `Modified Date`, `Slug`, `Creator`, `unique id`

**Campaigns CSV:**
- Headers: `acceptedPartnershipTypes`, `brandRequesting`, `Campaign Headline`, `Campaign Long Description`, `maxAcceptableCAC`, `targetAudience`, `Creation Date`, `Modified Date`, `Slug`, `Creator`, `unique id`

### C. Date Format Handling

Bubble exports dates in format: `"Jul 22, 2020 1:40 pm"`

Use JavaScript `Date` constructor or a date parsing library to handle this format.

### D. Boolean Conversion

Bubble exports booleans as:
- Empty string `""` → `null`
- `"yes"` or `"true"` → `true`
- `"no"` or `"false"` → `false`

### E. Array Conversion

Comma-separated strings like `"tag1 , tag2 , tag3"` should be:
1. Split by comma
2. Trim whitespace
3. Filter empty strings
4. Convert to array: `["tag1", "tag2", "tag3"]`
