import { useState } from 'react';
import { Megaphone, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import AppLayout from '../../components/AppLayout';
import StatCard from '../../components/StatCard';
import ActionToolbar from '../../components/ActionToolbar';
import Tabs from '../../components/Tabs';
import DataTable, { DataRow } from '../../components/DataTable';
import styles from '../../styles/Dashboard.module.css';

// Mock data
const mockData: DataRow[] = [
  {
    id: '1',
    name: 'Summer Product Launch',
    company: 'TechFlow Inc',
    type: 'campaign',
    status: 'active',
    statusLabel: 'Active',
    date: 'Dec 5, 2024',
    budget: '$5,000',
  },
  {
    id: '2',
    name: 'Brand Partnership Proposal',
    company: 'CoinBee',
    type: 'pitch',
    status: 'warning',
    statusLabel: 'Needs Reply',
    date: 'Dec 4, 2024',
    budget: '$3,500',
  },
  {
    id: '3',
    name: 'Q1 Influencer Campaign',
    company: 'Acme Corp',
    type: 'campaign',
    status: 'draft',
    statusLabel: 'Draft',
    date: 'Dec 3, 2024',
    budget: '$8,000',
  },
  {
    id: '4',
    name: 'Social Media Takeover',
    company: 'StartupXYZ',
    type: 'pitch',
    status: 'success',
    statusLabel: 'Accepted',
    date: 'Dec 2, 2024',
    budget: '$2,500',
  },
  {
    id: '5',
    name: 'Holiday Promo Series',
    company: 'RetailMax',
    type: 'campaign',
    status: 'active',
    statusLabel: 'Active',
    date: 'Dec 1, 2024',
    budget: '$12,000',
  },
  {
    id: '6',
    name: 'Ambassador Program Pitch',
    company: 'FitLife',
    type: 'pitch',
    status: 'danger',
    statusLabel: 'Declined',
    date: 'Nov 30, 2024',
    budget: '$4,000',
  },
  {
    id: '7',
    name: 'App Launch Campaign',
    company: 'MobileFirst',
    type: 'campaign',
    status: 'warning',
    statusLabel: 'Needs Reply',
    date: 'Nov 29, 2024',
    budget: '$6,500',
  },
];

const tabs = [
  { id: 'all', label: 'All', count: 24 },
  { id: 'campaigns', label: 'My Campaigns', count: 8 },
  { id: 'incoming', label: 'Incoming Pitches', count: 12 },
  { id: 'attention', label: 'Needs Attention', count: 4 },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('all');

  const handleRowClick = (row: DataRow) => {
    console.log('Clicked row:', row);
    // Navigate to detail view
  };

  return (
    <AppLayout title="Dashboard" activeNav="dashboard">
      <div className={styles.dashboard}>
        {/* Stats Row */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <StatCard
              icon={<Megaphone size={24} />}
              label="Active Campaigns"
              value={12}
              trend={{ value: 8, isPositive: true }}
              variant="active"
            />
            <StatCard
              icon={<Send size={24} />}
              label="Pending Pitches"
              value={28}
              trend={{ value: 12, isPositive: true }}
              variant="default"
            />
            <StatCard
              icon={<AlertCircle size={24} />}
              label="Needs Reply"
              value={4}
              variant="warning"
            />
            <StatCard
              icon={<CheckCircle2 size={24} />}
              label="Completed Deals"
              value={156}
              trend={{ value: 23, isPositive: true }}
              variant="success"
            />
          </div>
        </section>

        {/* Action Toolbar */}
        <section className={styles.toolbarSection}>
          <ActionToolbar
            onNewCampaign={() => console.log('New campaign')}
            onNewPitch={() => console.log('New pitch')}
            onFilter={() => console.log('Filter')}
            onExport={() => console.log('Export')}
            onRefresh={() => console.log('Refresh')}
          />
        </section>

        {/* Tabs */}
        <section className={styles.tabsSection}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </section>

        {/* Data Table / Card List */}
        <section className={styles.dataSection}>
          <DataTable data={mockData} onRowClick={handleRowClick} />
        </section>
      </div>
    </AppLayout>
  );
}
