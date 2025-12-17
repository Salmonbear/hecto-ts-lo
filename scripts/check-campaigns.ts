import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCampaigns() {
  // Get total campaigns
  const totalCampaigns = await prisma.campaign.count();
  console.log('Total campaigns:', totalCampaigns);

  // Get a sample campaign with company info
  const sampleCampaigns = await prisma.campaign.findMany({
    take: 5,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          userId: true,
          isNewsletter: true
        }
      }
    }
  });

  console.log('\nSample campaigns:');
  sampleCampaigns.forEach(c => {
    console.log({
      campaignId: c.id,
      headline: c.headline,
      companyId: c.companyId,
      companyName: c.company.name,
      companyUserId: c.company.userId,
      isNewsletter: c.company.isNewsletter
    });
  });

  await prisma.$disconnect();
}

checkCampaigns();
