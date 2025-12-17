const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findUsersWithCampaigns() {
  // Get campaigns with their companies and users
  const campaigns = await prisma.campaign.findMany({
    take: 10,
    include: {
      company: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`Total campaigns found: ${campaigns.length}\n`);

  campaigns.forEach((campaign, idx) => {
    console.log(`${idx + 1}. Campaign: ${campaign.headline || 'Untitled'}`);
    console.log(`   Company: ${campaign.company.name}`);
    console.log(`   User: ${campaign.company.user.firstName} ${campaign.company.user.lastName} (${campaign.company.user.email})`);
    console.log(`   UserId: ${campaign.company.user.id}`);
    console.log('');
  });

  await prisma.$disconnect();
}

findUsersWithCampaigns().catch(console.error);
