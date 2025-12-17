import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get users with campaigns
    const usersWithCampaigns = await prisma.user.findMany({
      where: {
        companies: {
          some: {
            campaigns: {
              some: {},
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        companies: {
          include: {
            campaigns: {
              select: {
                id: true,
                headline: true,
              },
            },
          },
        },
      },
      take: 20,
    });

    const stats = {
      totalUsersWithCampaigns: usersWithCampaigns.length,
      users: usersWithCampaigns.map((u) => ({
        email: u.email,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'No name',
        companiesCount: u.companies.length,
        campaignsCount: u.companies.reduce((sum, c) => sum + c.campaigns.length, 0),
        campaigns: u.companies.flatMap((c) =>
          c.campaigns.map((camp) => ({
            companyName: c.name,
            headline: camp.headline,
          }))
        ),
      })),
    };

    return res.status(200).json(stats);
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
