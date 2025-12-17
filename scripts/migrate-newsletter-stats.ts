/**
 * Script 5: Migrate Newsletter Stats
 * Migrates Newsletter Stats from Bubble CSV to PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import {
  parseDate,
  parseInt as parseIntHelper,
  parseFloat as parseFloatHelper,
  cleanString,
  logProgress,
  logMigrationResult,
  type MigrationResult,
} from '../lib/migration-helpers';

const prisma = new PrismaClient();

interface NewsletterStatsRecord {
  'unique id': string;
  Newsletter?: string;
  date?: string;
  Updated?: string;
  Subscribers?: string;
  'Open Rate'?: string;
  CTR?: string;
  Proof?: string;
  'Creation Date'?: string;
}

async function getCompanyByNewsletterId(newsletterId: string): Promise<{ id: string } | null> {
  const company = await prisma.company.findUnique({
    where: {
      id: newsletterId,
      isNewsletter: true, // Ensure it's a newsletter
    },
    select: { id: true },
  });
  return company;
}

async function migrateNewsletterStats() {
  console.log('📊 Starting Newsletter Stats Migration...\n');

  const statsPath = path.join(
    process.cwd(),
    'Context/DBMigration/Existing Files/export_All-Newsletter-Stats-modified_2025-12-11_15-05-26.csv'
  );

  const stats: NewsletterStatsRecord[] = [];

  // Read CSV
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(statsPath)
      .pipe(csv())
      .on('data', (row: NewsletterStatsRecord) => stats.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Found ${stats.length} newsletter stats to migrate\n`);

  const result: MigrationResult = {
    total: stats.length,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  // Track latest proof URLs per company
  const latestProofUrls = new Map<string, { proof: string; date: Date }>();

  // Migrate each stat record
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];

    if (i % 50 === 0) {
      logProgress('Newsletter Stats', i, stats.length);
    }

    try {
      // Validate Newsletter ID
      if (!stat.Newsletter) {
        result.skipped++;
        result.errors.push({
          record: stat,
          error: 'Missing Newsletter ID',
        });
        continue;
      }

      // Lookup Company by Newsletter ID
      const company = await getCompanyByNewsletterId(stat.Newsletter.trim());
      if (!company) {
        result.skipped++;
        result.errors.push({
          record: stat,
          error: `Newsletter (Company) not found for ID: ${stat.Newsletter}`,
        });
        continue;
      }

      // Determine the date for this stat
      const statDate = parseDate(stat.date || stat.Updated || stat['Creation Date']);

      // Create newsletter stats record
      await prisma.newsletterStats.create({
        data: {
          companyId: company.id,
          date: statDate,
          subscribers: parseIntHelper(stat.Subscribers),
          openRate: parseFloatHelper(stat['Open Rate']),
          clickRate: parseFloatHelper(stat.CTR),
          createdAt: parseDate(stat['Creation Date']),
        },
      });

      // Track latest proof URL for this company
      if (stat.Proof && cleanString(stat.Proof)) {
        const existingProof = latestProofUrls.get(company.id);
        if (!existingProof || statDate > existingProof.date) {
          latestProofUrls.set(company.id, {
            proof: cleanString(stat.Proof)!,
            date: statDate,
          });
        }
      }

      result.succeeded++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        record: stat,
        error: error.message || 'Unknown error',
      });
      console.error(
        `  ✗ Failed to migrate newsletter stat for Newsletter: ${stat.Newsletter}`,
        error.message
      );
    }
  }

  // Update companies with latest proof URLs
  console.log(`\n📸 Updating ${latestProofUrls.size} companies with latest proof URLs...\n`);

  for (const [companyId, { proof }] of latestProofUrls.entries()) {
    try {
      await prisma.company.update({
        where: { id: companyId },
        data: { newsletterProofUrl: proof },
      });
    } catch (error: any) {
      console.warn(`  ⚠ Failed to update proof URL for company ${companyId}:`, error.message);
    }
  }

  logProgress('Newsletter Stats', stats.length, stats.length);
  logMigrationResult('Newsletter Stats Migration', result);

  console.log(`✓ Updated ${latestProofUrls.size} companies with proof URLs\n`);

  return result;
}

migrateNewsletterStats()
  .then((result) => {
    if (result.failed === 0) {
      console.log('✅ Newsletter stats migration completed successfully!\n');
      process.exit(0);
    } else {
      console.log('⚠️  Newsletter stats migration completed with errors. Please review the errors above.\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Newsletter stats migration failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
