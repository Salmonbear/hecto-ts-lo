/**
 * Script 3: Migrate Companies
 * Migrates Brands and Newsletters to Companies table
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import {
  parseBoolean,
  parseDate,
  parseTags,
  cleanString,
  logProgress,
  logMigrationResult,
  type MigrationResult,
} from '../lib/migration-helpers';

const prisma = new PrismaClient();

interface BrandRecord {
  'unique id': string;
  Creator: string;
  'Brand Name'?: string;
  'Brand Website'?: string;
  'Long Summary'?: string;
  'Short Summary'?: string;
  Logo?: string;
  tags?: string;
  verified?: string;
  'Advertising Goals'?: string;
  'Campaign Budget'?: string;
  'Creation Date'?: string;
  'Modified Date'?: string;
}

interface NewsletterRecord {
  'unique id': string;
  Owner?: string;
  Creator?: string;
  'Business Name'?: string;
  'Website URL'?: string;
  'Summary - Long'?: string;
  'Summary - Short'?: string;
  'Profile Image'?: string;
  'Newsletter Tags'?: string;
  VERIFIED?: string;
  'Newletter Category'?: string;
  'Newsletter Freq'?: string;
  'Starting Price'?: string;
  'Social - FB URL'?: string;
  'Social - Twitter'?: string;
  'Creation Date'?: string;
  'Modified Date'?: string;
}

interface DualOwner {
  email: string;
  brandIds: string[];
  newsletterIds: string[];
}

async function loadDualOwners(): Promise<Set<string>> {
  const dualOwnersPath = path.join(process.cwd(), 'dual-owners-report.json');

  if (!fs.existsSync(dualOwnersPath)) {
    console.log('⚠️  No dual-owners-report.json found. Proceeding without exclusions.\n');
    return new Set();
  }

  const dualOwners: DualOwner[] = JSON.parse(
    fs.readFileSync(dualOwnersPath, 'utf-8')
  );

  return new Set(dualOwners.map((o) => o.email.toLowerCase()));
}

async function getUserIdByEmail(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });
  return user?.id || null;
}

async function migrateBrands(dualOwnerEmails: Set<string>) {
  console.log('🏢 Migrating Brands...\n');

  const brandsPath = path.join(
    process.cwd(),
    'Context/DBMigration/Existing Files/export_All-Brands-modified--_2025-12-11_15-04-28.csv'
  );

  const brands: BrandRecord[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(brandsPath)
      .pipe(csv())
      .on('data', (row: BrandRecord) => brands.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Found ${brands.length} brands to migrate\n`);

  const result: MigrationResult = {
    total: brands.length,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  for (let i = 0; i < brands.length; i++) {
    const brand = brands[i];

    if (i % 50 === 0) {
      logProgress('Brands', i, brands.length);
    }

    try {
      const creatorEmail = brand.Creator?.toLowerCase().trim();

      if (!brand['unique id']) {
        result.skipped++;
        result.errors.push({
          record: brand,
          error: 'Missing unique id',
        });
        continue;
      }

      if (!creatorEmail) {
        result.skipped++;
        result.errors.push({
          record: brand,
          error: 'Missing Creator email',
        });
        continue;
      }

      // Skip dual owners
      if (dualOwnerEmails.has(creatorEmail)) {
        result.skipped++;
        console.log(`  ⊝ Skipping brand (dual owner): ${brand['Brand Name']}`);
        continue;
      }

      // Lookup user
      const userId = await getUserIdByEmail(creatorEmail);
      if (!userId) {
        result.skipped++;
        result.errors.push({
          record: brand,
          error: `User not found for email: ${creatorEmail}`,
        });
        continue;
      }

      // Check if company already exists
      const existing = await prisma.company.findUnique({
        where: { id: brand['unique id'] },
      });

      if (existing) {
        result.skipped++;
        console.log(`  ⊝ Company already exists: ${brand['Brand Name']}`);
        continue;
      }

      // Create company
      await prisma.company.create({
        data: {
          id: brand['unique id'], // CRITICAL: Preserve Bubble ID
          userId,
          creatorEmail,
          name: cleanString(brand['Brand Name']),
          website: cleanString(brand['Brand Website']),
          longSummary: cleanString(brand['Long Summary']),
          shortSummary: cleanString(brand['Short Summary']),
          logoUrl: cleanString(brand.Logo),
          tags: parseTags(brand.tags) || [],
          verified: parseBoolean(brand.verified) ?? false,
          advertisingGoals: cleanString(brand['Advertising Goals']),
          campaignBudget: cleanString(brand['Campaign Budget']),
          isNewsletter: false,
          createdAt: parseDate(brand['Creation Date']),
          updatedAt: parseDate(brand['Modified Date']),
        },
      });

      result.succeeded++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        record: brand,
        error: error.message || 'Unknown error',
      });
      console.error(`  ✗ Failed to migrate brand: ${brand['Brand Name']}`, error.message);
    }
  }

  logProgress('Brands', brands.length, brands.length);
  logMigrationResult('Brand Migration', result);

  return result;
}

async function migrateNewsletters(dualOwnerEmails: Set<string>) {
  console.log('📰 Migrating Newsletters...\n');

  const newslettersPath = path.join(
    process.cwd(),
    'Context/DBMigration/Existing Files/export_All-Newsletters-modified--_2025-12-11_15-05-41.csv'
  );

  const newsletters: NewsletterRecord[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(newslettersPath)
      .pipe(csv())
      .on('data', (row: NewsletterRecord) => newsletters.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Found ${newsletters.length} newsletters to migrate\n`);

  const result: MigrationResult = {
    total: newsletters.length,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  for (let i = 0; i < newsletters.length; i++) {
    const newsletter = newsletters[i];

    if (i % 50 === 0) {
      logProgress('Newsletters', i, newsletters.length);
    }

    try {
      const ownerEmail = (newsletter.Owner || newsletter.Creator)?.toLowerCase().trim();

      if (!newsletter['unique id']) {
        result.skipped++;
        result.errors.push({
          record: newsletter,
          error: 'Missing unique id',
        });
        continue;
      }

      if (!ownerEmail) {
        result.skipped++;
        result.errors.push({
          record: newsletter,
          error: 'Missing Owner/Creator email',
        });
        continue;
      }

      // Skip dual owners
      if (dualOwnerEmails.has(ownerEmail)) {
        result.skipped++;
        console.log(`  ⊝ Skipping newsletter (dual owner): ${newsletter['Business Name']}`);
        continue;
      }

      // Lookup user
      const userId = await getUserIdByEmail(ownerEmail);
      if (!userId) {
        result.skipped++;
        result.errors.push({
          record: newsletter,
          error: `User not found for email: ${ownerEmail}`,
        });
        continue;
      }

      // Check if company already exists
      const existing = await prisma.company.findUnique({
        where: { id: newsletter['unique id'] },
      });

      if (existing) {
        result.skipped++;
        console.log(`  ⊝ Company already exists: ${newsletter['Business Name']}`);
        continue;
      }

      // Create company (Newsletter)
      await prisma.company.create({
        data: {
          id: newsletter['unique id'], // CRITICAL: Preserve Bubble ID
          userId,
          creatorEmail: ownerEmail,
          name: cleanString(newsletter['Business Name']),
          website: cleanString(newsletter['Website URL']),
          longSummary: cleanString(newsletter['Summary - Long']), // Populate main summary
          shortSummary: cleanString(newsletter['Summary - Short']), // Populate main summary
          newsletterSummaryLong: cleanString(newsletter['Summary - Long']), // Store separately
          newsletterSummaryShort: cleanString(newsletter['Summary - Short']), // Store separately
          logoUrl: cleanString(newsletter['Profile Image']),
          tags: parseTags(newsletter['Newsletter Tags']) || [],
          verified: parseBoolean(newsletter.VERIFIED) ?? false,
          newsletterCategory: cleanString(newsletter['Newletter Category']),
          newsletterFreq: cleanString(newsletter['Newsletter Freq']),
          newsletterStartingPrice: cleanString(newsletter['Starting Price']),
          socialFbUrl: cleanString(newsletter['Social - FB URL']),
          socialTwitterUrl: cleanString(newsletter['Social - Twitter']),
          isNewsletter: true, // CRITICAL FLAG
          createdAt: parseDate(newsletter['Creation Date']),
          updatedAt: parseDate(newsletter['Modified Date']),
        },
      });

      result.succeeded++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        record: newsletter,
        error: error.message || 'Unknown error',
      });
      console.error(
        `  ✗ Failed to migrate newsletter: ${newsletter['Business Name']}`,
        error.message
      );
    }
  }

  logProgress('Newsletters', newsletters.length, newsletters.length);
  logMigrationResult('Newsletter Migration', result);

  return result;
}

async function migrateCompanies() {
  console.log('🏭 Starting Company Migration (Brands + Newsletters)...\n');

  const dualOwnerEmails = await loadDualOwners();
  console.log(`Loaded ${dualOwnerEmails.size} dual owner emails to exclude\n`);

  const brandResult = await migrateBrands(dualOwnerEmails);
  const newsletterResult = await migrateNewsletters(dualOwnerEmails);

  const totalResult: MigrationResult = {
    total: brandResult.total + newsletterResult.total,
    succeeded: brandResult.succeeded + newsletterResult.succeeded,
    failed: brandResult.failed + newsletterResult.failed,
    skipped: brandResult.skipped + newsletterResult.skipped,
    errors: [...brandResult.errors, ...newsletterResult.errors],
  };

  logMigrationResult('Total Company Migration', totalResult);

  return totalResult;
}

migrateCompanies()
  .then((result) => {
    if (result.failed === 0) {
      console.log('✅ Company migration completed successfully!\n');
      process.exit(0);
    } else {
      console.log('⚠️  Company migration completed with errors. Please review the errors above.\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Company migration failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
