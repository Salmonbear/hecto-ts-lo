import { MoreHorizontal, Eye } from 'lucide-react';
import styles from './DataTable.module.css';

export type StatusType = 'draft' | 'active' | 'warning' | 'success' | 'danger';

export interface Campaign {
  id: string;
  title: string;
  summary: string;
  objective?: string;
  audience?: {
    target_audience: string;
    categories: string[];
    geography: string;
  };
  partnership_types_considered?: string[];
  constraints?: {
    budget: string | null;
    timeline: string;
    ideal_partner: string;
    geography_constraints: string;
  };
  company: {
    company_id: string;
    name: string;
    logo_url?: string;
    one_liner: string;
    website: string;
  };
  metrics: {
    domain_rating: number;
    reach: number;
    match_score: number;
  };
  metadata: {
    created_at: string;
    updated_at: string;
    status: string;
  };
}

interface DataTableProps {
  data: Campaign[];
  onRowClick?: (row: Campaign) => void;
  blurFromRow?: number; // 1-indexed, rows from this number onwards will be blurred
}

const getStatusType = (status: string): StatusType => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'active';
    case 'draft':
      return 'draft';
    case 'closed':
    case 'declined':
      return 'danger';
    case 'pending':
    case 'needs reply':
      return 'warning';
    case 'accepted':
    case 'completed':
      return 'success';
    default:
      return 'draft';
  }
};

const statusStyles: Record<StatusType, string> = {
  draft: 'badgeDraft',
  active: 'badgeActive',
  warning: 'badgeWarning',
  success: 'badgeSuccess',
  danger: 'badgeDanger',
};

export default function DataTable({ data, onRowClick, blurFromRow }: DataTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Summary</th>
              <th>DR</th>
              <th>Reach</th>
              <th>Match</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const isBlurred = blurFromRow !== undefined && index + 1 >= blurFromRow;
              return (
              <tr
                key={row.id}
                onClick={() => !isBlurred && onRowClick?.(row)}
                className={`${styles.row} ${isBlurred ? styles.blurredRow : ''}`}
              >
                <td>
                  <div className={styles.campaignCell}>
                    <div className={styles.categoryIcon}>
                      <span>{row.audience?.categories?.[0]?.charAt(0) || '?'}</span>
                    </div>
                    <div className={styles.campaignInfo}>
                      <span className={styles.campaignTitle}>{row.title}</span>
                      <span className={styles.categoryLabel}>{row.audience?.categories?.[0] || 'Uncategorized'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.summary}>{row.summary}</span>
                </td>
                <td>
                  <span className={styles.metricValue}>{row.metrics.domain_rating}</span>
                </td>
                <td>
                  <span className={styles.metricValue}>{row.metrics.reach.toLocaleString()}</span>
                </td>
                <td>
                  <span className={styles.matchScore}>{row.metrics.match_score}%</span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      title="More"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className={styles.cardList}>
        {data.map((row, index) => {
          const isBlurred = blurFromRow !== undefined && index + 1 >= blurFromRow;
          return (
          <div
            key={row.id}
            className={`${styles.card} ${isBlurred ? styles.blurredCard : ''}`}
            onClick={() => !isBlurred && onRowClick?.(row)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.campaignCell}>
                <div className={styles.categoryIcon}>
                  <span>{row.audience?.categories?.[0]?.charAt(0) || '?'}</span>
                </div>
                <div className={styles.campaignInfo}>
                  <span className={styles.campaignTitle}>{row.title}</span>
                  <span className={styles.categoryLabel}>{row.audience?.categories?.[0] || 'Uncategorized'}</span>
                </div>
              </div>
              <span className={styles.matchScore}>{row.metrics.match_score}%</span>
            </div>
            <p className={styles.cardSummary}>{row.summary}</p>
            <div className={styles.cardMetrics}>
              <span className={styles.cardMetric}>DR: {row.metrics.domain_rating}</span>
              <span className={styles.cardMetric}>Reach: {row.metrics.reach.toLocaleString()}</span>
            </div>
          </div>
        );
        })}
      </div>
    </>
  );
}
