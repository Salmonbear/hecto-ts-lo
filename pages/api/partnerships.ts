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
    // Get user's companies to determine what pitches to show
    const companies = await prisma.company.findMany({
      where: { userId },
      select: { id: true, isNewsletter: true },
    });

    const companyIds = companies.map((c) => c.id);
    const isNewsletter = companies.some((c) => c.isNewsletter);

    // Get pitches based on user type
    const pitches = await prisma.pitch.findMany({
      where: isNewsletter
        ? {
            // Newsletter users see pitches they received
            newsletterId: { in: companyIds },
          }
        : {
            // Brand users see pitches they sent
            senderId: userId,
          },
      include: {
        campaign: {
          include: {
            company: {
              select: {
                name: true,
                logoUrl: true,
              },
            },
          },
        },
        newsletter: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
        sender: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            content: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ pitches, isNewsletter });
  } catch (error: any) {
    console.error('Error fetching partnerships:', error);
    return res.status(500).json({ error: 'Failed to fetch partnerships' });
  }
}
