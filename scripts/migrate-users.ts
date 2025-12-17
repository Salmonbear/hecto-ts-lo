/**
 * Script 1: Migrate Users
 * Migrates all Users from Bubble CSV to PostgreSQL
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import * as bcrypt from 'bcryptjs';
import {
  parseBoolean,
  parseDate,
  cleanString,
  logProgress,
  logMigrationResult,
  type MigrationResult,
} from '../lib/migration-helpers';

const prisma = new PrismaClient();

interface UserRecord {
  'unique id': string;
  email: string;
  firstName?: string;
  lastName?: string;
  Intention?: string;
  'Mail OptIn'?: string;
  profilePic?: string;
  'Stripe Seller ID'?: string;
  'Creation Date'?: string;
  'Modified Date'?: string;
}

async function migrateUsers() {
  console.log('👥 Starting User Migration...\n');

  const usersPath = path.join(
    process.cwd(),
    'Context/DBMigration/Existing Files/export_All-Users-modified--_2025-12-11_15-06-30.csv'
  );

  const users: UserRecord[] = [];

  // Read CSV
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(usersPath)
      .pipe(csv())
      .on('data', (row: UserRecord) => users.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Found ${users.length} users to migrate\n`);

  const result: MigrationResult = {
    total: users.length,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  // Hash temporary password once
  const tempPassword = await bcrypt.hash('TEMP_PASSWORD_RESET_REQUIRED', 10);

  // Migrate each user
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    if (i % 100 === 0) {
      logProgress('Users', i, users.length);
    }

    try {
      // Validate required fields
      if (!user['unique id'] || !user.email) {
        result.skipped++;
        result.errors.push({
          record: user,
          error: 'Missing required field: unique id or email',
        });
        continue;
      }

      // Check if user already exists
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            { id: user['unique id'] },
            { email: user.email },
          ],
        },
      });

      if (existing) {
        result.skipped++;
        console.log(`  ⊝ User already exists: ${user.email}`);
        continue;
      }

      // Create user with preserved Bubble ID
      await prisma.user.create({
        data: {
          id: user['unique id'], // CRITICAL: Preserve exact Bubble ID
          email: user.email,
          password: tempPassword,
          firstName: cleanString(user.firstName),
          lastName: cleanString(user.lastName),
          intention: cleanString(user.Intention),
          mailOptIn: parseBoolean(user['Mail OptIn']) ?? false,
          profilePic: cleanString(user.profilePic),
          stripeSellerId: cleanString(user['Stripe Seller ID']),
          migratedFromBubble: true,
          bubbleUserId: user['unique id'],
          passwordResetRequired: true,
          migrationDate: new Date(),
          createdAt: parseDate(user['Creation Date']),
          updatedAt: parseDate(user['Modified Date']),
        },
      });

      result.succeeded++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        record: user,
        error: error.message || 'Unknown error',
      });
      console.error(`  ✗ Failed to migrate user: ${user.email}`, error.message);
    }
  }

  logProgress('Users', users.length, users.length);
  logMigrationResult('User Migration', result);

  return result;
}

migrateUsers()
  .then((result) => {
    if (result.failed === 0) {
      console.log('✅ User migration completed successfully!\n');
      process.exit(0);
    } else {
      console.log('⚠️  User migration completed with errors. Please review the errors above.\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ User migration failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
