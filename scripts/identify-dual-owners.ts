/**
 * Script 2: Identify Dual Owners
 * Identifies users who own both a Brand AND a Newsletter
 * These users will be skipped during migration and handled manually
 */

import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

interface BrandRecord {
  Creator: string;
  'unique id': string;
  'Brand Name': string;
}

interface NewsletterRecord {
  Owner?: string;
  Creator?: string;
  'unique id': string;
  'Business Name': string;
}

async function readBrands(): Promise<Map<string, string[]>> {
  const brandsPath = path.join(
    process.cwd(),
    'Context/DBMigration/Existing Files/export_All-Brands-modified--_2025-12-11_15-04-28.csv'
  );

  const brandOwners = new Map<string, string[]>();

  return new Promise((resolve, reject) => {
    fs.createReadStream(brandsPath)
      .pipe(csv())
      .on('data', (row: BrandRecord) => {
        const email = row.Creator?.toLowerCase().trim();
        if (email) {
          if (!brandOwners.has(email)) {
            brandOwners.set(email, []);
          }
          brandOwners.get(email)!.push(row['unique id']);
        }
      })
      .on('end', () => resolve(brandOwners))
      .on('error', reject);
  });
}

async function readNewsletters(): Promise<Map<string, string[]>> {
  const newslettersPath = path.join(
    process.cwd(),
    'Context/DBMigration/Existing Files/export_All-Newsletters-modified--_2025-12-11_15-05-41.csv'
  );

  const newsletterOwners = new Map<string, string[]>();

  return new Promise((resolve, reject) => {
    fs.createReadStream(newslettersPath)
      .pipe(csv())
      .on('data', (row: NewsletterRecord) => {
        const email = (row.Owner || row.Creator)?.toLowerCase().trim();
        if (email) {
          if (!newsletterOwners.has(email)) {
            newsletterOwners.set(email, []);
          }
          newsletterOwners.get(email)!.push(row['unique id']);
        }
      })
      .on('end', () => resolve(newsletterOwners))
      .on('error', reject);
  });
}

async function identifyDualOwners() {
  console.log('🔍 Identifying users who own both Brands AND Newsletters...\n');

  const brandOwners = await readBrands();
  const newsletterOwners = await readNewsletters();

  console.log(`Found ${brandOwners.size} brand owners`);
  console.log(`Found ${newsletterOwners.size} newsletter owners\n`);

  const dualOwners: {
    email: string;
    brandIds: string[];
    newsletterIds: string[];
  }[] = [];

  // Find emails that appear in both maps
  for (const [email, brandIds] of brandOwners.entries()) {
    if (newsletterOwners.has(email)) {
      dualOwners.push({
        email,
        brandIds,
        newsletterIds: newsletterOwners.get(email)!,
      });
    }
  }

  // Write results to file
  const outputPath = path.join(process.cwd(), 'dual-owners-report.json');
  fs.writeFileSync(outputPath, JSON.stringify(dualOwners, null, 2));

  // Print summary
  console.log(`${'='.repeat(60)}`);
  console.log(`Dual Owner Identification Results`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total Dual Owners Found: ${dualOwners.length}`);
  console.log(`Report saved to: dual-owners-report.json`);
  console.log(`${'='.repeat(60)}\n`);

  if (dualOwners.length > 0) {
    console.log('Dual owners list:');
    dualOwners.forEach((owner, idx) => {
      console.log(
        `  ${idx + 1}. ${owner.email} (${owner.brandIds.length} brands, ${owner.newsletterIds.length} newsletters)`
      );
    });
    console.log('\n⚠️  These users will be SKIPPED during automatic migration.');
    console.log('They must be handled manually after migration.\n');
  }
}

identifyDualOwners()
  .then(() => {
    console.log('✅ Dual owner identification complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error identifying dual owners:', error);
    process.exit(1);
  });
