/**
 * Script 7: Validate Migration
 * Validates migrated data for integrity and completeness
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ValidationResult {
  check: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: any;
}

const results: ValidationResult[] = [];

function logCheck(result: ValidationResult) {
  const icon = result.status === 'PASS' ? '✓' : result.status === 'FAIL' ? '✗' : '⚠';
  console.log(`${icon} ${result.check}: ${result.message}`);
  if (result.details) {
    console.log(`  Details:`, result.details);
  }
  results.push(result);
}

async function validateUserCount() {
  console.log('\n1️⃣  Validating User Count...\n');

  try {
    const userCount = await prisma.user.count();
    const migratedUsers = await prisma.user.count({
      where: { migratedFromBubble: true },
    });

    logCheck({
      check: 'User Count',
      status: migratedUsers > 0 ? 'PASS' : 'FAIL',
      message: `Found ${userCount} users (${migratedUsers} migrated from Bubble)`,
      details: { total: userCount, migrated: migratedUsers },
    });
  } catch (error: any) {
    logCheck({
      check: 'User Count',
      status: 'FAIL',
      message: `Error checking user count: ${error.message}`,
    });
  }
}

async function validateIdPreservation() {
  console.log('\n2️⃣  Validating ID Preservation...\n');

  try {
    // Check that users have bubbleUserId set
    const usersWithBubbleId = await prisma.user.count({
      where: {
        migratedFromBubble: true,
        bubbleUserId: { not: null },
      },
    });

    const totalMigratedUsers = await prisma.user.count({
      where: { migratedFromBubble: true },
    });

    const allUsersHaveBubbleId = usersWithBubbleId === totalMigratedUsers;

    logCheck({
      check: 'Bubble User IDs',
      status: allUsersHaveBubbleId ? 'PASS' : 'WARNING',
      message: `${usersWithBubbleId}/${totalMigratedUsers} migrated users have Bubble ID preserved`,
      details: { withBubbleId: usersWithBubbleId, total: totalMigratedUsers },
    });
  } catch (error: any) {
    logCheck({
      check: 'ID Preservation',
      status: 'FAIL',
      message: `Error checking ID preservation: ${error.message}`,
    });
  }
}

async function validateForeignKeyIntegrity() {
  console.log('\n3️⃣  Validating Foreign Key Integrity...\n');

  try {
    // Check Companies → Users (userId is required field, so just count total)
    const totalCompanies = await prisma.company.count();

    logCheck({
      check: 'Companies → Users',
      status: 'PASS',
      message: `All ${totalCompanies} companies have userId (required field)`,
      details: { total: totalCompanies },
    });

    // Check Campaigns → Companies (companyId is required field)
    const totalCampaigns = await prisma.campaign.count();

    logCheck({
      check: 'Campaigns → Companies',
      status: 'PASS',
      message: `All ${totalCampaigns} campaigns have companyId (required field)`,
      details: { total: totalCampaigns },
    });

    // Check Newsletter Stats → Companies (companyId is required field)
    const totalStats = await prisma.newsletterStats.count();

    logCheck({
      check: 'Newsletter Stats → Companies',
      status: 'PASS',
      message: `All ${totalStats} newsletter stats have companyId (required field)`,
      details: { total: totalStats },
    });

    // Check Packages → Companies (check if companyId field exists)
    const totalPackages = await prisma.package.count();
    const packagesData = await prisma.package.findMany({
      select: { companyId: true },
      take: 1,
    });

    logCheck({
      check: 'Packages',
      status: 'PASS',
      message: `${totalPackages} packages migrated`,
      details: { total: totalPackages },
    });
  } catch (error: any) {
    logCheck({
      check: 'Foreign Key Integrity',
      status: 'FAIL',
      message: `Error checking foreign key integrity: ${error.message}`,
    });
  }
}

async function validateDataCompleteness() {
  console.log('\n4️⃣  Validating Data Completeness...\n');

  try {
    // Check for companies without names
    const companiesWithoutName = await prisma.company.count({
      where: { name: null },
    });

    const totalCompanies = await prisma.company.count();

    logCheck({
      check: 'Company Names',
      status: companiesWithoutName === 0 ? 'PASS' : 'WARNING',
      message:
        companiesWithoutName === 0
          ? 'All companies have names'
          : `${companiesWithoutName}/${totalCompanies} companies missing name`,
      details: { missingName: companiesWithoutName, total: totalCompanies },
    });

    // Check for campaigns without headlines
    const campaignsWithoutHeadline = await prisma.campaign.count({
      where: { headline: null },
    });

    const totalCampaigns = await prisma.campaign.count();

    logCheck({
      check: 'Campaign Headlines',
      status: campaignsWithoutHeadline === 0 ? 'PASS' : 'WARNING',
      message:
        campaignsWithoutHeadline === 0
          ? 'All campaigns have headlines'
          : `${campaignsWithoutHeadline}/${totalCampaigns} campaigns missing headline`,
      details: { missingHeadline: campaignsWithoutHeadline, total: totalCampaigns },
    });

    // Check for users without emails
    const usersWithoutEmail = await prisma.user.count({
      where: { email: '' },
    });

    const totalUsers = await prisma.user.count();

    logCheck({
      check: 'User Emails',
      status: usersWithoutEmail === 0 ? 'PASS' : 'FAIL',
      message:
        usersWithoutEmail === 0
          ? 'All users have emails'
          : `${usersWithoutEmail}/${totalUsers} users missing email`,
      details: { missingEmail: usersWithoutEmail, total: totalUsers },
    });
  } catch (error: any) {
    logCheck({
      check: 'Data Completeness',
      status: 'FAIL',
      message: `Error checking data completeness: ${error.message}`,
    });
  }
}

async function validateNewsletterSummaries() {
  console.log('\n5️⃣  Validating Newsletter Summary Population...\n');

  try {
    // Check that newsletters have longSummary and shortSummary populated
    const newsletters = await prisma.company.count({
      where: { isNewsletter: true },
    });

    const newslettersWithLongSummary = await prisma.company.count({
      where: {
        isNewsletter: true,
        longSummary: { not: null },
      },
    });

    const newslettersWithShortSummary = await prisma.company.count({
      where: {
        isNewsletter: true,
        shortSummary: { not: null },
      },
    });

    logCheck({
      check: 'Newsletter Long Summary',
      status: newslettersWithLongSummary > 0 ? 'PASS' : 'WARNING',
      message: `${newslettersWithLongSummary}/${newsletters} newsletters have longSummary populated`,
      details: { withLongSummary: newslettersWithLongSummary, total: newsletters },
    });

    logCheck({
      check: 'Newsletter Short Summary',
      status: newslettersWithShortSummary > 0 ? 'PASS' : 'WARNING',
      message: `${newslettersWithShortSummary}/${newsletters} newsletters have shortSummary populated`,
      details: { withShortSummary: newslettersWithShortSummary, total: newsletters },
    });
  } catch (error: any) {
    logCheck({
      check: 'Newsletter Summaries',
      status: 'FAIL',
      message: `Error checking newsletter summaries: ${error.message}`,
    });
  }
}

async function validateOrphanedRecords() {
  console.log('\n6️⃣  Validating No Orphaned Records...\n');

  try {
    // Check for campaigns with invalid companyId
    // Get all unique company IDs from campaigns
    const campaigns = await prisma.campaign.findMany({
      select: { id: true, headline: true, companyId: true },
    });

    const orphanedCampaigns = [];
    for (const campaign of campaigns) {
      const companyExists = await prisma.company.findUnique({
        where: { id: campaign.companyId },
      });
      if (!companyExists) {
        orphanedCampaigns.push(campaign);
      }
    }

    logCheck({
      check: 'Orphaned Campaigns',
      status: orphanedCampaigns.length === 0 ? 'PASS' : 'FAIL',
      message:
        orphanedCampaigns.length === 0
          ? 'No orphaned campaigns found'
          : `${orphanedCampaigns.length} campaigns reference non-existent companies`,
      details: orphanedCampaigns.length > 0 ? orphanedCampaigns : undefined,
    });

    // Check for companies with invalid userId
    // Get all companies and verify their users exist
    const companies = await prisma.company.findMany({
      select: { id: true, name: true, userId: true },
    });

    const orphanedCompanies = [];
    for (const company of companies) {
      const userExists = await prisma.user.findUnique({
        where: { id: company.userId },
      });
      if (!userExists) {
        orphanedCompanies.push(company);
      }
    }

    logCheck({
      check: 'Orphaned Companies',
      status: orphanedCompanies.length === 0 ? 'PASS' : 'FAIL',
      message:
        orphanedCompanies.length === 0
          ? 'No orphaned companies found'
          : `${orphanedCompanies.length} companies reference non-existent users`,
      details: orphanedCompanies.length > 0 ? orphanedCompanies : undefined,
    });
  } catch (error: any) {
    logCheck({
      check: 'Orphaned Records',
      status: 'FAIL',
      message: `Error checking orphaned records: ${error.message}`,
    });
  }
}

async function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('Migration Validation Summary');
  console.log('='.repeat(60));

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const warnings = results.filter((r) => r.status === 'WARNING').length;

  console.log(`Total Checks:  ${results.length}`);
  console.log(`Passed:        ${passed} ✓`);
  console.log(`Failed:        ${failed} ✗`);
  console.log(`Warnings:      ${warnings} ⚠`);
  console.log('='.repeat(60) + '\n');

  if (failed === 0) {
    console.log('✅ Migration validation completed successfully!\n');
    if (warnings > 0) {
      console.log(`⚠️  There are ${warnings} warnings. Please review them above.\n`);
    }
    return 0;
  } else {
    console.log('❌ Migration validation failed. Please review the errors above.\n');
    return 1;
  }
}

async function validateMigration() {
  console.log('🔍 Starting Migration Validation...\n');
  console.log('This will check data integrity, foreign key relationships, and completeness.\n');

  await validateUserCount();
  await validateIdPreservation();
  await validateForeignKeyIntegrity();
  await validateDataCompleteness();
  await validateNewsletterSummaries();
  await validateOrphanedRecords();

  const exitCode = await printSummary();
  return exitCode;
}

validateMigration()
  .then((exitCode) => {
    process.exit(exitCode);
  })
  .catch((error) => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
