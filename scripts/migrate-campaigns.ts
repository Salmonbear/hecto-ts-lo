/**
 * Script 4: Migrate Campaigns
 * Migrates Campaigns from Bubble CSV to PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import {
  parseDate,
  parseArray,
  cleanString,
  logProgress,
  logMigrationResult,
  type MigrationResult,
} from '../lib/migration-helpers';

const prisma = new PrismaClient();

interface CampaignRecord {
  'unique id': string;
  brandRequesting?: string;
  Creator?: string;
  'Campaign Headline'?: string;
  'Campaign Long Description'?: string;
  targetAudience?: string;
  acceptedPartnershipTypes?: string;
  'Creation Date'?: string;
  'Modified Date'?: string;
}

async function getCompanyIdByBubbleId(bubbleId: string): Promise<string | null> {
  const company = await prisma.company.findUnique({
    where: { id: bubbleId },
    select: { id: true },
  });
  return company?.id || null;
}

async function getUserIdByEmail(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });
  return user?.id || null;
}

async function migrateCampaigns() {
  console.log('📢 Starting Campaign Migration...\n');

  const campaignsPath = path.join(
    process.cwd(),
    'Context/DBMigration/Existing Files/export_All-Campaigns-modified_2025-12-11_15-14-52.csv'
  );

  const campaigns: CampaignRecord[] = [];

  // Read CSV
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(campaignsPath)
      .pipe(csv())
      .on('data', (row: CampaignRecord) => campaigns.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Found ${campaigns.length} campaigns to migrate\n`);

  const result: MigrationResult = {
    total: campaigns.length,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  // Migrate each campaign
  for (let i = 0; i < campaigns.length; i++) {
    const campaign = campaigns[i];

    if (i % 50 === 0) {
      logProgress('Campaigns', i, campaigns.length);
    }

    try {
      // Validate required fields
      if (!campaign['unique id']) {
        result.skipped++;
        result.errors.push({
          record: campaign,
          error: 'Missing unique id',
        });
        continue;
      }

      // Lookup Company by brandRequesting (Bubble Brand ID)
      let companyId: string | null = null;
      if (campaign.brandRequesting) {
        companyId = await getCompanyIdByBubbleId(campaign.brandRequesting.trim());
        if (!companyId) {
          result.skipped++;
          result.errors.push({
            record: campaign,
            error: `Company not found for brandRequesting ID: ${campaign.brandRequesting}`,
          });
          continue;
        }
      } else {
        result.skipped++;
        result.errors.push({
          record: campaign,
          error: 'Missing brandRequesting field',
        });
        continue;
      }

      // Lookup User by Creator email (optional)
      let creatorId: string | null = null;
      if (campaign.Creator) {
        const creatorEmail = campaign.Creator.toLowerCase().trim();
        creatorId = await getUserIdByEmail(creatorEmail);
        if (!creatorId) {
          console.warn(`  ⚠ Creator not found for email: ${creatorEmail} (campaign will still be created)`);
        }
      }

      // Check if campaign already exists
      const existing = await prisma.campaign.findUnique({
        where: { id: campaign['unique id'] },
      });

      if (existing) {
        result.skipped++;
        console.log(`  ⊝ Campaign already exists: ${campaign['Campaign Headline']}`);
        continue;
      }

      // Create campaign
      await prisma.campaign.create({
        data: {
          id: campaign['unique id'], // CRITICAL: Preserve Bubble ID
          companyId,
          creatorId,
          headline: cleanString(campaign['Campaign Headline']),
          longDescription: cleanString(campaign['Campaign Long Description']),
          targetAudience: cleanString(campaign.targetAudience),
          acceptedPartnershipTypes: parseArray(campaign.acceptedPartnershipTypes) || [],
          createdAt: parseDate(campaign['Creation Date']),
          updatedAt: parseDate(campaign['Modified Date']),
        },
      });

      result.succeeded++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        record: campaign,
        error: error.message || 'Unknown error',
      });
      console.error(
        `  ✗ Failed to migrate campaign: ${campaign['Campaign Headline']}`,
        error.message
      );
    }
  }

  logProgress('Campaigns', campaigns.length, campaigns.length);
  logMigrationResult('Campaign Migration', result);

  return result;
}

migrateCampaigns()
  .then((result) => {
    if (result.failed === 0) {
      console.log('✅ Campaign migration completed successfully!\n');
      process.exit(0);
    } else {
      console.log('⚠️  Campaign migration completed with errors. Please review the errors above.\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Campaign migration failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
