import { Plus, Filter, Download, RefreshCw } from 'lucide-react';
import styles from './ActionToolbar.module.css';

interface ActionToolbarProps {
  onNewCampaign?: () => void;
  onNewPitch?: () => void;
  onFilter?: () => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

export default function ActionToolbar({
  onNewCampaign,
  onNewPitch,
  onFilter,
  onExport,
  onRefresh,
}: ActionToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.primaryActions}>
        <button className={styles.primaryButton} onClick={onNewCampaign}>
          <Plus size={18} />
          <span>New Campaign</span>
        </button>
        <button className={styles.secondaryButton} onClick={onNewPitch}>
          <Plus size={18} />
          <span>New Pitch</span>
        </button>
      </div>

      <div className={styles.secondaryActions}>
        <button className={styles.iconButton} onClick={onRefresh} title="Refresh">
          <RefreshCw size={18} />
        </button>
        <button className={styles.iconButton} onClick={onFilter} title="Filter">
          <Filter size={18} />
        </button>
        <button className={styles.iconButton} onClick={onExport} title="Export">
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}

