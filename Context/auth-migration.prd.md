# Authentication Migration PRD
## Migrating from Bubble.io to Next.js + NextAuth.js

---

## Overview

Migrate authentication system from Bubble.io to a self-hosted Next.js application using NextAuth.js, while preserving all existing user data and maintaining referential integrity across related database objects (Companies, Campaigns, Pitches, Messages).

**Critical Requirement:** User IDs must be preserved exactly as they exist in Bubble.io to maintain foreign key relationships.

**Migration Scope:** ~3,000 users migrating simultaneously.

---

## Goals

1. **Zero Data Loss**: All users migrate successfully with preserved IDs
2. **Seamless Transition**: Users can log in immediately after migration (with password reset)
3. **Referential Integrity**: All relationships (User → Company → Campaigns → Pitches → Messages) remain intact
4. **Security**: Implement industry-standard password hashing and session management
5. **Scalability**: Support future growth with modern auth infrastructure

---

## Current State (Bubble.io)

### Data Structure
```
User (Bubble ID)
  ↓
Company (user_id references User)
  ↓
Subscription (company_id references Company)
  ↓
Campaigns (company_id references Company)
  ↓
Pitches (campaign_id references Campaign)
  ↓
Messages (pitch_id references Pitch)
```

### User Data in Bubble
- User ID (unique identifier - **MUST PRESERVE**)
- Email address
- Password (hashed - **NOT ACCESSIBLE** from Bubble)
- Name
- Created date
- Custom fields (if any)

### Authentication Method
- Email/password login
- Session management via Bubble

### Migration Details
- **Total Users**: ~3,000
- **Password Hashes**: Not available from Bubble (will require password reset)
- **Export Format**: JSON (preferred) or CSV
- **Rollout**: All users migrate simultaneously (big bang approach)

---

## Target State (Next.js)

### Technology Stack
- **Framework**: Next.js 13.5.4
- **Auth Library**: NextAuth.js v4
- **Database**: PostgreSQL (via Supabase or self-hosted)
- **ORM**: Prisma
- **Email Service**: Resend (for password reset emails)
- **Password Hashing**: bcryptjs

### Authentication Features
- Email/password login
- Password reset flow (required for all migrated users)
- Session management (JWT)
- Protected routes
- Email verification (optional, future)

---

## Migration Strategy

### Phase 1: Pre-Migration Setup

#### 1.1 Database Schema Design

**Critical**: User table must use custom ID field that matches Bubble IDs exactly.

```prisma
model User {
  id                    String    @id @default("") // Custom ID from Bubble - NO auto-generation
  email                 String    @unique
  emailVerified         DateTime?
  name                  String?
  password              String?   // Will be set during migration
  image                 String?
  
  // Migration tracking
  migratedFromBubble    Boolean   @default(false)
  bubbleUserId          String?   @unique // Original Bubble ID (same as id for migrated users)
  migrationDate         DateTime?
  passwordResetRequired Boolean   @default(false)
  
  // Timestamps
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  // Relationships
  accounts              Account[]
  sessions              Session[]
  companies             Company[] // User → Company relationship
}

model Company {
  id        String   @id @default(cuid())
  userId    String   // References User.id (Bubble ID preserved)
  // ... other fields
  user      User     @relation(fields: [userId], references: [id])
  campaigns Campaign[]
}
```

#### 1.2 Export Data from Bubble.io

**Required Exports:**

1. **Users Table** (JSON format)
   - Export all users as JSON
   - Fields: `id`, `email`, `name`, `created_date`, `custom_fields`
   - **Note**: Password hashes NOT available from Bubble

2. **Related Data Mapping**
   - Export mapping of User IDs to Company IDs
   - Verify foreign key relationships before migration

**Export Instructions:**
1. Go to Bubble.io Data tab → Users
2. Click "Export" → Select "JSON"
3. Include fields: `id`, `email`, `name`, `created_date`
4. Save as `bubble-users-export.json` in project root

#### 1.3 Environment Setup

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/hecto"

# NextAuth
NEXTAUTH_URL="https://app.hecto.io"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email (Resend)
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="noreply@hecto.io"
```

---

### Phase 2: User Migration

#### 2.1 Migration Script

**Location**: `scripts/migrate-users.ts`

**Process**:
1. Read exported Bubble users JSON file
2. For each user (~3,000 users):
   - Check if user already exists (by email or Bubble ID)
   - Create user with **exact Bubble ID** as primary key
   - Set `migratedFromBubble: true`
   - Set `passwordResetRequired: true` (passwords unavailable)
   - Store temporary placeholder password (users must reset)
3. Log migration results (success/failure for each user)
4. Generate migration report

**Key Implementation Details**:

```typescript
// CRITICAL: Use Bubble ID directly, no auto-generation
await prisma.user.create({
  data: {
    id: bubbleUser.id, // Preserve exact Bubble ID
    email: bubbleUser.email,
    name: bubbleUser.name || null,
    password: await hash('TEMP_PASSWORD_RESET_REQUIRED', 10),
    migratedFromBubble: true,
    bubbleUserId: bubbleUser.id,
    passwordResetRequired: true,
    migrationDate: new Date(),
    createdAt: new Date(bubbleUser.created_date),
  }
});
```

**Expected Duration**: ~5-10 minutes for 3,000 users (depending on database performance)

#### 2.2 Password Handling Strategy

**Problem**: Bubble.io doesn't expose password hashes.

**Solution**: Require password reset for all migrated users.

**Implementation**:
1. Set `passwordResetRequired: true` flag on all migrated users
2. On first login attempt, redirect to password reset flow
3. Send welcome email with password reset link immediately after migration
4. After reset, clear `passwordResetRequired` flag

**User Flow**:
1. User tries to log in with old password → Error: "Password reset required"
2. User clicks "Reset Password" → Receives email with reset link
3. User sets new password → Can log in successfully

---

### Phase 3: Authentication Implementation

#### 3.1 NextAuth.js Configuration

**File**: `pages/api/auth/[...nextauth].ts`

**Features**:
- Credentials provider (email/password)
- Session management (JWT)
- Password reset flow integration

**Password Reset Required Check**:
```typescript
async authorize(credentials) {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  });
  
  if (user?.passwordResetRequired) {
    throw new Error('PASSWORD_RESET_REQUIRED');
  }
  
  // Normal login flow...
}
```

#### 3.2 Protected Routes

**Implementation**: Middleware or HOC to check authentication

**Routes to Protect**:
- `/app/*` - All app pages
- `/api/campaigns/*` - Campaign APIs
- `/api/pitches/*` - Pitch APIs

**Public Routes**:
- `/login`
- `/signup`
- `/reset-password`
- `/forgot-password`
- `/landing`

#### 3.3 Password Reset Flow

**Pages**:
- `/forgot-password` - Request reset
- `/reset-password?token=xxx` - Set new password

**API Routes**:
- `POST /api/auth/forgot-password` - Generate reset token
- `POST /api/auth/reset-password` - Validate token and update password

**Email Template**: Welcome email with reset link for migrated users

---

### Phase 4: User Communication

#### 4.1 Pre-Migration Email

**Sent**: 1 week before migration

**Content**:
- Announcement of platform upgrade
- Migration date and time
- What to expect (password reset required)
- Support contact: support@hecto.io

**Subject**: "Important: Platform Upgrade - Action Required"

#### 4.2 Migration Day Email

**Sent**: Immediately after migration completes (~5-10 minutes)

**Content**:
- Welcome to new platform
- Password reset required (with reset link)
- Login instructions
- Support contact

**Subject**: "Welcome to Hecto - Set Your New Password"

**Bulk Send**: Use Resend batch API to send to all 3,000 users

#### 4.3 Post-Migration Follow-up

**Sent**: 3 days after migration

**Content**:
- Reminder to reset password if not done
- Tips for using new platform
- Feedback request

**Subject**: "Complete Your Account Setup"

---

### Phase 5: Testing & Validation

#### 5.1 Pre-Production Testing

**Test Users**:
- Create 10-20 test users in Bubble
- Migrate test users
- Verify:
  - User IDs preserved exactly
  - Login works (after password reset)
  - Related data accessible (Companies, Campaigns)
  - Foreign keys intact
  - Email delivery works

#### 5.2 Data Validation

**Automated Checks**:
- [ ] All users migrated (count = 3,000)
- [ ] No duplicate emails
- [ ] All user IDs preserved exactly (match Bubble IDs)
- [ ] Company → User relationships intact
- [ ] Campaign → Company relationships intact
- [ ] Pitch → Campaign relationships intact
- [ ] Message → Pitch relationships intact
- [ ] All `passwordResetRequired` flags set to `true`

**Validation Script**: `scripts/validate-migration.ts`

#### 5.3 User Acceptance Testing

**Test Scenarios**:
1. Migrated user logs in → redirected to password reset
2. User resets password → can log in successfully
3. User accesses dashboard → sees their campaigns
4. User creates new campaign → works correctly
5. User receives pitch → notification works
6. Email delivery → all emails received

---

### Phase 6: Rollout Plan

#### 6.1 Big Bang Migration (All Users)

**Timeline**: Single migration event

**Steps**:
1. **Pre-Migration** (1 week before):
   - Send pre-migration email
   - Database backup
   - Final testing

2. **Migration Day**:
   - **T-1 hour**: Final database backup
   - **T-0**: Run migration script
   - **T+5 min**: Validate migration (automated checks)
   - **T+10 min**: Send password reset emails (batch)
   - **T+15 min**: Monitor support channels
   - **T+30 min**: Verify email delivery

3. **Post-Migration** (Day 1-3):
   - Monitor login success rate
   - Track password reset completions
   - Support ticket triage
   - Send follow-up email

**Duration**: ~30 minutes total migration time

#### 6.2 Rollback Plan

**If Critical Issues**:
1. Keep Bubble.io running in parallel during migration
2. Maintain ability to route traffic back to Bubble (DNS/load balancer)
3. Database backup before migration (can restore if needed)
4. Ability to rollback DNS/routing within 5 minutes

**Rollback Triggers**:
- >5% of users unable to log in after 24 hours
- Data integrity issues discovered
- Critical bugs in new auth system
- Email delivery failure >10%

**Rollback Process**:
1. Route traffic back to Bubble.io
2. Investigate issues
3. Fix and retry migration

---

## Technical Implementation Details

### Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                    String    @id // Custom ID from Bubble - NO auto-generation
  email                 String    @unique
  emailVerified         DateTime?
  name                  String?
  password              String?   // bcrypt hash
  image                 String?
  
  // Migration tracking
  migratedFromBubble    Boolean   @default(false)
  bubbleUserId          String?   @unique
  migrationDate         DateTime?
  passwordResetRequired Boolean   @default(false)
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  // NextAuth relationships
  accounts              Account[]
  sessions              Session[]
  
  // App relationships
  companies             Company[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  expires   DateTime
  createdAt DateTime @default(now())

  @@index([token])
  @@index([email])
}

// Existing app models (preserve foreign keys)
model Company {
  id        String   @id @default(cuid())
  userId    String   // References User.id (Bubble ID preserved)
  // ... other fields
  user      User     @relation(fields: [userId], references: [id])
  campaigns Campaign[]
}

model Campaign {
  id        String   @id @default(cuid())
  companyId String
  // ... other fields
  company   Company  @relation(fields: [companyId], references: [id])
  pitches   Pitch[]
}

model Pitch {
  id         String   @id @default(cuid())
  campaignId String
  // ... other fields
  campaign   Campaign @relation(fields: [campaignId], references: [id])
  messages   Message[]
}

model Message {
  id       String   @id @default(cuid())
  pitchId  String
  // ... other fields
  pitch    Pitch    @relation(fields: [pitchId], references: [id])
}
```

### Migration Script Structure

```typescript
// scripts/migrate-users.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

interface BubbleUser {
  id: string; // Bubble User ID - MUST PRESERVE
  email: string;
  name?: string;
  created_date: string;
  // Add other fields from Bubble export
}

async function migrateUsers() {
  const prisma = new PrismaClient();
  
  try {
    // Read exported JSON data
    const filePath = path.join(process.cwd(), 'bubble-users-export.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const users: BubbleUser[] = JSON.parse(fileContent);
    
    console.log(`Found ${users.length} users to migrate`);
    
    const results = {
      migrated: 0,
      skipped: 0,
      errors: 0,
      errorDetails: [] as string[],
      startTime: new Date(),
    };
    
    // Process users in batches to avoid overwhelming database
    const batchSize = 100;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(users.length / batchSize)}`);
      
      for (const bubbleUser of batch) {
        try {
          // Check if user already exists (by ID or email)
          const existingById = await prisma.user.findUnique({
            where: { id: bubbleUser.id }
          });
          
          const existingByEmail = await prisma.user.findUnique({
            where: { email: bubbleUser.email }
          });
          
          if (existingById || existingByEmail) {
            console.log(`Skipping ${bubbleUser.email} - already exists`);
            results.skipped++;
            continue;
          }
          
          // Create user with preserved Bubble ID
          await prisma.user.create({
            data: {
              id: bubbleUser.id, // CRITICAL: Preserve exact Bubble ID
              email: bubbleUser.email,
              name: bubbleUser.name || null,
              password: await hash('TEMP_PASSWORD_RESET_REQUIRED', 10),
              migratedFromBubble: true,
              bubbleUserId: bubbleUser.id,
              passwordResetRequired: true,
              migrationDate: new Date(),
              createdAt: new Date(bubbleUser.created_date),
            }
          });
          
          console.log(`✓ Migrated: ${bubbleUser.email} (ID: ${bubbleUser.id})`);
          results.migrated++;
          
        } catch (error) {
          console.error(`✗ Error migrating ${bubbleUser.email}:`, error);
          results.errors++;
          results.errorDetails.push(`${bubbleUser.email} (ID: ${bubbleUser.id}): ${error}`);
        }
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Calculate duration
    const duration = (new Date().getTime() - results.startTime.getTime()) / 1000;
    
    // Generate report
    console.log('\n=== Migration Summary ===');
    console.log(`Total users: ${users.length}`);
    console.log(`Migrated: ${results.migrated}`);
    console.log(`Skipped: ${results.skipped}`);
    console.log(`Errors: ${results.errors}`);
    console.log(`Duration: ${duration.toFixed(2)} seconds`);
    
    if (results.errorDetails.length > 0) {
      console.log('\nError Details:');
      results.errorDetails.forEach(detail => console.log(`  - ${detail}`));
    }
    
    // Save report to file
    const report = {
      ...results,
      endTime: new Date(),
      duration: `${duration.toFixed(2)} seconds`,
    };
    
    fs.writeFileSync(
      path.join(process.cwd(), 'migration-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\nMigration report saved to migration-report.json');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUsers();
```

### Validation Script

```typescript
// scripts/validate-migration.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function validateMigration() {
  const prisma = new PrismaClient();
  
  try {
    // Read original export
    const exportPath = path.join(process.cwd(), 'bubble-users-export.json');
    const bubbleUsers = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    
    const validations = {
      totalUsers: bubbleUsers.length,
      migratedCount: 0,
      idMatches: 0,
      passwordResetRequired: 0,
      foreignKeyIntegrity: {
        companies: 0,
        campaigns: 0,
        pitches: 0,
      },
      errors: [] as string[],
    };
    
    // Check each user
    for (const bubbleUser of bubbleUsers) {
      const migratedUser = await prisma.user.findUnique({
        where: { id: bubbleUser.id },
        include: {
          companies: true,
        }
      });
      
      if (!migratedUser) {
        validations.errors.push(`User ${bubbleUser.email} (ID: ${bubbleUser.id}) not found`);
        continue;
      }
      
      validations.migratedCount++;
      
      // Check ID match
      if (migratedUser.id === bubbleUser.id) {
        validations.idMatches++;
      } else {
        validations.errors.push(`ID mismatch for ${bubbleUser.email}`);
      }
      
      // Check password reset flag
      if (migratedUser.passwordResetRequired) {
        validations.passwordResetRequired++;
      }
      
      // Check foreign keys
      validations.foreignKeyIntegrity.companies += migratedUser.companies.length;
    }
    
    // Overall stats
    const stats = {
      ...validations,
      successRate: `${((validations.migratedCount / validations.totalUsers) * 100).toFixed(2)}%`,
      idMatchRate: `${((validations.idMatches / validations.migratedCount) * 100).toFixed(2)}%`,
    };
    
    console.log('\n=== Validation Results ===');
    console.log(`Total users: ${stats.totalUsers}`);
    console.log(`Migrated: ${stats.migratedCount} (${stats.successRate})`);
    console.log(`ID matches: ${stats.idMatches} (${stats.idMatchRate})`);
    console.log(`Password reset required: ${stats.passwordResetRequired}`);
    console.log(`Companies linked: ${stats.foreignKeyIntegrity.companies}`);
    console.log(`Errors: ${stats.errors.length}`);
    
    if (stats.errors.length > 0) {
      console.log('\nErrors:');
      stats.errors.forEach(err => console.log(`  - ${err}`));
    }
    
    // Save validation report
    fs.writeFileSync(
      path.join(process.cwd(), 'validation-report.json'),
      JSON.stringify(stats, null, 2)
    );
    
    // Exit with error if validation failed
    if (stats.errors.length > 0 || stats.migratedCount !== stats.totalUsers) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Validation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

validateMigration();
```

---

## Success Criteria

### Must Have
- [ ] 100% of users migrated successfully (3,000/3,000)
- [ ] All user IDs preserved exactly as in Bubble
- [ ] Zero data loss (all relationships intact)
- [ ] Users can log in after password reset
- [ ] All foreign key relationships verified
- [ ] Password reset flow works for migrated users
- [ ] New user signup works correctly
- [ ] All password reset emails sent successfully

### Should Have
- [ ] Migration completes in < 15 minutes for all 3,000 users
- [ ] Password reset emails sent within 10 minutes of migration
- [ ] < 5% of users require support assistance
- [ ] Zero critical bugs in production
- [ ] Email delivery rate > 95%

### Nice to Have
- [ ] Migration dashboard showing real-time progress
- [ ] Automated validation of data integrity
- [ ] Rollback script ready and tested
- [ ] Migration can be paused/resumed

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| User IDs don't match | High | Low | Validate IDs before migration, test with sample data |
| Password hashes unavailable | Medium | High | Implement password reset flow, communicate clearly |
| Foreign key violations | High | Medium | Validate relationships before migration, use transactions |
| Users unable to log in | High | Medium | Test thoroughly, provide support, keep Bubble as backup |
| Data loss during migration | Critical | Low | Database backup, test migration on copy first |
| Email delivery issues | Medium | Low | Use reliable email service (Resend), monitor delivery |
| Migration takes too long | Medium | Low | Batch processing, optimize database queries |
| Support overload | Medium | Medium | Pre-written FAQ, support team briefed, email templates |

---

## Timeline

### Week 1: Setup & Preparation
- [ ] Set up database (Supabase/PostgreSQL)
- [ ] Configure NextAuth.js
- [ ] Create Prisma schema
- [ ] Export data from Bubble (JSON format)
- [ ] Write migration script
- [ ] Write validation script

### Week 2: Development
- [ ] Implement NextAuth.js configuration
- [ ] Build password reset flow
- [ ] Create protected routes
- [ ] Set up email templates (Resend)
- [ ] Write tests
- [ ] Test migration script on sample data

### Week 3: Testing
- [ ] Test migration script on 100 sample users
- [ ] Validate data integrity
- [ ] User acceptance testing
- [ ] Load testing (3,000 users)
- [ ] Security review
- [ ] Email delivery testing

### Week 4: Migration
- [ ] Pre-migration email to all users (1 week before)
- [ ] Final database backup
- [ ] Run migration script (all 3,000 users)
- [ ] Run validation script
- [ ] Send password reset emails (batch)
- [ ] Monitor support channels
- [ ] Post-migration follow-up email (3 days after)
- [ ] Shut down Bubble.io (after validation period)

---

## Dependencies

### External Services
- **Database**: Supabase (PostgreSQL) or self-hosted PostgreSQL
- **Email**: Resend API (for password reset emails)
- **Hosting**: Vercel (for Next.js deployment)

### Internal Dependencies
- Database schema finalized
- Company/Campaign/Pitch models ready
- Email templates designed
- Support team briefed
- Bubble.io export completed (JSON format)

---

## Post-Migration Tasks

1. **Monitor** (Week 1-2):
   - User login success rate (target: >95%)
   - Password reset completion rate (target: >80% within 7 days)
   - Support ticket volume
   - Error logs
   - Email delivery rates

2. **Optimize** (Week 2-4):
   - Email delivery rates
   - Login performance
   - Password reset flow UX
   - Support response times

3. **Cleanup** (After 30 days):
   - Remove `passwordResetRequired` flags for users who reset
   - Archive Bubble.io data
   - Update documentation
   - Remove migration scripts (or archive)

---

## Migration Checklist

### Pre-Migration
- [ ] Database backup created
- [ ] Migration script tested on sample data (100+ users)
- [ ] Validation script tested
- [ ] All user IDs validated
- [ ] Foreign key relationships verified
- [ ] Email templates ready
- [ ] Support team briefed
- [ ] Rollback plan ready
- [ ] Monitoring set up
- [ ] Pre-migration email sent

### Migration Day
- [ ] Final database backup
- [ ] Bubble.io export file ready (`bubble-users-export.json`)
- [ ] Environment variables configured
- [ ] Run migration script
- [ ] Run validation script
- [ ] Verify all checks pass
- [ ] Send password reset emails (batch)
- [ ] Monitor email delivery
- [ ] Monitor support channels

### Post-Migration
- [ ] Track login success rate
- [ ] Track password reset completion
- [ ] Monitor error logs
- [ ] Send follow-up email (3 days)
- [ ] Support ticket triage
- [ ] Plan Bubble.io shutdown (after validation)

---

## Support Resources

### For Users
- **Migration FAQ**: `/migration-faq`
- **Password Reset Guide**: `/help/password-reset`
- **Support Email**: support@hecto.io
- **Status Page**: status.hecto.io

### For Support Team
- **Migration FAQ Document**
- **Common Issues & Solutions**
- **Escalation Process**
- **Rollback Procedure**

---

## Appendix

### A. Bubble.io Export Instructions
1. Go to Bubble.io Data tab → Users
2. Click "Export" → Select "JSON"
3. Include fields: `id`, `email`, `name`, `created_date`
4. Download file
5. Save as `bubble-users-export.json` in project root
6. Verify file contains ~3,000 users

### B. Expected JSON Format

```json
[
  {
    "id": "bubble_user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "created_date": "2024-01-15T10:30:00Z"
  },
  {
    "id": "bubble_user_124",
    "email": "another@example.com",
    "name": "Jane Smith",
    "created_date": "2024-01-16T14:20:00Z"
  }
]
```

### C. Email Templates

#### Pre-Migration Email
**Subject**: "Important: Platform Upgrade - Action Required"

**Body**:
```
Hi [Name],

We're upgrading the Hecto platform to provide you with a better experience.

On [DATE], we'll migrate your account to our new system. Here's what you need to know:

• Your account data will be preserved
• You'll need to reset your password (we'll send you a link)
• All your campaigns and pitches will remain accessible

We'll send you another email on migration day with your password reset link.

Questions? Reply to this email or contact support@hecto.io

Thanks,
The Hecto Team
```

#### Migration Day Email
**Subject**: "Welcome to Hecto - Set Your New Password"

**Body**:
```
Hi [Name],

Your account has been successfully migrated! 🎉

To get started, please set a new password:

[Reset Password Button/Link]

This link expires in 24 hours.

Once you've set your password, you can log in at app.hecto.io

All your campaigns, pitches, and messages are waiting for you.

Questions? Contact support@hecto.io

Thanks,
The Hecto Team
```

#### Follow-up Email
**Subject**: "Complete Your Account Setup"

**Body**:
```
Hi [Name],

Just a friendly reminder to complete your account setup.

If you haven't set your new password yet, click here:

[Reset Password Button/Link]

Need help? Check out our guide: [link]

Questions? Reply to this email.

Thanks,
The Hecto Team
```

---

## Open Questions (Resolved)

1. ✅ **Password Hashes**: Not available from Bubble - password reset required
2. ✅ **User Count**: ~3,000 users migrating
3. ✅ **Active Users**: All users migrating (no filtering)
4. ✅ **Bubble Shutdown**: As soon as migration validated (target: within 1 week)
5. ✅ **Data Export Format**: JSON format preferred

---

## Notes

- Migration will be performed during low-traffic hours (recommended: weekend)
- All users will receive password reset emails immediately after migration
- Support team should be on standby during migration window
- Bubble.io should remain accessible for 1 week post-migration as backup
- Monitor email delivery rates closely (Resend dashboard)

