import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pitchId } = req.query;

  if (!pitchId || typeof pitchId !== 'string') {
    return res.status(400).json({ error: 'pitchId is required' });
  }

  if (req.method === 'GET') {
    try {
      const messages = await prisma.message.findMany({
        where: { pitchId },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profilePic: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      return res.status(200).json(messages);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { authorId, content } = req.body;

      if (!authorId || !content) {
        return res.status(400).json({ error: 'authorId and content are required' });
      }

      const message = await prisma.message.create({
        data: {
          pitchId,
          authorId,
          content,
        },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profilePic: true,
            },
          },
        },
      });

      return res.status(201).json(message);
    } catch (error: any) {
      console.error('Error creating message:', error);
      return res.status(500).json({ error: 'Failed to create message' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
