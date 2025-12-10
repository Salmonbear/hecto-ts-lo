import { MoreHorizontal, Eye } from 'lucide-react';
import styles from './DataTable.module.css';

export type StatusType = 'draft' | 'active' | 'warning' | 'success' | 'danger';

export interface DataRow {
  id: string;
  name: string;
  company: string;
  companyLogo?: string;
  type: 'campaign' | 'pitch';
  status: StatusType;
  statusLabel: string;
  date: string;
  budget?: string;
}

interface DataTableProps {
  data: DataRow[];
  onRowClick?: (row: DataRow) => void;
}

const statusStyles: Record<StatusType, string> = {
  draft: 'badgeDraft',
  active: 'badgeActive',
  warning: 'badgeWarning',
  success: 'badgeSuccess',
  danger: 'badgeDanger',
};

export default function DataTable({ data, onRowClick }: DataTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Budget</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={styles.row}
              >
                <td>
                  <span className={styles.name}>{row.name}</span>
                </td>
                <td>
                  <div className={styles.company}>
                    {row.companyLogo ? (
                      <img
                        src={row.companyLogo}
                        alt=""
                        className={styles.companyLogo}
                      />
                    ) : (
                      <div className={styles.companyInitial}>
                        {row.company.charAt(0)}
                      </div>
                    )}
                    <span>{row.company}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.type}>{row.type}</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[statusStyles[row.status]]}`}>
                    {row.statusLabel}
                  </span>
                </td>
                <td>
                  <span className={styles.date}>{row.date}</span>
                </td>
                <td>
                  <span className={styles.budget}>{row.budget || '—'}</span>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className={styles.cardList}>
        {data.map((row) => (
          <div
            key={row.id}
            className={styles.card}
            onClick={() => onRowClick?.(row)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.company}>
                {row.companyLogo ? (
                  <img
                    src={row.companyLogo}
                    alt=""
                    className={styles.companyLogo}
                  />
                ) : (
                  <div className={styles.companyInitial}>
                    {row.company.charAt(0)}
                  </div>
                )}
                <div className={styles.cardMeta}>
                  <span className={styles.name}>{row.name}</span>
                  <span className={styles.companyName}>{row.company}</span>
                </div>
              </div>
              <span className={`${styles.badge} ${styles[statusStyles[row.status]]}`}>
                {row.statusLabel}
              </span>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.type}>{row.type}</span>
              <span className={styles.date}>{row.date}</span>
              {row.budget && <span className={styles.budget}>{row.budget}</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

