import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function analyzeMissingCampaigns() {
  const campaigns: any[] = [];

  await new Promise<void>((resolve) => {
    fs.createReadStream('Context/DBMigration/Existing Files/export_All-Campaigns-modified_2025-12-11_15-14-52.csv')
      .pipe(csv())
      .on('data', (row) => campaigns.push(row))
      .on('end', resolve);
  });

  console.log('Total campaigns in CSV:', campaigns.length);

  let missingBrandRequesting = 0;
  let companyNotFound = 0;
  let alreadyInDb = 0;
  const missingCompanies: any[] = [];

  for (const campaign of campaigns) {
    if (!campaign.brandRequesting) {
      missingBrandRequesting++;
      continue;
    }

    const company = await prisma.company.findUnique({
      where: { id: campaign.brandRequesting.trim() }
    });

    const existingCampaign = await prisma.campaign.findUnique({
      where: { id: campaign['unique id'] }
    });

    if (existingCampaign) {
      alreadyInDb++;
    } else if (!company) {
      companyNotFound++;
      missingCompanies.push({
        brandId: campaign.brandRequesting.trim(),
        campaignHeadline: campaign['Campaign Headline'],
        creator: campaign.Creator
      });
    }
  }

  console.log('\nSummary:');
  console.log('Missing brandRequesting:', missingBrandRequesting);
  console.log('Company not found:', companyNotFound);
  console.log('Already in DB:', alreadyInDb);
  console.log('Expected missing from DB:', missingBrandRequesting + companyNotFound);
  console.log('\nMissing companies (first 10):');
  missingCompanies.slice(0, 10).forEach((mc) => {
    console.log(`  - Brand: ${mc.brandId}, Campaign: "${mc.campaignHeadline}", Creator: ${mc.creator}`);
  });

  await prisma.$disconnect();
}

analyzeMissingCampaigns();
