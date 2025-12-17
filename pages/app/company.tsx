import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import UserSelector from '../../components/UserSelector';
import styles from '../../styles/Company.module.css';
import { LineChart, TrendingUp, Users, Mail } from 'lucide-react';

interface NewsletterStat {
  date: string;
  subscribers: number | null;
  openRate: number | null;
  clickRate: number | null;
}

interface Package {
  id: string;
  title: string | null;
  price: string | null;
  description: string | null;
}

interface Company {
  id: string;
  name: string | null;
  website: string | null;
  logoUrl: string | null;
  shortSummary: string | null;
  longSummary: string | null;
  isNewsletter: boolean;
  newsletterCategory: string | null;
  newsletterFreq: string | null;
  newsletterStats: NewsletterStat[];
  packages: Package[];
  campaigns: Array<{ id: string; headline: string | null }>;
}

export default function CompanyPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [useRealData, setUseRealData] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!useRealData || !selectedUserId) {
      setCompanies([]);
      return;
    }

    setLoading(true);
    fetch(`/api/company?userId=${selectedUserId}`)
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching company:', err);
        setLoading(false);
      });
  }, [selectedUserId, useRealData]);

  const company = companies[0]; // For now, show first company

  return (
    <AppLayout title="My Company" activeNav="company">
      <UserSelector
        selectedUserId={selectedUserId}
        onUserSelect={setSelectedUserId}
        useRealData={useRealData}
        onToggleData={setUseRealData}
      />

      <div className={styles.container}>
        {loading ? (
          <div className={styles.loading}>Loading company data...</div>
        ) : !useRealData ? (
          <div className={styles.placeholder}>
            <p>Toggle to "Real DB" to view company data</p>
          </div>
        ) : !company ? (
          <div className={styles.empty}>
            <p>No company found for this user</p>
            <p className={styles.hint}>This user hasn't created a company profile yet.</p>
          </div>
        ) : (
          <>
            {/* Company Profile */}
            <section className={styles.profileSection}>
              <div className={styles.profileHeader}>
                {company.logoUrl && (
                  <img
                    src={company.logoUrl}
                    alt={company.name || 'Company logo'}
                    className={styles.logo}
                  />
                )}
                <div className={styles.profileInfo}>
                  <h1>{company.name || 'Untitled Company'}</h1>
                  <p className={styles.type}>
                    {company.isNewsletter ? 'Newsletter' : 'Brand'}
                  </p>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className={styles.website}>
                      {company.website}
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.description}>
                <h3>About</h3>
                <p>{company.shortSummary || company.longSummary || 'No description provided'}</p>
              </div>

              {company.isNewsletter && (
                <div className={styles.newsletterInfo}>
                  <div className={styles.infoItem}>
                    <strong>Category:</strong> {company.newsletterCategory || 'Not specified'}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Frequency:</strong> {company.newsletterFreq || 'Not specified'}
                  </div>
                </div>
              )}
            </section>

            {/* Newsletter Stats */}
            {company.isNewsletter && company.newsletterStats.length > 0 && (
              <section className={styles.statsSection}>
                <h2><LineChart size={20} /> Newsletter Performance</h2>
                <div className={styles.statsGrid}>
                  {company.newsletterStats.slice(0, 1).map((stat) => (
                    <div key={stat.date}>
                      <div className={styles.statCard}>
                        <Users size={24} />
                        <div>
                          <div className={styles.statLabel}>Subscribers</div>
                          <div className={styles.statValue}>{stat.subscribers?.toLocaleString() || 'N/A'}</div>
                        </div>
                      </div>
                      <div className={styles.statCard}>
                        <Mail size={24} />
                        <div>
                          <div className={styles.statLabel}>Open Rate</div>
                          <div className={styles.statValue}>
                            {stat.openRate ? `${(stat.openRate * 100).toFixed(1)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className={styles.statCard}>
                        <TrendingUp size={24} />
                        <div>
                          <div className={styles.statLabel}>Click Rate</div>
                          <div className={styles.statValue}>
                            {stat.clickRate ? `${(stat.clickRate * 100).toFixed(1)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Packages */}
            {company.isNewsletter && company.packages.length > 0 && (
              <section className={styles.packagesSection}>
                <h2>Pricing Packages</h2>
                <div className={styles.packagesGrid}>
                  {company.packages.map((pkg) => (
                    <div key={pkg.id} className={styles.packageCard}>
                      <h3>{pkg.title || 'Untitled Package'}</h3>
                      <div className={styles.price}>{pkg.price || 'Price not set'}</div>
                      <p className={styles.packageDesc}>{pkg.description || 'No description'}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Campaigns */}
            {!company.isNewsletter && company.campaigns.length > 0 && (
              <section className={styles.campaignsSection}>
                <h2>My Campaigns ({company.campaigns.length})</h2>
                <div className={styles.campaignsList}>
                  {company.campaigns.map((campaign) => (
                    <div key={campaign.id} className={styles.campaignItem}>
                      {campaign.headline || 'Untitled Campaign'}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
