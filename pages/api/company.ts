import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    // Get user's company/companies
    const companies = await prisma.company.findMany({
      where: { userId },
      include: {
        newsletterStats: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        packages: {
          where: {
            status: { not: 'Draft' },
          },
        },
        campaigns: {
          select: {
            id: true,
            headline: true,
            createdAt: true,
          },
        },
      },
    });

    return res.status(200).json(companies);
  } catch (error: any) {
    console.error('Error fetching company:', error);
    return res.status(500).json({ error: 'Failed to fetch company data' });
  }
}
