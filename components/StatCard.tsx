import { ReactNode } from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'active' | 'warning' | 'success' | 'danger';
}

export default function StatCard({
  icon,
  label,
  value,
  trend,
  variant = 'default',
}: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <div className={styles.valueRow}>
          <span className={styles.value}>{value.toLocaleString()}</span>
          {trend && (
            <span
              className={`${styles.trend} ${
                trend.isPositive ? styles.trendUp : styles.trendDown
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

