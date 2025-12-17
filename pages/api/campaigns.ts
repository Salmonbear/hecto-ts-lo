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
    // Get user's companies first
    const companies = await prisma.company.findMany({
      where: { userId },
      select: { id: true },
    });

    const companyIds = companies.map((c) => c.id);

    // Get all campaigns (either created by user OR for their companies)
    const campaigns = await prisma.campaign.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { companyId: { in: companyIds } },
        ],
      },
      include: {
        company: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        creator: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to Campaign format expected by UI
    const transformedCampaigns = campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.headline || 'Untitled Campaign',
      summary: campaign.longDescription || 'No description provided',
      objective: campaign.targetAudience || 'Not specified',
      audience: {
        target_audience: campaign.targetAudience || 'Not specified',
        categories: campaign.acceptedPartnershipTypes || [],
        geography: 'Not specified',
      },
      partnership_types_considered: campaign.acceptedPartnershipTypes || [],
      constraints: {
        budget: null,
        timeline: 'Not specified',
        ideal_partner: 'Not specified',
        geography_constraints: 'Not specified',
      },
      company: {
        company_id: campaign.company.id,
        name: campaign.company.name || 'Unknown Company',
        logo_url: campaign.company.logoUrl || '',
        one_liner: campaign.company.shortSummary || campaign.company.longSummary || 'No description',
        website: campaign.company.website || '',
      },
      metrics: {
        domain_rating: 0,
        reach: 0,
        match_score: 0,
      },
      metadata: {
        created_at: campaign.createdAt.toISOString(),
        updated_at: campaign.updatedAt.toISOString(),
        status: 'Active',
      },
    }));

    return res.status(200).json(transformedCampaigns);
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
}
