import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStatus() {
  const userCount = await prisma.user.count();
  const companyCount = await prisma.company.count();
  const campaignCount = await prisma.campaign.count();

  console.log('Database Status:');
  console.log(`Users: ${userCount}`);
  console.log(`Companies: ${companyCount}`);
  console.log(`Campaigns: ${campaignCount}`);

  await prisma.$disconnect();
}

checkStatus();
