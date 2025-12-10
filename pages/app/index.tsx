import { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Hero from '../../components/Hero';
import DataTable, { Campaign } from '../../components/DataTable';
import CampaignPanel from '../../components/CampaignPanel';
import styles from '../../styles/Dashboard.module.css';

// Mock data using new campaign format
const mockData: Campaign[] = [
  {
    id: 'cmp_12345',
    title: 'Ethical jewellery maker wanting to build partnership for a giveaway of latest collection',
    summary: 'We want to increase distribution and sign-ups. We want to advertise our giveaway across aligned media brands.',
    objective: 'Grow email list and increase awareness of latest collection through cross-promotion.',
    audience: {
      target_audience: 'Ethical shoppers, fashion-conscious millennials, sustainability-focused consumers',
      categories: ['Ethical Fashion', 'Sustainability', 'Lifestyle'],
      geography: 'UK & EU',
    },
    partnership_types_considered: ['Sponsored Content', 'Co-Branding', 'Giveaway Swap'],
    constraints: {
      budget: null,
      timeline: 'Seeking partners for Q2 launch',
      ideal_partner: 'Brands, creators, or newsletters in ethical fashion or sustainability niches',
      geography_constraints: 'English-speaking markets preferred',
    },
    company: {
      company_id: 'co_7890',
      name: 'EcoJewels',
      logo_url: '',
      one_liner: 'Sustainable jewellery brand crafting ethical pieces for conscious consumers.',
      website: 'https://ecojewels.com',
    },
    metrics: {
      domain_rating: 42,
      reach: 85000,
      match_score: 82,
    },
    metadata: {
      created_at: '2025-01-10T12:00:00Z',
      updated_at: '2025-01-11T15:30:00Z',
      status: 'Active',
    },
  },
  {
    id: 'cmp_23456',
    title: 'Fintech startup looking for newsletter sponsorships to reach crypto-curious audience',
    summary: 'Seeking aligned newsletters to sponsor content about our new DeFi savings product. Focus on education, not hype.',
    objective: 'Drive app downloads and waitlist sign-ups for Q2 product launch.',
    audience: {
      target_audience: 'Tech-savvy professionals, crypto-curious investors, personal finance enthusiasts',
      categories: ['Fintech', 'Crypto', 'Personal Finance'],
      geography: 'Global (English)',
    },
    partnership_types_considered: ['Sponsored Content', 'Ads / Sponsorship', 'Backlink Exchange'],
    constraints: {
      budget: '$2,000 - $5,000 per placement',
      timeline: 'Q1 2025',
      ideal_partner: 'Finance newsletters with 10k+ subscribers',
      geography_constraints: 'US, UK, Canada, Australia',
    },
    company: {
      company_id: 'co_8901',
      name: 'CoinBee',
      logo_url: '',
      one_liner: 'Making DeFi accessible for everyday savers.',
      website: 'https://coinbee.io',
    },
    metrics: {
      domain_rating: 58,
      reach: 120000,
      match_score: 76,
    },
    metadata: {
      created_at: '2025-01-08T09:00:00Z',
      updated_at: '2025-01-10T11:00:00Z',
      status: 'Needs Reply',
    },
  },
  {
    id: 'cmp_34567',
    title: 'Health & wellness brand seeking podcast guest opportunities',
    summary: 'Our founder wants to share insights on mindful productivity. Looking for business or wellness podcasts.',
    objective: 'Build thought leadership and drive traffic to our meditation app.',
    audience: {
      target_audience: 'Busy professionals, entrepreneurs, wellness seekers',
      categories: ['Wellness', 'Productivity', 'Business'],
      geography: 'US & UK',
    },
    partnership_types_considered: ['Podcast Guest', 'Content Collaboration'],
    constraints: {
      budget: null,
      timeline: 'Ongoing',
      ideal_partner: 'Podcasts in business, productivity, or wellness with engaged audience',
      geography_constraints: 'English-speaking',
    },
    company: {
      company_id: 'co_9012',
      name: 'MindfulWork',
      logo_url: '',
      one_liner: 'Meditation and focus tools for busy professionals.',
      website: 'https://mindfulwork.app',
    },
    metrics: {
      domain_rating: 35,
      reach: 45000,
      match_score: 68,
    },
    metadata: {
      created_at: '2025-01-05T14:00:00Z',
      updated_at: '2025-01-09T10:00:00Z',
      status: 'Draft',
    },
  },
  {
    id: 'cmp_45678',
    title: 'SaaS tool for creators wanting to partner with YouTube educators',
    summary: 'We help creators manage their finances. Looking for sponsored integrations with finance/creator economy channels.',
    objective: 'Acquire 500 new users through targeted creator partnerships.',
    audience: {
      target_audience: 'Content creators, YouTubers, freelancers, solopreneurs',
      categories: ['Creator Economy', 'Finance', 'SaaS'],
      geography: 'Global',
    },
    partnership_types_considered: ['Sponsored Content', 'Affiliate Partnership', 'Product Integration'],
    constraints: {
      budget: '$500 - $3,000 per video',
      timeline: 'Q1-Q2 2025',
      ideal_partner: 'YouTube channels focused on creator tools, finance for creators, or business',
      geography_constraints: 'English-speaking markets',
    },
    company: {
      company_id: 'co_0123',
      name: 'CreatorBooks',
      logo_url: '',
      one_liner: 'Accounting software built for the creator economy.',
      website: 'https://creatorbooks.co',
    },
    metrics: {
      domain_rating: 67,
      reach: 250000,
      match_score: 91,
    },
    metadata: {
      created_at: '2025-01-02T16:00:00Z',
      updated_at: '2025-01-08T09:30:00Z',
      status: 'Active',
    },
  },
  {
    id: 'cmp_56789',
    title: 'Plant-based food brand launching UK market expansion campaign',
    summary: "We're entering the UK market and want to partner with food bloggers, sustainability influencers, and lifestyle newsletters.",
    objective: 'Build brand awareness in UK market ahead of retail launch.',
    audience: {
      target_audience: 'Health-conscious foodies, vegans, sustainability advocates',
      categories: ['Food & Beverage', 'Sustainability', 'Health'],
      geography: 'UK',
    },
    partnership_types_considered: ['Sponsored Content', 'Product Reviews', 'Giveaway Swap'],
    constraints: {
      budget: null,
      timeline: 'March 2025 retail launch',
      ideal_partner: 'UK-based food bloggers and lifestyle newsletters',
      geography_constraints: 'UK only',
    },
    company: {
      company_id: 'co_1234',
      name: 'GreenBite',
      logo_url: '',
      one_liner: "Delicious plant-based meals that don't compromise on taste.",
      website: 'https://greenbite.com',
    },
    metrics: {
      domain_rating: 29,
      reach: 32000,
      match_score: 54,
    },
    metadata: {
      created_at: '2024-12-28T11:00:00Z',
      updated_at: '2025-01-07T14:00:00Z',
      status: 'Closed',
    },
  },
];


export default function DashboardPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleRowClick = (row: Campaign) => {
    setSelectedCampaign(row);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handlePitch = (campaign: Campaign) => {
    console.log('Send pitch to campaign:', campaign.id);
    // Open pitch modal or navigate to pitch page
  };

  const handleSave = (campaign: Campaign) => {
    console.log('Save campaign:', campaign.id);
    // Save to favorites
  };

  return (
    <AppLayout title="Dashboard" activeNav="dashboard">
      <div className={styles.dashboard}>
        {/* Hero */}
        <Hero
          title="Find your next campaign"
          subtitle="Connect with brands, pitch your ideas, and grow your business."
          ctaText="Create Campaign"
          onCtaClick={() => console.log('Create campaign')}
        />

        {/* Data Table / Card List */}
        <section className={styles.dataSection}>
          <DataTable data={mockData} onRowClick={handleRowClick} />
        </section>
      </div>

      {/* Campaign Detail Panel */}
      <CampaignPanel
        campaign={selectedCampaign}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onPitch={handlePitch}
        onSave={handleSave}
      />
    </AppLayout>
  );
}
