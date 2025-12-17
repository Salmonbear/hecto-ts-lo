generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  // Bubble's "unique id"
  id                    String    @id // CRITICAL: Preserve exact Bubble User ID
  email                 String    @unique
  emailVerified         DateTime?
  firstName             String?    
  lastName              String?    
  intention             String?    // e.g., "Buy & Sell"
  mailOptIn             Boolean?   
  profilePic            String?    
  stripeSellerId        String?    
  
  // NextAuth required fields
  password              String?    // bcrypt hash, set on reset
  image                 String?    // Maps to profilePic

  // Migration tracking
  migratedFromBubble    Boolean   @default(false)
  bubbleUserId          String?   @unique // Store original Bubble ID here for clarity (same as 'id' for migrated users)
  migrationDate         DateTime?
  passwordResetRequired Boolean   @default(false)
  
  createdAt             DateTime  @default(now()) @map("creation_date") 
  updatedAt             DateTime  @autoupdate @map("modified_date")   
  
  // Relationships
  accounts              Account[]
  sessions              Session[]
  companies             Company[] // One-to-many: a User can own multiple Companies
  pitches               Pitch[]   // A user can create many pitches
  createdCampaigns      Campaign[] @relation("UserCreatedCampaigns") // Campaigns directly created by this user
}

model Company {
  // Bubble's "unique id" for Brands / Newsletters
  id                    String    @id // CRITICAL: Preserve exact Bubble Brand or Newsletter ID
  
  // Relationship to User (Owner/Creator)
  userId                String    @map("owner_user_id") // Links to User.id (owner)
  user                  User      @relation(fields: [userId], references: [id])
  creatorEmail          String?   // Store Bubble's "Creator" email for migration script reference

  // From Bubble's Brand data type
  advertisingGoals      String?
  name                  String?   @map("brand_name") // Can be Brand Name or Newsletter Business Name
  website               String?   @map("brand_website")
  campaignBudget        String?   @map("campaign_budget") // This might need type conversion if it's a number
  logoUrl               String?   @map("logo_url")      
  // longSummary and shortSummary are populated conditionally during migration:
  // - From Brand's "Long Summary"/"Short Summary" for Brands
  // - From Newsletter's "Summary - Long"/"Summary - Short" for Newsletters
  longSummary           String?   @map("long_summary")  
  shortSummary          String?   @map("short_summary") 
  tags                  String[]? // comma-separated string to array (from Brand or Newsletter tags)
  verified              Boolean?  // From Brand or Newsletter verification
  slug                  String?
  
  // From Bubble's Newsletter data type (amalgamated)
  isNewsletter          Boolean   @default(false) // Flag to indicate if this Company originated as a Newsletter
  newsletterCategory    String?   @map("newsletter_category")
  newsletterFreq        String?   @map("newsletter_freq")
  newsletterStartingPrice String? @map("newsletter_starting_price") // If it's a newsletter, its base pricing
  newsletterSummaryLong TEXT?     @map("newsletter_summary_long")
  newsletterSummaryShort TEXT?    @map("newsletter_summary_short")
  newsletterProofUrl    String?   @map("newsletter_proof_url") // From NewsletterStats proof
  
  // Consolidated Social Links (from Brand or Newsletter)
  socialFbUrl           String?   @map("social_fb_url")
  socialTwitterUrl      String?   @map("social_twitter_url")
  
  createdAt             DateTime  @default(now()) @map("creation_date") 
  updatedAt             DateTime  @autoupdate @map("modified_date")   

  // Relationships
  campaigns             Campaign[] // One-to-many: a Company can have many Campaigns
  subscriptions         Subscription[]
  newsletterStats       NewsletterStats[] // Newsletter Stats now link directly to Company (if Company IS a Newsletter)
}

model Campaign {
  // Bubble's "unique id" for Campaigns
  id                       String    @id // CRITICAL: Preserve exact Bubble Campaign ID

  // Relationship to Company (Brand/Newsletter Requesting)
  companyId                String    @map("requesting_company_id") // Links to Company.id
  company                  Company   @relation(fields: [companyId], references: [id])
  
  // Relationship to User (Campaign Creator)
  creatorId                String?   @map("creator_user_id") // Links to User.id (User who created campaign)
  creator                  User?     @relation("UserCreatedCampaigns", fields: [creatorId], references: [id])

  // From Bubble's Campaign data type
  acceptedPartnershipTypes String[]? @map("accepted_partnership_types") // comma-separated to array
  headline                 String?   @map("campaign_headline")
  longDescription          String?   @map("campaign_long_description")
  targetAudience           String?   @map("target_audience")
  slug                     String?
  
  createdAt                DateTime  @default(now()) @map("creation_date") 
  updatedAt                DateTime  @autoupdate @map("modified_date")   

  // Relationships
  pitches                  Pitch[]

  @@index([companyId])
  @@index([creatorId])
}


// NextAuth required models
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

// Additional models (excluding Inventory, Newsletter amalgamated)

model Subscription {
  id          String    @id @default(cuid())
  companyId   String    @unique
  company     Company   @relation(fields: [companyId], references: [id])
  plan        String?
  status      String?
  stripeCustomerId String?
  stripeSubscriptionId String?
  currentPeriodStart DateTime?
  currentPeriodEnd  DateTime?
  campaignLimit     Int?
  pitchLimit        Int?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @autoupdate
}

model Pitch {
  id         String   @id @default(cuid())
  userId     String   // The user who made the pitch
  user       User     @relation(fields: [userId], references: [id])
  
  // A Pitch can be for a specific Campaign OR directly to a Company
  campaignId String?  // Optional: links to a specific Campaign
  campaign   Campaign? @relation(fields: [campaignId], references: [id]) 
  
  companyId  String?  // Optional: links directly to a Company (for general pitches)
  company    Company? @relation(fields: [companyId], references: [id])  
  
  proposal      String
  budgetOffered String?
  timelineProposed String?
  status        String   @default("sent")
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @autoupdate
  
  messages   Message[]
}

model Message {
  id         String   @id @default(cuid())
  pitchId    String
  senderId   String
  recipientId String
  
  pitch      Pitch    @relation(fields: [pitchId], references: [id])
  sender     User     @relation(fields: [senderId], references: [id])
  recipient  User     @relation(fields: [recipientId], references: [id])
  
  content    String
  messageType String @default("text")
  readAt     DateTime?
  
  createdAt  DateTime @default(now())
}

// NewsletterStats now link directly to a Company (which might be a migrated Newsletter)
model NewsletterStats {
  id           String   @id @default(cuid())
  companyId    String
  company      Company  @relation(fields: [companyId], references: [id])
  date         DateTime // Date for which stats are recorded
  subscribers  Int?
  openRate     Float?
  clickRate    Float?
  // ... other stats
  createdAt    DateTime @default(now())
}

model Package {
  id        String   @id @default(cuid())
  companyId String? 
  campaignId String? 
  
  company   Company?  @relation(fields: [companyId], references: [id])
  campaign  Campaign? @relation(fields: [campaignId], references: [id])
  
  name      String
  description String?
  price     Float?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @autoupdate
}