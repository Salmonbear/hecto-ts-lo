/**
 * Script 6: Migrate Packages
 * Migrates Packages from Bubble CSV to PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import {
  parseBoolean,
  parseDate,
  cleanString,
  logProgress,
  logMigrationResult,
  type MigrationResult,
} from '../lib/migration-helpers';

const prisma = new PrismaClient();

interface PackageRecord {
  'unique id': string;
  'Newsletter ID'?: string;
  Title?: string;
  'Short Summary'?: string;
  'Package Detail'?: string;
  Price?: string;
  Status?: string;
  bodyCharacterLimit?: string;
  characterLimit?: string;
  imageReq?: string;
  TextReq?: string;
  'Example Images'?: string;
  validFrom?: string;
  validTo?: string;
  'Creation Date'?: string;
  'Modified Date'?: string;
}

async function getCompanyByNewsletterId(newsletterId: string): Promise<{ id: string } | null> {
  const company = await prisma.company.findUnique({
    where: {
      id: newsletterId,
      isNewsletter: true, // Packages link to newsletters
    },
    select: { id: true },
  });
  return company;
}

async function migratePackages() {
  console.log('📦 Starting Package Migration...\n');

  const packagesPath = path.join(
    process.cwd(),
    'Context/DBMigration/Existing Files/export_All-Packages-modified--_2025-12-11_15-06-09.csv'
  );

  const packages: PackageRecord[] = [];

  // Read CSV
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(packagesPath)
      .pipe(csv())
      .on('data', (row: PackageRecord) => packages.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Found ${packages.length} packages to migrate\n`);

  const result: MigrationResult = {
    total: packages.length,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  // Migrate each package
  for (let i = 0; i < packages.length; i++) {
    const pkg = packages[i];

    if (i % 50 === 0) {
      logProgress('Packages', i, packages.length);
    }

    try {
      // Validate required fields
      if (!pkg['unique id']) {
        result.skipped++;
        result.errors.push({
          record: pkg,
          error: 'Missing unique id',
        });
        continue;
      }

      // Lookup Company by Newsletter ID (optional)
      let companyId: string | null = null;
      if (pkg['Newsletter ID']) {
        const company = await getCompanyByNewsletterId(pkg['Newsletter ID'].trim());
        if (!company) {
          result.skipped++;
          result.errors.push({
            record: pkg,
            error: `Newsletter (Company) not found for ID: ${pkg['Newsletter ID']}`,
          });
          continue;
        }
        companyId = company.id;
      }

      // Check if package already exists
      const existing = await prisma.package.findUnique({
        where: { id: pkg['unique id'] },
      });

      if (existing) {
        result.skipped++;
        console.log(`  ⊝ Package already exists: ${pkg.Title}`);
        continue;
      }

      // Create package
      await prisma.package.create({
        data: {
          id: pkg['unique id'], // CRITICAL: Preserve Bubble ID
          companyId,
          title: cleanString(pkg.Title),
          shortSummary: cleanString(pkg['Short Summary']),
          description: cleanString(pkg['Package Detail']),
          price: cleanString(pkg.Price),
          status: cleanString(pkg.Status),
          bodyCharacterLimit: cleanString(pkg.bodyCharacterLimit),
          characterLimit: cleanString(pkg.characterLimit),
          imageRequired: parseBoolean(pkg.imageReq) ?? false,
          textRequired: parseBoolean(pkg.TextReq) ?? false,
          exampleImageUrl: cleanString(pkg['Example Images']),
          validFrom: pkg.validFrom ? parseDate(pkg.validFrom) : null,
          validTo: pkg.validTo ? parseDate(pkg.validTo) : null,
          createdAt: parseDate(pkg['Creation Date']),
          updatedAt: parseDate(pkg['Modified Date']),
        },
      });

      result.succeeded++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        record: pkg,
        error: error.message || 'Unknown error',
      });
      console.error(`  ✗ Failed to migrate package: ${pkg.Title}`, error.message);
    }
  }

  logProgress('Packages', packages.length, packages.length);
  logMigrationResult('Package Migration', result);

  return result;
}

migratePackages()
  .then((result) => {
    if (result.failed === 0) {
      console.log('✅ Package migration completed successfully!\n');
      process.exit(0);
    } else {
      console.log('⚠️  Package migration completed with errors. Please review the errors above.\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Package migration failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
