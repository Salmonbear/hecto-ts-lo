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
    // Get users with their companies
    const users = await prisma.user.findMany({
      take: 100,
      orderBy: { email: 'asc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        companies: {
          select: {
            id: true,
            name: true,
            isNewsletter: true,
          },
        },
      },
      where: {
        companies: {
          some: {},
        },
      },
    });

    return res.status(200).json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}
